# Decisions

Dated decisions and open TODOs for Orbit. A decision here overrides `CONTEXT.md`, and a later entry overrides an earlier one.

## Format

Each entry goes under a `## <Month D, YYYY> - <track or topic>` heading, in a table with three columns: status, the entry, and why. Write in plain language.

- **Decisions** use `| ✅ | <decision> | <why> |`.
- **TODOs** use `| ⬜ | <todo> | <why it matters> |`. When a TODO is done, change ⬜ to ✅ and add `Closed <Month D, YYYY>.` to the end of its Why cell.
- If the reason wasn't written down when the choice was made, write the most likely reason and end it with `(assumed)`.
- Don't use `|` inside a cell. Use "or" instead.

## November 12, 2026 - Starting entries (recorded from the code as it is)

These record choices already in the code when this file was created. The dates they were first made aren't recorded here; `git log` has them, and the next section gives the dates for some of them.

### Architecture

| | Decision | Why |
| --- | --- | --- |
| ✅ | The side panel sends messages straight to the content script with `chrome.tabs.sendMessage`. `public/background.js` only makes the toolbar icon open the side panel, and it holds no state. | Manifest V3 service workers can be stopped at any time, so routing messages through them was fragile and kept state in a place that gets wiped. The direct route has fewer moving parts (assumed; `3c15c00`, June 5, 2026). |
| ✅ | Before scanning or running a tool, the panel injects `content.js` with `chrome.scripting.executeScript`. | Tabs that were open before Orbit was installed or updated don't have the content script, so without this they'd fail until reloaded. |
| ✅ | The content script owns everything that touches the page: running axe, outlines, number labels, the page tint and the high-contrast style. The panel owns the UI and its state. | Only the content script can reach the page's DOM. Keeping every page change in one file also makes `clearAll()` able to undo all of them. |
| ✅ | Every message has a type and a constant in `src/types.ts`, and the panel sends the constant rather than typing the object by hand. | One place to read every message, and a typo in a hand-typed message object fails silently at runtime. |
| ✅ | `src/content.ts` is bundled separately by esbuild as an IIFE, after `vite build`. | Chrome loads content scripts as classic scripts, not ES modules, so the file has to be a single self-contained bundle. |

### Scan results

| | Decision | Why |
| --- | --- | --- |
| ✅ | Only `violations` are kept from axe results. `passes` and `incomplete` are not shown. | The panel showed all three in June 2026 and dropped the other two in "Cleanup for Shipping" (`031a504`). They add length without telling the user what to fix (assumed). |
| ✅ | `minor` violations are filtered out in `Scanner.tsx`. The filters are all, critical, serious and moderate, and "all" sorts in that order. | Keeps the list on the problems most likely to block people, so the panel stays short (assumed). Most severe first so the worst problems are seen first. |
| ✅ | Page HTML and selectors from axe are shown as text in `<code>` (formatted by `js-beautify`), never rendered as HTML. | Rendering page markup inside the panel would run or display the page's content inside the extension. As text it's safe and readable. |
| ✅ | A violation whose target is `html` is a page-level issue: the panel says so, and the page gets a tint instead of an outline. | An outline around the whole page isn't visible or useful, and the user needs to know there's no single element to fix. |
| ✅ | Each result card shows axe's short `help` text, not the per-node `failureSummary`. | The node summary was long and repetitive. The `help` line reads cleaner (`dd22dd8`, June 10, 2026). |

### Page safety

| | Decision | Why |
| --- | --- | --- |
| ✅ | Everything Orbit adds to a page is removed by `clearAll()` in `content.ts`. It runs when the user switches tabs inside Orbit (`CLEAR_ALL`) and when the panel closes (the `orbit-panel` port disconnects). | Orbit promises to leave pages as it found them. The port is the only reliable signal that the panel has closed. |
| ✅ | Pages Chrome blocks (`chrome://`, `chrome-extension://`) get a plain message explaining why they can't be scanned, instead of an attempt that fails. | Chrome doesn't let extensions inject into these pages, so a scan would fail with an error the user can't act on. |
| ✅ | A highlighted element is scrolled into the middle of the view (`block: "center"`). | The outline and number label are easy to miss at the edge of the screen (`8764e24`, July 13, 2026). |

