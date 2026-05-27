const Scanner = () => {

  // Uses Chromes msg system to send a RUN_SCAN msg thru the extension, and when a response comes back, log it.
  const handleScan = () => {

    /* [Details]:
     - chrome = the chrome browser API. a global object Chrome gives every extension to talk to the browser
     - runtime = the msg' system of the extension. the channel extensions use to communicate between their different parts
     - sendMessage = the actual function that sends a msg thru that channel
     - type: "RUN_SCAN" = the msg payload (what gets sent)
     - (response) => { console.log(response) } = the callback. (auto runs when content.ts sends something back) */
    chrome.runtime.sendMessage({ type: "RUN_SCAN" }, (response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <button onClick={handleScan}>Run Scan</button>
    </div>
  );
};

export default Scanner;
