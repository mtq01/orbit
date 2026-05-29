import { useState } from "react";
import type { AxeViolation } from "../../types";


const Scanner = () => {
  // stores axe-core scan results. null until a scan has been run.
  const [results, setResults] = useState<AxeViolation[] | null>(null);

  const handleScan = () => {
    /* 
    [Function Flow]:
      - Scanner.tsx > background.js > content.js > axe-core > content.js > background.js > Scanner.tsx

    [Step by Step]
      - user clicks "run scan" inside Scanner.tsx UI
      - "run scan" triggers chrome.runtime.sendMessage and tells background.js to talk to content.js to talk to axe-core
      - axe-core runs the scan and sends response back to content.js, which sends them to background.js, which sends them back to Scanner.tsx

    [Details]:
     - chrome.runtime.sendMessage is a function that talks to background.js  
     - type: "RUN_SCAN" is the message payload 
     - (reponse) is the data axe core sends back.
     - setResults prints it in the UI
     */
    chrome.runtime.sendMessage({ type: "RUN_SCAN" }, (response) => {
      // console.log(response) is for debugging
      console.log(response.results.violations);
      // stores the axe results in state so the UI can use them.
      setResults(response.results.violations);
    });
  };

  return (
    <div>
      <button onClick={handleScan}>Run Scan</button>

      {/* [Output - Ternary Operator]
      - results ?   = if results has data, show <pre> tag
      - : null      = otherwise, show nothing.
      - <pre>{...}  = converts the results obj into a readable string.

      [Details]
      - results   = the data to convert
      - null      = include everything, no filtering (you will rarely change this from null)
      - 2         = indent with 2 spaces so a human can read it.
      */}
      {results ? <pre>{JSON.stringify(results, null, 2)}</pre> : null}
      {/*                             ^^^^^    ^^^   ^ 
                                      data     filter  indentation */}

    </div>


  );
};

export default Scanner;
