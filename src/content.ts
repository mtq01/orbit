// brings axe-core in. vite will bundle it to dist/content.js
import axe from "axe-core";
// storing all focusable elements ia a variable for future use
const focusable =
  "a[href], button, input, select, textarea, details, [tabindex]:not([tabindex='-1'])";

/* content.ts listens for messages from sidepanel.tsx (previously background.js)
   the content script doesn't care where the message comes from, so no logic changes needed.

_sender in TS means: "this param exists but im not using it."
*/
let lastHighlighted: HTMLElement | null = null;
let pageTint: HTMLElement | null = null;
let numberLabels: HTMLElement[] = []; // tracks the number labels added by RUN_HIGHLIGHT

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

// removes the numbered labels + blue outlines added by RUN_HIGHLIGHT
const clearHighlightNumbers = () => {
  numberLabels.forEach((label) => label.remove());
  numberLabels = [];

  const focusableElements = document.querySelectorAll(focusable);
  focusableElements.forEach((element) => {
    (element as HTMLElement).style.outline = "";
  });
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
    const focusableElements = document.querySelectorAll(focusable);
    focusableElements.forEach((element, index) => {
      (element as HTMLElement).style.outline = "2px solid blue";

      // add number label here
      const label = document.createElement("span");
      label.textContent = String(index + 1);
      label.style.cssText =
        "background: blue; color: white; padding: 2px 6px; border-radius: 50%; font-size: 12px; position: absolute; z-index: 9999;";
      element.insertAdjacentElement("beforebegin", label);
      numberLabels.push(label);
    });
    sendResponse({ success: true, count: focusableElements.length });
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
    sendResponse({ success: true });
    return true;
  }
});
//good read: https://dev.to/latz/chrome-side-panel-simulate-close-event-354h
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "orbit-panel") return;
  port.onDisconnect.addListener(() => {
    clearHighlight();
    clearHighlightNumbers();
  });
});