### Privacy and storage

| | Decision | Why |
| --- | --- | --- |
| ✅ | Everything runs on the user's device, and nothing about the user, their pages or their results leaves it (privacy policy in `index.md`). There are no network requests, analytics or remote scripts. | Users scan pages that may be private or unreleased. The Chrome Web Store also requires a privacy policy, and Manifest V3 forbids remote code. |
| ✅ | The only stored data is the checklist ticks, in `localStorage` under `orbit-checklist`. | Ticks should survive closing the panel, and nothing else needs to. |
| ✅ | Icons and fonts are bundled with the extension, never loaded from another site. | Keeps the no-network promise, and works offline (`44138da`, June 10, 2026). |

### Content and UI

| | Decision | Why |
| --- | --- | --- |
| ✅ | The checklist content comes from The A11Y Project under the Apache License 2.0, credited at the top of `checklistData.ts`. | A well-known, maintained checklist. The license requires the credit. |
| ✅ | The contrast checker follows the WCAG thresholds in `Contrast.ts`: AA normal 4.5, AA large 3, AAA normal 7, AAA large 4.5. | These are the WCAG 2 success criteria 1.4.3 and 1.4.6 values that users are checked against. |
| ✅ | Styling uses Tailwind 4 with the Orbit color and font tokens in the `@theme` block of `src/index.css`. | One place to change colors and fonts. |
| ✅ | No component library. shadcn/ui was installed and then removed. | It brought in too many dependencies for a small extension (`578ae1e`, June 5, 2026). |
| ✅ | The tab bar is an ARIA `tablist`: arrow keys move between tabs, and Home and End jump to the first and last. | Orbit's own UI must be accessible, and this is the keyboard pattern screen reader and keyboard users expect for tabs (`57c7e8f`, July 13, 2026). |
| ✅ | Animations and transitions are cut to almost nothing under `prefers-reduced-motion: reduce`. | Motion can make some users ill, and Orbit's own UI must be accessible (`6649df1`, July 3, 2026). |
| ✅ | The toolbar and store icons are PNGs at 16, 48 and 128 px. | Chrome doesn't accept SVG for extension icons (`5bd7200`, July 13, 2026). |

### Releases and project files

