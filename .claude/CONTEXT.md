# Orbit: Project Context

The product blueprint: what Orbit is, how its parts fit together, and what it promises.
Read this before changing Orbit. `DECISIONS.md` records the choices made and the open TODOs. When this file and the code disagree, the code is what's true today; fix this file.

---

## What Orbit is

Orbit is a Chrome extension (Manifest V3). It's a light, easy-to-use accessibility checker that opens in Chrome's side panel. People building websites use it to find and understand accessibility problems on the page they're looking at.

Stack: Vite 8, React 19, TypeScript 6, Tailwind CSS 4, axe-core 4. The checklist content comes from The A11Y Project.

## The four tabs

| Tab | Folder | What it does |
| --- | --- | --- |
| Scanner | `src/features/scanner/` | Runs axe-core on the active tab and lists violations by impact (critical, serious, moderate). Opening a result outlines the element on the page. |
| Tools | `src/features/tools/` | "See the tab order" numbers every keyboard stop on the page. "High contrast" overlays a black, white and yellow style. |
| Colors | `src/features/colors/` | Contrast checker for two hex colors, with an eyedropper. The math lives in `Contrast.ts` (WCAG thresholds). |
| Checklist | `src/features/checklist/` | The A11Y Project checklist with tick boxes. Ticks are saved on the device. |

Shared pieces: `src/App.tsx` (tab switching), `src/components/` (Header, Nav, Footer), `src/types.ts` (tabs, axe result shapes), `src/messages.ts` (every message type and constant).

## How the parts talk

A Chrome extension is several separate programs:

| Part | File | Job |
| --- | --- | --- |
| Side panel | `index.html` → `src/main.tsx` → `src/App.tsx` | All the UI and state. Has full Chrome API access. |
| Content script | `src/content.ts` (built to `dist/content.js` by esbuild) | Runs inside the web page. Runs axe and draws every outline, number label, tint and high-contrast style. |
| Background service worker | `public/background.js` | Only makes the toolbar icon open the side panel. Holds no state, and Chrome can stop it at any time. |
| Manifest | `public/manifest.json` | Permissions, side panel path, icons, content script registration. |

The send sequence every feature uses today (in `Scanner.tsx`, `Tools.tsx`, `ResultCard.tsx`):

1. Find the tab the user is looking at: `chrome.tabs.query({ active: true, lastFocusedWindow: true })`.
2. Refuse pages Chrome won't let extensions touch (`chrome://`, `chrome-extension://`) with a plain message. Only the Scanner does this today.
3. Inject `content.js` with `chrome.scripting.executeScript`, so tabs opened before Orbit was installed still work.
4. Open a port named `orbit-panel`. When the panel closes, the port disconnects and the content script runs `clearAll()`.
5. Send a typed message constant from `messages.ts` with `chrome.tabs.sendMessage` and await the response.

The panel talks to the content script **directly**. The older route through `background.js` is commented out.

### Messages

| Message | Sent from | Content script does | Responds |
| --- | --- | --- | --- |
| `RUN_SCAN` | Scanner | `axe.run()` | `{ success, results }` |
| `HighlightEl` (+ `selector`) | ResultCard | outlines one element, or tints the page for `html` | nothing |
| `RUN_HIGHLIGHT` | Tools | numbers every focusable element | `{ success, count }` |
| `CLEAR_HIGHLIGHT_NUMBERS` | Tools | removes the numbers | `{ success }` |
| `RUN_HIGH_CONTRAST` (+ `on`) | Tools | adds or removes `#orbit-high-contrast` | `{ success }` |
| `CLEAR_ALL` | App (on tab switch) | `clearAll()` | `{ success }` |

## Promises Orbit makes

- **Nothing leaves the device.** The privacy policy (`index.md`) says scans run locally with axe-core, and no information about the user, the pages they scan or their results leaves their device. No code makes a network request. Docs links (`helpUrl`, `wcagUrl`) open only when the user clicks them.
- **Pages are left as they were found.** Everything Orbit adds to a page is removed on a tab switch inside Orbit and when the panel closes.
- **Orbit is accessible itself.** It's an accessibility tool, so its own UI has to meet the bar it checks for: keyboard use, visible focus, roles and labels, live announcements, readable contrast.

## Storage

- `localStorage["orbit-checklist"]`: the checklist ticks, an object of item id → true/false. This is the only stored data.
- Nothing else is stored: no scan results, no URLs, no page HTML. `chrome.storage` is not used.

## Permissions (manifest)

`sidePanel`, `scripting`, `activeTab`, `tabs`, host permission `<all_urls>`, and a content script on `<all_urls>` at `document_idle`. The Chrome Web Store reviews each permission, so changes need a reason. A store rejection has been worked on before (branch `chrome-store/rejection-fix`).

## Building, checking, releasing

- `npm run dev`: the Vite dev server. It renders the panel UI, but Chrome APIs don't exist there, so scans won't run.
- `npm run build`: `tsc -b`, then `vite build`, then esbuild bundles `src/content.ts`. The output goes to `dist/`, which git ignores, and `public/` is copied in as is.
- `npx tsc -b --noEmit`: the type check. It passes today.
- `npm run lint`: ESLint. It has existing problems today; see `DECISIONS.md` for the baseline.
- To try a build: open `chrome://extensions`, turn on Developer mode, choose "Load unpacked" and select `dist/`. After each rebuild, reload the extension **and** the page you're testing, or the page keeps the old content script.
- Release: bump `version` in `public/manifest.json` and zip `dist/` (`dist.zip` is committed).
- Branches: `feature/*` (or similar) → PR into `staging` → `main`. GitHub: `mtq01/orbit`.

## Code style

- One folder per tab under `src/features/<tab>/`. Function components with a default export.
- Local `useState` in each tab. No state library and no React Context yet.
- Tailwind utility classes with the Orbit tokens from `src/index.css` (`bg-orbit-blue`, `text-critical` and so on). Fonts: Atkinson Hyperlegible (body), DM Sans (headings), Fira Code (code).
- Comments are plain language and explain what the code does and why, for a reader who is still learning. New code keeps that tone.
- `class-variance-authority`, `clsx` and `tailwind-merge` are installed, and the `@` alias is set up for shadcn/ui, but there is no `components/ui/` folder yet.

## Known limits (today)

- TypeScript `strict` is off in `tsconfig.app.json`.
- Message responses are trusted with `as` casts, with no runtime check.
- No automated tests.
- Tools and ResultCard don't catch a failed `sendMessage` or refuse restricted pages.
- Iframes are probably not scanned, because the content script isn't injected into frames (no `all_frames`). Unverified.
- See the TODOs in `DECISIONS.md` for the full list.
