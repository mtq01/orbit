// listens for when the extension icon is clicked in the toolbar
// chrome.action = extension toolbar button
// .onClicked = the event
// .addListener = when this happens, run this function
// (tab) => { when the icon is clicked, Chrome automatically passes the current tab as an argument 'tab' contains info about that tab (ID, URL, title, etc.)
chrome.action.onClicked.addListener((tab) => {
  // open the side panel for this specific tab
  // tab.id is the unique ID for the tab the developer is currently on
  // you pass it in so Chrome knows which tab to open the panel for.
  chrome.sidePanel.open({ tabId: tab.id });
});



/* Basically...

   When the extension icon is clicked, find out which tab we're on & open the side panel for that tab.


   without this code, clicking the orbit extension does NOTHING. 

*/


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "RUN_SCAN") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      console.log("targeting tab:", tabs[0]?.url, tabs[0]?.id);
      if (!tabs[0]) {
        sendResponse(null);
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, { type: "RUN_SCAN" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          sendResponse(null);
          return;
        }
        sendResponse(response);
      });
    });
    return true;
  }
});