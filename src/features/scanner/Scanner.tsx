import { useState } from "react";
import type { AxeResults } from "../../types";
import ResultCard from "../../features/scanner/ResultCard";

const Scanner = () => {
  // stores axe-core scan results. null until a scan has been run.
  const [results, setResults] = useState<AxeResults | null>(null);

  // error state
  const [error, setError] = useState<string | null>(null);

  const handleScan = () => {
    /* 
    [Function Flow]:
      - Scanner.tsx > background.js > content.ts > axe-core > content.ts > background.js > Scanner.tsx

    [Step by Step]
      - user clicks "run scan" inside Scanner.tsx UI
      - "run scan" triggers chrome.runtime.sendMessage and tells background.js to talk to content.ts to talk to axe-core
      - axe-core runs the scan and sends response back to content.ts, which sends them to background.js, which sends them back to Scanner.tsx

    [Details]:
     - chrome.runtime.sendMessage is a function that talks to background.js  
     - type: "RUN_SCAN" is the message payload 
     - (reponse) is the data axe core sends back.
     - setResults prints it in the UI
     */
    chrome.runtime.sendMessage({ type: "RUN_SCAN" }, (response) => {

      if (!response) {
          setError("This page can't be scanned. Chrome blocks extensions on browser homepages and internal pages for security reasons.");        return;
      }
      // stores the axe results in state so the UI can use them.
      setResults(response.results);
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
      {/* {results ? <pre>{JSON.stringify(results, null, 2)}</pre> : null} */}
      {/*                             ^^^^^    ^^^   ^ 
                                      data     filter  indentation */}

      {/* Error State: 
      FYI an error will still show in console, but this error msg is whats happening. */}
      {error ? <p>{error}</p> : null}


      {results?.violations.map((violation) => (
          <ResultCard key={violation.id} violation={violation}/>
      ))}
      

    </div>


  );
};

export default Scanner;