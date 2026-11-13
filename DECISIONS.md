# Decisions

Dated decisions and open TODOs for Orbit. A `DECISION` here overrides `CONTEXT.md`, and a later entry overrides an earlier one.

Format: a `## <Month D, YYYY> - <track or topic>` heading, then `- [x] **DECISION**: ...` or `- [ ] **TODO**: ...` lines in plain language. When a TODO is done, tick it and add the date it closed.

## November 12, 2026 - Starting entries (recorded from the code as it is)

These record choices already in the code when this file was created. The dates they were first made aren't recorded here; `git log` has them.

### Architecture

- [x] **DECISION**: The side panel sends messages straight to the content script with `chrome.tabs.sendMessage`. `public/background.js` only makes the toolbar icon open the side panel, and it holds no state.
- [x] **DECISION**: Before scanning or running a tool, the panel injects `content.js` with `chrome.scripting.executeScript`, so tabs that were open before Orbit was installed still work.
- [x] **DECISION**: The content script owns everything that touches the page: running axe, outlines, number labels, the page tint and the high-contrast style. The panel owns the UI and its state.
- [x] **DECISION**: Every message has a type and a constant in `src/types.ts`, and the panel sends the constant rather than typing the object by hand.

### Scan results

- [x] **DECISION**: Only `violations` are kept from axe results. `passes` and `incomplete` are not shown.
- [x] **DECISION**: `minor` violations are filtered out in `Scanner.tsx`. The filters are all, critical, serious and moderate, and "all" sorts in that order.
- [x] **DECISION**: Page HTML and selectors from axe are shown as text in `<code>` (formatted by `js-beautify`), never rendered as HTML.
- [x] **DECISION**: A violation whose target is `html` is a page-level issue: the panel says so, and the page gets a tint instead of an outline.

### Page safety

- [x] **DECISION**: Everything Orbit adds to a page is removed by `clearAll()` in `content.ts`. It runs when the user switches tabs inside Orbit (`CLEAR_ALL`) and when the panel closes (the `orbit-panel` port disconnects).
- [x] **DECISION**: Pages Chrome blocks (`chrome://`, `chrome-extension://`) get a plain message explaining why they can't be scanned, instead of an attempt that fails.

### Privacy and storage

- [x] **DECISION**: Everything runs on the user's device, and nothing about the user, their pages or their results leaves it (privacy policy in `index.md`). There are no network requests, analytics or remote scripts.
- [x] **DECISION**: The only stored data is the checklist ticks, in `localStorage` under `orbit-checklist`.

### Content and UI

- [x] **DECISION**: The checklist content comes from The A11Y Project under the Apache License 2.0, credited at the top of `checklistData.ts`.
- [x] **DECISION**: The contrast checker follows the WCAG thresholds in `Contrast.ts`: AA normal 4.5, AA large 3, AAA normal 7, AAA large 4.5.
- [x] **DECISION**: Styling uses Tailwind 4 with the Orbit color and font tokens in the `@theme` block of `src/index.css`.

### Checks baseline

- [x] **DECISION**: As of November 12, 2026, `npx tsc -b --noEmit` passes. `npm run lint` reports 2 errors (`react-hooks/static-components` in `src/features/colors/Colors.tsx` lines 71-72, because `ColorInput` is created inside `Colors`) and 1 warning (`react-hooks/exhaustive-deps` in `src/features/scanner/ResultCard.tsx` line 65). New work adds nothing to this baseline.

### Open TODOs

- [ ] **TODO**: Turn on `strict` in `tsconfig.app.json` and fix what it finds.
- [ ] **TODO**: Check message responses at runtime before using them. `Scanner.tsx` and `Tools.tsx` trust them with `as` casts today.
- [x] **TODO**: Fix the lint baseline, part 1: move `ColorInput` out of `Colors` (closed November 12, 2026).
- [ ] **TODO**: Fix the lint baseline, part 2: complete the `useEffect` dependencies in `ResultCard.tsx`.
- [ ] **TODO**: `Tools.tsx` sends `RUN_HIGH_CONTRAST` as a hand-typed object. Add a constant for it in `types.ts`; the `HighContrastMessage` type already exists.
- [ ] **TODO**: Check whether `content.js` ends up injected more than once in a tab: once by the manifest's `content_scripts` and again by `executeScript` on every click. Each run adds another message listener. Unverified.
- [ ] **TODO**: `Tools.tsx` and `ResultCard.tsx` don't catch a failed `sendMessage` and don't refuse restricted pages, so the user sees nothing happen.
- [ ] **TODO**: Turning off outlines sets `outline` to `""`, which wipes any inline outline the page had. Save and restore the page's own value instead.
- [ ] **TODO**: Remove the `console.log` calls in `Scanner.tsx`.
- [ ] **TODO**: `src/background.js` is an unused copy of `public/background.js`, which is the one that ships. Delete it or say why it stays.
- [x] **TODO**: Update `SCANNER.md`: it describes the older route through `background.js`. Deleted instead, because `CONTEXT.md` covers how Orbit works today (closed November 12, 2026).
- [ ] **TODO**: Decide whether iframes should be scanned. The content script isn't injected into frames today.
- [ ] **TODO**: Review whether `tabs`, the `<all_urls>` host permission and the `<all_urls>` content script are all still needed alongside `activeTab` and `scripting`, for the Chrome Web Store review.
- [ ] **TODO**: Decide whether `dist.zip` belongs in git.
- [ ] **TODO**: Add automated checks. There are no tests today.

## November 12, 2026 - Colors lint fix

- [x] **DECISION**: `ColorInput` and `pickColor` live at module level in `Colors.tsx`, next to `Badge`. Components are never defined inside another component.
- [x] **DECISION**: Form labels are linked to their inputs with `htmlFor`/`id`. When a component renders more than once and has no data id, the id comes from React's `useId`.
- [x] **DECISION**: As of November 12, 2026, `npm run lint` reports 0 errors and 1 warning (`react-hooks/exhaustive-deps`, `ResultCard.tsx` line 65). This replaces the earlier baseline.
- [ ] **TODO**: Hide the decorative color swatch in `Colors.tsx` from assistive tech, and confirm whether lucide-react hides `<Pipette>` by default.
- [ ] **TODO**: Announce contrast results with `aria-live="polite"`, and tie "Enter two valid hex colors." to the inputs with `aria-invalid` and `aria-describedby`.
- [ ] **TODO**: Give the Colors hex inputs `type="text"`, `spellCheck={false}` and `autoComplete="off"`, and make the eyedropper `title` match its `aria-label`.
- [ ] **TODO**: Replace the `results!` assertions in `Colors.tsx` by narrowing on `results`.
