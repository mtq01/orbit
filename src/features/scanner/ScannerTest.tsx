import { useState } from "react";
import type { AxeResults, ScanResponse } from "../../types";
import { SCAN_MESSAGE } from "../../types";
import ResultCard from "../scanner/ResultCard";

const Scanner = () => {
  // Uses a union type (<AxeResults | null>) to allow the value to be either a AxeResults OR a null
  const [results, setResults] = useState<AxeResults | null>(null);

  // null until something goes wrong, then it becomes a string message. value can be a string or null
  const [error, setError] = useState<string | null>(null);

  // true while axe-core is running, false otherwise
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleScan = async () => {
    // reset everything before each scan soresults don't linger
    setIsLoading(true);
    setResults(null);
    setError(null);

    // find the tab the user is actually looking at.
    // lastFocusedWindow is critical here the side panel is its own window context,
    // so without it we'd be targeting the panel itself, not the browser tab.
    // source: https://developer.chrome.com/docs/extensions/reference/api/tabs#method-query
    const [tab] = await chrome.tabs.query({
      lastFocusedWindow: true,
      active: true,
    });

    // if there's no tab id, we can't scan stop here and tell the user why. we will need to add much more robust error handling later
    if (
      !tab?.id ||
      !tab.url ||
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      setError(
        "This page can't be scanned. Chrome blocks extensions on browser homepages and internal pages for security reasons.",
      );
      setIsLoading(false);
      return;
    }

    // inject content.js into the active tab on demand.
    // this is why the scan works on ANY tab, even ones opened before the extension loaded.
    // without this, tabs that were already open when the extension installed would never get the content script.
    // source: https://developer.chrome.com/docs/extensions/reference/api/scripting/#method-executeScript
    // we need to add this if not using background.js for routing
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    // the side panel is a chrome-extension:// page with full Chrome API access,
    // so it can call tabs.sendMessage directly.
    // SCAN_MESSAGE is a typed constant from types.ts so we never typo the message type.
    // https://developer.chrome.com/docs/extensions/reference/api/tabs#method-sendMessage
    try {
      // whenever you await something TypeScript doesnt know the shape of, use "as" to tell it what to expect.
      // sendMessage returns "any" by default so TypeScript has no idea what comes back.
      // "as ScanResponse" says: we know what this is, it matches the shape we defined in types.ts.
      const response = (await chrome.tabs.sendMessage(
        tab.id,
        SCAN_MESSAGE,
      )) as ScanResponse;
      setResults(response.results);
    } catch {
      setError(
        "Could not connect to the page. Try reloading the tab you want to scan.",
      );
    } finally {
      // finally always runs whether the scan worked or crashed.
      // keeps us from writing setIsLoading(false) twice in both try and catch.
      setIsLoading(false);
    }
  };

  return (
    <section aria-label="Accessibility Scanner">
      {/* Error State: FYI an error will still show in console, but this error msg is whats happening. */}
      {error ? <p role="alert">{error}</p> : null}

      {!results ? (
        <>
          <p>🪐</p>
          <h2>Check this page for accessibility</h2>

          {/* handleScan button commented out during UI build */}
          {/* <button onClick={handleScan}>Run Scan</button> */}

          {/* DEV ONLY - rmv b4 production */}
          <button onClick={handleScan} disabled={isLoading}>
            {isLoading ? "Scanning..." : "Run Scan"}
          </button>
        </>
      ) : (
        <>
          <h2>Scan Results</h2>
          <p>24 elements to review</p>

          <div>
            <p>All | Critical | Serious | Moderate</p>
          </div>
          <button onClick={handleScan} disabled={isLoading}>
            {isLoading ? "Scanning..." : "Re-Scan"}
          </button>

          {/* Scan Results: list of result cards */}
          <section aria-label="Scan Results">
            {results.violations.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </section>
        </>
      )}
    </section>
  );
};
export default Scanner;
