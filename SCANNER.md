# How the Orbit Scanner Works
### A plain English guide to the full setup

---

## The Big Idea

Orbit is a Chrome Extension. It scans websites for accessibility problems using a tool called **axe-core**.

When you click "Run Scan", here is what happens:

```
You click button
    → Side Panel sends a message
        → Background receives it and forwards it
            → Content Script runs the scan
                → Results come back the same way
                    → UI displays the results
```

Simple right? But getting these three pieces to talk to each other took some work. This guide explains every step.

---

## Why Is This Complicated?

A Chrome Extension is not one program. It is **three separate programs** that cannot directly talk to each other:

| Program | What It Does | Where It Lives |
|---|---|---|
| **Side Panel** | The UI you see. Buttons, results, etc. | Its own sandboxed window |
| **Background Service Worker** | The middleman. Forwards messages. | Behind the scenes, no UI |
| **Content Script** | Gets injected into the webpage. Runs the scan. | Inside the webpage you are visiting |

Think of it like three people in three separate rooms. They can pass notes under the door, but they cannot walk into each other's rooms.

This means:
- The Side Panel **cannot** talk directly to the Content Script
- Everything goes **through** the Background Service Worker
- The Background acts like a post office — it receives and forwards messages

---

## The Files That Matter

```
orbit/
├── src/
│   ├── content.ts        ← runs the axe scan on the webpage
│   ├── Scanner.tsx        ← the UI button and results display
│   └── types.ts           ← TypeScript type definitions
├── background.js          ← the message forwarder
├── manifest.json          ← tells Chrome how the extension is set up
├── vite.config.ts         ← tells Vite how to build the React app
└── package.json           ← build scripts and dependencies
```

---

## Step 1 — Set Up Your Types

**File:** `src/types.ts`

**What:** TypeScript needs to know the shape of the data coming back from axe-core.

**Why:** Without this, TypeScript has no idea what a "violation" looks like. It would complain constantly and you would lose all the safety benefits of TypeScript.

**How:**

```typescript
import type { NodeResult } from "axe-core";

export type Tab = "scanner" | "tools" | "colors" | "checklist";

export interface AxeViolation {
    id: string;
    description: string;
    help: string;
    helpUrl: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    nodes: NodeResult[];
}
```

**Breaking it down:**
- `id` — the name of the violation (example: `"color-contrast"`)
- `description` — what the problem is
- `help` — how to fix it
- `helpUrl` — a link to the full documentation
- `impact` — how bad it is. Can only ever be one of four specific words (that is a **union type**)
- `nodes` — the actual HTML elements on the page that have the problem. We use axe-core's built in `NodeResult` type here so we do not have to define it ourselves

---

## Step 2 — Build the Content Script the Right Way

**File:** `package.json` and `vite.config.ts`

**What:** We need to build `content.ts` into a single file that Chrome can inject into webpages.

**Why this is tricky:**

`content.ts` uses this line at the top:

```typescript
import axe from "axe-core"
```

That `import` statement is called **ES Module syntax**. It is the modern JavaScript way of loading code from another file.

The problem is Chrome injects content scripts like a plain old script tag:

```html
<script src="content.js"></script>
```

A plain script tag does not understand `import`. It just runs the file top to bottom. When Chrome hit that `import` line it threw an error and stopped.

**The fix — use IIFE format:**

IIFE stands for **Immediately Invoked Function Expression**. Instead of importing anything from outside, it takes ALL the code (including all of axe-core) and wraps it into one giant self-contained function:

```javascript
(() => {
    // ALL of axe-core is pasted in here
    // ALL of your content.ts code is in here
    // nothing is imported from anywhere
    // Chrome is happy
})();
```

Everything Chrome needs is in one file. No imports. No outside dependencies. No errors.

**We use a tool called esbuild to do this.**

esbuild is a super fast JavaScript bundler. It was already installed inside your project as part of Vite.

**Changes to make:**

In `package.json`, update the build script:

```json
"build": "tsc -b && vite build && node_modules/.bin/esbuild src/content.ts --bundle --outfile=dist/content.js --format=iife"
```

What each part does:
- `tsc -b` — TypeScript type checking
- `vite build` — builds the React app
- `esbuild src/content.ts --bundle` — pulls in every import and inlines it
- `--outfile=dist/content.js` — writes the result to this file
- `--format=iife` — wraps everything in that self-contained function

In `vite.config.ts`, remove `content` from the inputs. Vite only needs to build the React app now. esbuild handles the content script separately:

```typescript
input: {
    main: resolve(__dirname, "index.html"),
},
```

---

## Step 3 — Fix the Manifest

**File:** `manifest.json`

**What:** Tell Chrome how to inject the content script correctly.

**Why:** Earlier we added `"type": "module"` to the manifest trying to fix the import error. That told Chrome to treat `content.js` as an ES module. But now that we switched to IIFE format, it is not a module anymore — it is a plain script. Leaving `"type": "module"` there was breaking the injection.

**How:**

Remove `"type": "module"` from the content_scripts section:

```json
"content_scripts": [
    {
        "matches": ["<all_urls>"],
        "js": ["content.js"],
        "run_at": "document_idle"
    }
],
```

- `matches: ["<all_urls>"]` — inject this script into every webpage
- `js: ["content.js"]` — the file to inject
- `run_at: "document_idle"` — wait until the page is fully loaded before injecting

---

## Step 4 — Wire Up the Message System

This is the most important part. Three files need to work together.

---

### 4a. The Content Script

**File:** `src/content.ts`

