// brings axe-core in. vite will bundle it to dist/content.js
import axe from "axe-core";
// storing all focusable elements ia a variable for future use
const focusable = "a[href], button, input, select, textarea, details, [tabindex]:not([tabindex='-1'])";

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
if(message.type === "RUN_HIGHLIGHT"){
    const focusableElements = document.querySelectorAll(focusable);
    focusableElements.forEach((element, index) => {
      (element as HTMLElement).style.outline = "2px solid blue";
      
      // add number label here
      const label = document.createElement("span");
      label.textContent = String(index + 1);
      label.style.cssText = "background: blue; color: white; padding: 2px 6px; border-radius: 50%; font-size: 12px; position: absolute; z-index: 9999;";
      element.insertAdjacentElement("beforebegin", label);
    });  
    sendResponse({success: true});
    return true;
}
  if (message.type === "RUN_HIGH_CONTRAST") {
  document.body.style.filter = "invert(1) hue-rotate(180deg)";
  sendResponse({ success: true });
  return true;
}
});
