// brings axe-core in. vite will bundle it to dist/content.js
import axe from "axe-core"

/* content.ts listens for messages from background.js

_sender in TS means: "this param exists but im not using it."
*/
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {

    // only react to msgs asking for a scan specifically.
  if (message.type === "RUN_SCAN") {
    
    // runs the axe-core scan async and sends results back to background.js
    const runScan = async () => {
      const results = await axe.run();
      sendResponse({ success: true, results });
    }
    /* 
    - return true: tells chrome to wait for the async response
    - without it, chrome closes the connection before axe is finished. */
    runScan();
    return true;
  }
})