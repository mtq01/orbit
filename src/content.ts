// brings axe-core in. vite will bundle it to dist/content.js
import axe from "axe-core"

/* content-script listens for messages from the side panel

_sender in TS means: "this param exists but im not using it."
*/
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {

    // only react to msgs asking for a scan specifically.
  if (message.type === "RUN_SCAN") {
    
    // run the scan on the current page DOM & send results back to user.
    axe.run().then((results) => {
      sendResponse({ success: true, results })
    })

    /* 
    - return true: tells chrome to wait for the async response
    - without it, chrome closes the connection before axe is finished. */
    return true;
  }
})