// brings axe-core in. vite will bundle it to dist/content.js
import axe from "axe-core";
// storing all focusable elements ia a variable for future use
const focusable =
  "a[href], button, input, select, textarea, details, [tabindex]:not([tabindex='-1'])";

  // filters out things that match the selector but can't actually be tabbed to
const isFocusable = (el: HTMLElement) => {
  if (el.hasAttribute("disabled")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;
  if (el.closest("[inert]")) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  const style = getComputedStyle(el);
  if (style.visibility === "hidden" || style.display === "none") return false;
  return true;
};

// positive tabindex jumps the queue; everything else keeps DOM order
const byTabOrder = (a: HTMLElement, b: HTMLElement) => {
  const ta = Number(a.getAttribute("tabindex")) || 0;
  const tb = Number(b.getAttribute("tabindex")) || 0;
  if (ta > 0 && tb > 0) return ta - tb;
  if (ta > 0) return -1;
  if (tb > 0) return 1;
  return 0;
};

/* content.ts listens for messages from sidepanel.tsx (previously background.js)
   the content script doesn't care where the message comes from, so no logic changes needed.

_sender in TS means: "this param exists but im not using it."
*/

let lastHighlighted: HTMLElement | null = null;
let pageTint: HTMLElement | null = null;
let overlay: HTMLElement | null = null;   // one container holding every number label
let outlined: HTMLElement[] = [];          // the exact elements we outlined


const clearHighlight = () => {
  if (lastHighlighted) {
    lastHighlighted.style.outline = "";
    lastHighlighted.style.outlineOffset = "";
    lastHighlighted = null;
  }
  // remove() is a built in method that removes elemts from the dom, we need it ehre since we used createElement
  pageTint?.remove();
  pageTint = null;
};
const showPageTint = () => {
  if (pageTint) return;
  pageTint = document.createElement("div");
  pageTint.style.cssText =
    "position: fixed; inset: 0; background: #2116f533; z-index: 999999;";
  document.body.appendChild(pageTint);
};
const clearContrast = () => {
  const existing = document.getElementById("orbit-high-contrast");
  existing?.remove();
};

const clearHighlightNumbers = () => {
  overlay?.remove();
  overlay = null;
  outlined.forEach((el) => (el.style.outline = ""));
  outlined = [];
};

const clearAll = () => {
  clearHighlight();
  clearHighlightNumbers();
  clearContrast();
};

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
    clearHighlight();

    if (message.selector === "html") {
      showPageTint();
    } else {
      const el = document.querySelector(message.selector) as HTMLElement | null;

      if (el) {
        el.style.outline = "4px solid #2116f5";
        el.style.outlineOffset = "4px";
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        lastHighlighted = el;
      }
    }
  }

  if (message.type === "RUN_HIGHLIGHT") {
  clearHighlightNumbers(); // reset if it was already run

  overlay = document.createElement("div");
  overlay.id = "orbit-tab-overlay";
  overlay.style.cssText =
    "position: absolute; top: 0; left: 0; width: 0; height: 0; z-index: 2147483647; pointer-events: none;";
  document.body.appendChild(overlay);

  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(focusable),
  )
    .filter(isFocusable)
    .sort(byTabOrder);

  elements.forEach((el, index) => {
    el.style.outline = "2px solid blue";
    outlined.push(el);

    const rect = el.getBoundingClientRect();
    const label = document.createElement("span");
    label.textContent = String(index + 1);
    label.style.cssText = `
      position: absolute;
      left: ${rect.left + window.scrollX}px;
      top: ${rect.top + window.scrollY}px;
      transform: translate(-50%, -50%);
      background: blue; color: white;
      min-width: 18px; height: 18px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 9999px;
      font: 12px/1 sans-serif;
      pointer-events: none;
    `;
    overlay!.appendChild(label);
  });

  sendResponse({ success: true, count: elements.length });
  return true;
}
 
  if (message.type === "CLEAR_HIGHLIGHT_NUMBERS") {
    clearHighlightNumbers();
    sendResponse({ success: true });
    return true;
  }
 
if (message.type === "RUN_HIGH_CONTRAST") {
  const existing = document.getElementById("orbit-high-contrast");
  if (message.on) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = "orbit-high-contrast";
      style.textContent = `
        * {
          background-color: #000000 !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
        }
        a { color: #ffff00 !important; }
        img, video { filter: invert(1) !important; }
      `;
      document.head.appendChild(style);
    }
  } else {
    existing?.remove();
  }
    }
  sendResponse({ success: true });
  return true;
}

  if (message.type === "CLEAR_ALL") {
    clearAll();
    sendResponse({ success: true });
    return true;

});
//good read: https://dev.to/latz/chrome-side-panel-simulate-close-event-354h
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "orbit-panel") return;
  port.onDisconnect.addListener(() => {
    clearAll();
  });
});
