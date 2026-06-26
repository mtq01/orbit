// brings axe-core in. vite will bundle it to dist/content.js
import axe from "axe-core";

/* content.ts listens for messages from sidepanel.tsx (previously background.js)
   the content script doesn't care where the message comes from, so no logic changes needed.

_sender in TS means: "this param exists but im not using it."
*/
let lastHighlighted: HTMLElement | null = null;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // only react to msgs asking for a scan specifically.
  if (message.type === "RUN_SCAN") {
    // runs the axe-core scan async and sends results back to sidepanel.tsx
    const runScan = async () => {
      const results = await axe.run();
      sendResponse({ success: true, results });
    };
    /* 
    - return true: tells chrome to wait for the async response
    - without it, chrome closes the connection before axe is finished. */
    runScan();
    return true;
  }

  if (message.type === "HighlightEl") {
    if (lastHighlighted) {
      lastHighlighted.style.outline = "";
    }

    const el = document.querySelector(message.selector) as HTMLElement | null;

    if (el) {
      el.style.outline = "4px solid #2116f5";
      el.style.outlineOffset = "4px";
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      lastHighlighted = el;
    }
  }
});
