import { useState } from "react";
import type { AxeResults } from "../../types";
import ImpactGroups from "../scanner/ImpactGroups";

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
        nodes: [
          {
            html: '<button class="btn">Click me</button>',
            failureSummary:
              "Fix any of the following: Element has insufficient color contrast of 2.32:1 (foreground color: #ffffff, background color: #cccccc, font size: 14pt, font weight: normal). Expected contrast ratio of 4.5:1",
          },
        ],
      },
      {
        id: "button-name",
        impact: "serious",
        description: "Ensures buttons have discernible text",
        help: "Buttons must have discernible text",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/button-name",
        nodes: [
          {
            html: "<button></button>",
            failureSummary:
              "Fix any of the following: Element does not have inner text that is visible to screen readers. aria-label attribute does not exist or is empty. aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty.",
          },
        ],
      },
      {
        id: "landmark-one-main",
        impact: "moderate",
        description: "Ensures the document has a main landmark",
        help: "Document should have one main landmark",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/landmark-one-main",
        nodes: [
          {
            html: "<html lang='en'>",
            failureSummary:
              "Fix all of the following: Document does not have a main landmark",
          },
        ],
      },
      {
        id: "page-has-heading-one",
        impact: "minor",
        description: "Ensures the page has at least one level-one heading",
        help: "Page should contain a level-one heading",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one",
        nodes: [
          {
            html: "<html lang='en'>",
            failureSummary:
              "Fix all of the following: Page must have a level-one heading",
          },
        ],
      },
    ],
    passes: [
      {
        id: "html-has-lang",
        impact: "serious",
        description: "Ensures every HTML document has a lang attribute",
        help: "html element must have a lang attribute",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/html-has-lang",
        nodes: [
          {
            html: "<html lang='en'>",
            failureSummary: "",
          },
        ],
      },
      {
        id: "document-title",
        impact: "serious",
        description: "Ensures each HTML document contains a non-empty title",
        help: "Documents must have a title element",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/document-title",
        nodes: [
          {
            html: "<title>My Page</title>",
            failureSummary: "",
          },
        ],
      },
      {
        id: "image-alt",
        impact: "critical",
        description:
          "Ensures img elements have alternate text or a role of none or presentation",
        help: "Images must have alternate text",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/image-alt",
        nodes: [
          {
            html: '<img src="logo.png" alt="Company logo">',
            failureSummary: "",
          },
        ],
      },
      {
        id: "label",
        impact: "moderate",
        description: "Ensures every form element has a label",
        help: "Form elements must have labels",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/label",
        nodes: [
          {
            html: '<input type="text" id="name" aria-label="Full name">',
            failureSummary: "",
          },
        ],
      },
      {
        id: "list",
        impact: "minor",
        description: "Ensures that lists are structured correctly",
        help: "list element must have direct children that are the appropriate list item elements",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/list",
        nodes: [
          {
            html: "<ul><li>Item one</li><li>Item two</li></ul>",
            failureSummary: "",
          },
        ],
      },
    ],
    incomplete: [
      {
        id: "color-contrast",
        impact: "serious",
        description:
          "Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds",
        help: "Elements must have sufficient color contrast",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/color-contrast",
        nodes: [
          {
            html: "<p class='text-gray-400'>Some text</p>",
            failureSummary:
              "axe couldn't determine the contrast ratio — background color could not be determined due to a background image or gradient",
          },
        ],
      },
      {
        id: "label",
        impact: "critical",
        description: "Ensures every form element has a label",
        help: "Form elements must have labels",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/label",
        nodes: [
          {
            html: '<input type="text">',
            failureSummary:
              "axe couldn't determine if this input has an associated label — it may be labeled via JavaScript or a custom ARIA pattern",
          },
        ],
      },
      {
        id: "landmark-one-main",
        impact: "moderate",
        description: "Ensures the document has a main landmark",
        help: "Document should have one main landmark",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/landmark-one-main",
        nodes: [
          {
            html: "<div role='main'>",
            failureSummary:
              "axe couldn't determine if this element is the only main landmark on the page",
          },
        ],
      },
      {
        id: "image-alt",
        impact: "minor",
        description:
          "Ensures img elements have alternate text or a role of none or presentation",
        help: "Images must have alternate text",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.11/image-alt",
        nodes: [
          {
            html: '<img src="decorative.png">',
            failureSummary:
              "axe couldn't determine if this image is decorative or informative",
          },
        ],
      },
    ],
  };
  /* COMMENTED OUT DURING UI DEVELOPMENT, DO NOT DELETE
  // stores axe-core scan results. null until a scan has been run.
  // const [results, setResults] = useState<AxeResults | null>(null);
  */

  // TEMPORARY FOR UI DEVELOPMENT
  const [results, setResults] = useState<AxeResults | null>(null);
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
      {/* Error State: an error will still show in console, but this error msg is whats happening. */}
      {error ? <p role="alert">{error}</p> : null}


    {/* if results is EMPTY, display default blank page, if NOT empty, display scan results */}
      {!results ? (
        <>
          <p>🪐</p>
          <h2>Check this page for accessibility</h2>

          {/* handleScan button commented out during UI build */}
          {/* <button onClick={handleScan}>Run Scan</button> */}

          {/* DEV ONLY - rmv b4 production */}
          <button onClick={() => setResults(results ? null : (mockResults as AxeResults))}>
            Run Scan (Toggle State - Dev Only)
          </button>
        </>
      ) : (
        <>
        <h2>Scan Results</h2>
        <p>24 elements to review</p>
        <div>
         <p> All | Critical | Serious | Moderate</p>
        </div>
        {/* handleScan button commented out during UI build */}
        {/* <button onClick={handleScan}>Run Scan</button> */}

        {/* DEV ONLY - rmv b4 production */}
        <button onClick={() => setResults(mockResults as AxeResults)}>⏎ Re-Scan (Dev)</button>
        
          {/* Scan Results: grouped into 3 buckets, each is broken down by impact level */}
          <section aria-label="Scan Results">
            <ImpactGroups label="Violations" results={results?.violations} />
            <ImpactGroups label="Passes" results={results?.passes} />
            <ImpactGroups label="Incomplete" results={results?.incomplete} />
          </section>
          </>
      )}
    </section>
  );
};

export default Scanner;