| | Decision | Why |
| --- | --- | --- |
| ✅ | The manifest version changes only in a release commit. | Keeps the uploaded build matching one known commit (`7b8c29e` and `b7110f2`, release 0.1.5). |
| ✅ | `dist.zip` is not kept in git. For a release, run `npm run build` and zip `dist/` locally. It is in `.gitignore`. | It's a build output that can be rebuilt from the release commit, and a large binary that changed with every release. Closed November 13, 2026. |
| ✅ | `CONTEXT.md` and `DECISIONS.md` live in `.claude/`, next to the orbit skill that reads them. | Keeps the project root clean (assumed; PR #69, November 12, 2026). |

### Checks baseline

| | Decision | Why |
| --- | --- | --- |
| ✅ | As of November 12, 2026, `npx tsc -b --noEmit` passes. `npm run lint` reports 2 errors (`react-hooks/static-components` in `src/features/colors/Colors.tsx` lines 71-72, because `ColorInput` is created inside `Colors`) and 1 warning (`react-hooks/exhaustive-deps` in `src/features/scanner/ResultCard.tsx` line 65). New work adds nothing to this baseline. | There are no automated tests, so these checks are the only guard. A fixed baseline makes new problems visible. Replaced by the baseline in "Colors lint fix" below. |

### Open TODOs

| | TODO | Why |
| --- | --- | --- |
| ⬜ | Turn on `strict` in `tsconfig.app.json` and fix what it finds. | Without it, TypeScript misses null and undefined mistakes. |
| ⬜ | Check message responses at runtime before using them. `Scanner.tsx` and `Tools.tsx` trust them with `as` casts today. | An `as` cast checks nothing at runtime, so a bad or missing response crashes the panel or shows wrong results. |
| ✅ | Fix the lint baseline, part 1: move `ColorInput` out of `Colors`. | A component defined inside another one is remade on every render, which loses input focus and state. Closed November 12, 2026. |
| ⬜ | Fix the lint baseline, part 2: complete the `useEffect` dependencies in `ResultCard.tsx`. | Missing dependencies can leave the effect running with stale values. |
| ⬜ | `Tools.tsx` sends `RUN_HIGH_CONTRAST` as a hand-typed object. Add a constant for it in `types.ts`; the `HighContrastMessage` type already exists. | Breaks the rule that every message is sent from a constant in `types.ts`. |
| ⬜ | Check whether `content.js` ends up injected more than once in a tab: once by the manifest's `content_scripts` and again by `executeScript` on every click. Each run adds another message listener. Unverified. | Repeated listeners could make each message run several times, doubling outlines or labels. |
| ⬜ | `Tools.tsx` and `ResultCard.tsx` don't catch a failed `sendMessage` and don't refuse restricted pages. | The user clicks and sees nothing happen, with no explanation. |
| ⬜ | Turning off outlines sets `outline` to `""`, which wipes any inline outline the page had. Save and restore the page's own value instead. | Breaks the promise to leave pages as found. |
| ⬜ | Remove the `console.log` calls in `Scanner.tsx`. | Debug output in a shipped extension clutters the user's console. |
| ✅ | `src/background.js` is an unused copy of `public/background.js`, which is the one that ships. Delete it or say why it stays. | Deleted, along with the empty `src/App.css`. Closed November 13, 2026. |
| ✅ | Update `SCANNER.md`: it describes the older route through `background.js`. | Deleted instead, because `CONTEXT.md` covers how Orbit works today. Closed November 12, 2026. |
| ⬜ | Decide whether iframes should be scanned. The content script isn't injected into frames today. | Problems inside embedded frames go unreported. |
| ⬜ | Review whether `tabs`, the `<all_urls>` host permission and the `<all_urls>` content script are all still needed alongside `activeTab` and `scripting`. | The Chrome Web Store reviews every permission, and broad ones slow review or cause rejection. |
| ✅ | Decide whether `dist.zip` belongs in git. | It doesn't; removed and ignored. Closed November 13, 2026. |
| ⬜ | Add automated checks. There are no tests today. | Every change is checked by hand in Chrome. |
| ⬜ | Remove dependencies the code doesn't use: `class-variance-authority`, `clsx`, `tailwind-merge` (shadcn leftovers), `vite-plugin-svgr`, `@fontsource-variable/geist` and `@fontsource/dm-sans`. Check whether `tw-animate-css` is used; it's imported in `index.css`, but no class from it was found. Fix the comments in `vite.config.ts` that say the `@` alias is for shadcn and that it builds two entry points. | Unused packages make installs slower and audits noisier, and the comments describe a setup that's gone. |

## November 12, 2026 - Colors lint fix

| | Decision | Why |
| --- | --- | --- |
| ✅ | `ColorInput` and `pickColor` live at module level in `Colors.tsx`, next to `Badge`. Components are never defined inside another component. | A component defined inside another one is remade on every render, which loses focus and state. |
| ✅ | Form labels are linked to their inputs with `htmlFor`/`id`. When a component renders more than once and has no data id, the id comes from React's `useId`. | Screen readers read a label only when it's linked to its input. `useId` keeps the ids unique when a component renders more than once. |
| ✅ | As of November 12, 2026, `npm run lint` reports 0 errors and 1 warning (`react-hooks/exhaustive-deps`, `ResultCard.tsx` line 65). | Replaces the earlier baseline now that part 1 is fixed. |

| | TODO | Why |
| --- | --- | --- |
| ⬜ | Hide the decorative color swatch in `Colors.tsx` from assistive tech, and confirm whether lucide-react hides `<Pipette>` by default. | Decorative elements read aloud are noise for screen reader users. |
| ⬜ | Announce contrast results with `aria-live="polite"`, and tie "Enter two valid hex colors." to the inputs with `aria-invalid` and `aria-describedby`. | Screen reader users don't hear the result or the error message today. |
| ⬜ | Give the Colors hex inputs `type="text"`, `spellCheck={false}` and `autoComplete="off"`, and make the eyedropper `title` match its `aria-label`. | Spellcheck and autofill get in the way of hex codes, and a label that differs from the tooltip confuses users. |
| ⬜ | Replace the `results!` assertions in `Colors.tsx` by narrowing on `results`. | `!` hides a possible null instead of handling it. |
