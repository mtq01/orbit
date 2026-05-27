import { useState } from "react";

const Scanner = () => {
  // state management for axe error results (3 key buckets)
  const [results, setResults] = useState(null);

  // Uses Chromes msg system to send a RUN_SCAN msg thru the extension, and when a response comes back, log it.
  const handleScan = () => {

    /* [Details]:
     - chrome = the chrome browser API. a global object Chrome gives every extension to talk to the browser
     - runtime = the msg' system of the extension. the channel extensions use to communicate between their different parts
     - sendMessage = the actual function that sends a msg thru that channel
     - type: "RUN_SCAN" = the msg payload (what gets sent)
     - (response) => { ... } = the callback. auto runs when content.ts sends something back, logs the response and stores the results in state */
    chrome.runtime.sendMessage({ type: "RUN_SCAN" }, (response) => {
      // console.log(response) is for debugging
      console.log(response);
      // stores the axe results in state so the UI can use them.
      setResults(response.results);
    });
  };

  return (
    <div>
      <button onClick={handleScan}>Run Scan</button>

      {/* 
      - if results is null, render nothing.
      - if results has data, render a <pre> tag with the results loaded as formatted JSON 
      - {JSON.stringify(results, null, 2)} converts the results obj into a readable string. The 2 is the # of spaces used for indendation
      */}
      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </div>


  );
};

export default Scanner;
