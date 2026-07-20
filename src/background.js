chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});


// /* [Function]:
//     - When the extension icon is clicked, find out which tab we're on & open the side panel for that tab.
//     - without this code, clicking the orbit extension does NOTHING.
// */
// chrome.action.onClicked.addListener((tab) => {
//   chrome.sidePanel.open({ tabId: tab.id });
// });

// // listens for messages from Scanner.tsx (params prefixed with "_" are unused.)
// chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
//   if (message.type === "RUN_SCAN") {

//     // finds the active tab ORBIT was opened on so background.js knows where to forward the message.
//     // lastFocusedWindow is needed because the side panel is its own context, we need to target the actual tab being scanned.
//     // returns an array of matching tabs, tabs[0] is the one we want.
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//       console.log("targeting tab:", tabs[0]?.url, tabs[0]?.id);

//       // safety check: if no active tab found, send back null & stop the function with return.
//       if (!tabs[0]) {
//         sendResponse(null);
//         return;
//       }

//       // background.js sends to a SPECIFIC tab's content script (content.js)
//       chrome.tabs.sendMessage(tabs[0].id, { type: "RUN_SCAN" }, (response) => {

//         // safety check: if error sending msg of content script, send back null and stop.
//         if (chrome.runtime.lastError) {
//           console.error(chrome.runtime.lastError);
//           sendResponse(null);
//           return;
//         }
//         sendResponse(response);
//       });
//     });

//     // response coming back is async, keep msg channel open & dont close.
//     // without this, chrome would close the connection before axe-core finishes running & you would never get a response back.
//     return true;
//   }
// });