**What:** Listens for a scan request, runs axe-core, sends results back.

**Why:** This is the only program that lives inside the webpage. It is the only one that can scan the DOM.

**How:**

```typescript
import axe from "axe-core"

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "RUN_SCAN") {
        axe.run().then((results) => {
            sendResponse({ success: true, results })
        })
        return true;
    }
})
```

Breaking it down:
- `chrome.runtime.onMessage.addListener` — opens the mailbox. "I am ready to receive messages."
- `if (message.type === "RUN_SCAN")` — only react to scan requests specifically
- `axe.run()` — runs the accessibility scan on the current page DOM
- `sendResponse({ success: true, results })` — sends the results back through the same channel
- `return true` — **critical**. Tells Chrome to keep the message channel open while axe finishes. Without this, Chrome closes the connection before axe is done and the response never arrives.

---

### 4b. The Background Service Worker

**File:** `background.js`

**What:** Receives messages from the Side Panel and forwards them to the Content Script.

**Why:** The Side Panel and Content Script live in completely different environments. They cannot talk directly. The Background acts as the post office between them.

**How:**

```javascript
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "RUN_SCAN") {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: "RUN_SCAN" }, (response) => {
                if (chrome.runtime.lastError) {
                    sendResponse(null);
                    return;
                }
                sendResponse(response);
            });
        });
        return true;
    }
});
```

Breaking it down line by line:

`chrome.runtime.onMessage.addListener` — opens the post office window. "I am listening for messages from anyone in the extension."

`if (message.type === "RUN_SCAN")` — only handle scan requests.

`chrome.tabs.query({ active: true, lastFocusedWindow: true }, ...)` — find the tab the user is actually looking at. We use `lastFocusedWindow` instead of `currentWindow` because the Side Panel counts as its own window. Without `lastFocusedWindow`, Chrome might return the Side Panel itself instead of the webpage.

`chrome.tabs.sendMessage(tabs[0].id, { type: "RUN_SCAN" }, ...)` — forward the message to the content script running on that specific tab.

`sendResponse(response)` — take whatever the content script sent back and forward it to the Side Panel.

`return true` — same as before. Keep the channel open while we wait for the async response.

---

### 4c. The Side Panel UI

**File:** `src/Scanner.tsx`

**What:** The button and the results display.

**Why:** This is what the user actually sees and interacts with.

**How:**

```typescript
import { useState } from "react";
import type { AxeViolation } from "../../types";

const Scanner = () => {
    const [results, setResults] = useState<AxeViolation[] | null>(null);

    const handleScan = () => {
        chrome.runtime.sendMessage({ type: "RUN_SCAN" }, (response) => {
            console.log(response);
            setResults(response.results.violations);
        });
    };

    return (
        <div>
            <button onClick={handleScan}>Run Scan</button>
            {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
        </div>
    );
};

export default Scanner;
```

Breaking it down:

`useState<AxeViolation[] | null>(null)` — state that holds either an array of violations or null. The union type `AxeViolation[] | null` tells TypeScript it can be one or the other.

`chrome.runtime.sendMessage({ type: "RUN_SCAN" }, ...)` — sends the scan request. This goes to the Background first, which forwards it to the Content Script.

`setResults(response.results.violations)` — stores just the violations array in state.

`{results && <pre>...}` — only renders the results if they exist. If results is null, nothing shows.

---

## The Full Message Flow

Here is the complete journey of one scan request:

```
1. User clicks "Run Scan" in the Side Panel

2. Scanner.tsx sends:
   chrome.runtime.sendMessage({ type: "RUN_SCAN" })

3. background.js receives it:
   chrome.runtime.onMessage.addListener(...)
   
4. background.js finds the active tab and forwards it:
   chrome.tabs.sendMessage(tabId, { type: "RUN_SCAN" })

5. content.ts receives it and runs the scan:
   axe.run().then(results => sendResponse({ success: true, results }))

6. background.js receives the response and sends it back:
   sendResponse(response)

7. Scanner.tsx receives the results and stores them in state:
   setResults(response.results.violations)

8. React re-renders and displays the violations in the UI
```

---

## How to Build and Load the Extension

Every time you make changes, follow these steps:

**1. Build the extension**
```bash
npm run build
```

**2. Go to Chrome extensions**
```
chrome://extensions
```

**3. Turn on Developer Mode**
Toggle the switch in the top right corner.

**4. Load or reload the extension**
- First time: click "Load unpacked" and select your `dist` folder
- After changes: click the reload icon on the Orbit extension card

**5. Test it**
- Open a new tab and go to any website
- Click the Orbit extension icon to open the Side Panel
- Click "Run Scan"
- Results appear in the panel

---

## Common Errors and What They Mean

| Error | What It Means | Fix |
|---|---|---|
| `Cannot use import statement outside a module` | content.js is being treated as a plain script but has ES module syntax | Make sure esbuild is building content.ts with `--format=iife` |
| `Could not establish connection. Receiving end does not exist` | The content script is not injected into the page | Reload the extension, open a fresh tab, try again |
| `Cannot read properties of undefined (reading 'results')` | The response came back empty | Check that background.js is forwarding messages correctly |

---

## Summary

Three programs. Three jobs. One pipeline.

- **content.ts** — scans the page
- **background.js** — forwards messages between the other two
- **Scanner.tsx** — shows the results to the user

The trickiest parts were:
1. Building content.ts as an IIFE so Chrome could inject it without ES module errors
2. Routing messages through the background because the side panel and content script cannot talk directly

Once you understand those two things, everything else makes sense.