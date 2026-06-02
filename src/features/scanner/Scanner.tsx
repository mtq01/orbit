import { useState } from "react";
import type { AxeResults } from "../../types";
import ResultCard from "../../features/scanner/ResultCard";

const Scanner = () => {
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // MOCK DATA DURING UI DEVELOPMENT (TEMPORARY)
  const mockResults = {
    violations: [
      {
        id: "color-contrast",
        impact: "critical",
        description:
          "Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds",
        help: "Elements must have sufficient color contrast",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/color-contrast",
        nodes: [{ html: '<button class="btn">Click me</button>' }],
      },
      {
        id: "button-name",
        impact: "serious",
        description: "Ensures buttons have discernible text",
        help: "Buttons must have discernible text",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/button-name",
        nodes: [{ html: "<button></button>" }],
      },
      {
        id: "landmark-one-main",
        impact: "moderate",
        description: "Ensures the document has a main landmark",
        help: "Document should have one main landmark",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/landmark-one-main",
        nodes: [{ html: "<html lang='en'>" }],
      },
      {
        id: "page-has-heading-one",
        impact: "minor",
        description: "Ensures the page has at least one level-one heading",
        help: "Page should contain a level-one heading",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one",
        nodes: [{ html: "<html lang='en'>" }],
      },
    ],
  };
  /* COMMENTED OUT DURING UI DEVELOPMENT, DO NOT DELETE
  // stores axe-core scan results. null until a scan has been run.
  // const [results, setResults] = useState<AxeResults | null>(null);
  */

  // TEMPORARY FOR UI DEVELOPMENT
  const [results, _setResults] = useState<AxeResults | null>(
    mockResults as AxeResults,
  );
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // error state
  const [error, _setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  /* DO NOT DELETE - COMMENTED OUT DURING UI DEV 
  const handleScan = () => {
    
    [Function Flow]:
      - Scanner.tsx > background.js > content.ts > axe-core > content.ts > background.js > Scanner.tsx

    [Step by Step]
      - user clicks "run scan" inside Scanner.tsx UI
      - "run scan" triggers chrome.runtime.sendMessage and tells background.js to talk to content.ts to talk to axe-core
      - axe-core runs the scan and sends response back to content.ts, which sends a msg to background.js, which sends results back to Scanner.tsx to be displayed in the UI.

    [Details]:
     - chrome.runtime.sendMessage is a function that talks to background.js  
     - type: "RUN_SCAN" is the message payload 
     - (reponse) is the data axe core sends back.
     - setResults prints it in the UI





    chrome.runtime.sendMessage({ type: "RUN_SCAN" }, (response) => {
      if (!response) {
        setError(
          "This page can't be scanned. Chrome blocks extensions on browser homepages and internal pages for security reasons.",
        );
        return;
      }
      // stores the axe results in state so the UI can use them.
      setResults(response.results);
    });
  };
*/
  // -------------------------------------------------------------------------

  return (
    <section aria-label="Accessibility Scanner">
      {/* handleScan button commented out during UI build */}
      {/* <button onClick={handleScan}>Run Scan</button> */}
      <button>Run Scan (Temp)</button>

      {/* Error State: 
      FYI an error will still show in console, but this error msg is whats happening. */}
      {error ? <p role="alert">{error}</p> : null}

      {/* [Output]
      - results?                = if results is not null, continue (? prevents a crash when results is still null before a scan has run)
      - .violations             = look at the violations bucket
      - .map((violation) =>     = loop thru all items in the array & identify each violation.
      - <ResultsCard ...>       = for each violation, render a card. 
      - key={violation.id}      = the unique ID of each violation (from axe-core).
      - violation={violation}   = displays the full obj based on the props in ResultCard.tsx  
      */}
      <section aria-label="Violations">
        {results?.violations.map((violation) => (
          <ResultCard key={violation.id} violation={violation} />
        ))}
      </section>
    </section>
  );
};

export default Scanner;
