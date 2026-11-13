# Orbit

A light, easy-to-use accessibility checker that lives in Chrome's side panel.

Orbit helps people who build websites find and understand accessibility problems on the page they're looking at. It runs [axe-core](https://github.com/dequelabs/axe-core) on the current tab, shows each issue with the element that causes it, and adds a few hands-on tools for checking keyboard order and color contrast. Everything runs on your device.

## Features

Orbit has four tabs:

- **Scan** — Runs axe-core on the active tab and lists violations by impact (critical, serious, moderate), with a filter for each. Opening a result outlines the element on the page and links to the rule's documentation.
- **Tools** — *See the tab order* numbers every keyboard stop on the page. *High contrast* applies a black, white and yellow style to the page.
- **Colors** — Checks the contrast ratio of two hex colors against WCAG AA and AAA, for normal and large text. Includes an eyedropper for picking colors from the screen.
- **Checklist** — The [A11Y Project](https://www.a11yproject.com/checklist/) checklist, with tick boxes that are saved on your device.

Anything Orbit draws on a page (outlines, numbers, tints, the high-contrast style) is removed when you switch tabs in Orbit or close the panel.

## Privacy

Orbit makes no network requests and collects no data. Scans run locally with axe-core, and nothing about you, the pages you scan or your results leaves your device. The only thing Orbit stores is your checklist progress, in the panel's `localStorage`.

See the full [privacy policy](index.md).

## Installation

Orbit is not yet published on the Chrome Web Store, so you build it and load it unpacked.

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or later, with npm
- Google Chrome 116 or later (for the Side Panel API)

### Build and load

```bash
git clone https://github.com/mtq01/orbit.git
cd orbit
npm install
npm run build
```

Then in Chrome:

1. Go to `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `dist/` folder.

## Usage

1. Open the page you want to check.
2. Click the Orbit icon in the toolbar to open the side panel.
3. On the **Scan** tab, click **Run Scan**. Pick a result to see the affected element highlighted on the page.

Chrome doesn't let extensions run on its own pages (`chrome://` and `chrome-extension://` URLs). Orbit tells you when you try to scan one.

## Development

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server. Useful for UI work, but Chrome extension APIs aren't available there, so scans and tools won't run. |
| `npm run build` | Type-checks, builds the side panel with Vite, and bundles `src/content.ts` into `dist/content.js` with esbuild. |
| `npm run lint` | Runs ESLint. |
| `npx tsc -b --noEmit` | Type-checks without building. |

After each rebuild, reload the extension on `chrome://extensions` **and** reload the page you're testing, or the page keeps running the old content script.

### How it fits together

A Chrome extension is several separate programs:

| Part | Source | Job |
| --- | --- | --- |
| Side panel | `index.html`, `src/main.tsx`, `src/App.tsx` | All of the UI and its state. |
| Content script | `src/content.ts` | Runs inside the web page: runs axe and draws every outline, label and style. |
| Background worker | `public/background.js` | Makes the toolbar icon open the side panel. Nothing else. |
| Manifest | `public/manifest.json` | Permissions, side panel path, icons and content script. |

The side panel injects the content script into the active tab and talks to it directly with `chrome.tabs.sendMessage`. Message types are defined in `src/types.ts`. Each tab's code lives in its own folder under `src/features/`.

Built with Vite, React 19, TypeScript, Tailwind CSS 4 and axe-core 4.

### Project docs

- [`CONTEXT.md`](.claude/CONTEXT.md) — how Orbit works and the promises it makes. Start here before changing code.
- [`DECISIONS.md`](.claude/DECISIONS.md) — dated design decisions and open TODOs.

## Contributing

1. Branch from `staging` (for example `feature/my-change` or `fix/my-bug`).
2. Make your change, then run `npm run build` and `npm run lint`.
3. Open a pull request into `staging`.

Orbit is an accessibility tool, so its own UI must be accessible too: keyboard operable, with visible focus, proper roles and labels, and readable contrast. Please check new UI against that bar.

## Credits

- Accessibility rules and scanning by [axe-core](https://github.com/dequelabs/axe-core) from Deque Systems (MPL-2.0).
- Checklist content from [The A11Y Project](https://www.a11yproject.com/), used under the Apache License 2.0.

## Contact

Questions or feedback: [Orbit Email](mailto:orbit.graduate805@aleeas.com)
