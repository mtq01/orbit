import { useState } from "react";
import type {
  AxeResults,
  AxeResult,
  FilterTab,
  ScanResponse,
} from "../../types";
import { SCAN_MESSAGE } from "../../types";
import ResultCard from "../scanner/ResultCard";
import PreScan from "./PreScan";
import NoIssue from "./NoIssue";
import Loader from "./Loader";

const Scanner = () => {
  // Uses a union type (<AxeResults | null>) to allow the value to be either a AxeResults OR a null
  const [results, setResults] = useState<AxeResults | null>(null);

  // null until something goes wrong, then it becomes a string message. value can be a string or null
  const [error, setError] = useState<string | null>(null);

  //This one is for filtering through our tabs
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const tabs: FilterTab[] = ["all", "critical", "serious", "moderate"];
  let filteredResults: AxeResult[];

  if (!results) {
    filteredResults = [];
  } else if (activeFilter === "all") {
    filteredResults = results.violations.sort(
      (a, b) => tabs.indexOf(a.impact) - tabs.indexOf(b.impact),
    );
  } else {
    filteredResults = results.violations.filter(
      (v) => v.impact === activeFilter,
    );
  }

  //helper function to show the impact number on each tabs
  const getCount = (tab: string) => {
    if (!results) return 0;
    if (tab === "all") return results.violations.length;
    return results.violations.filter((v) => v.impact === tab).length;
  };

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
    <section aria-label="Accessibility Scanner" className="h-full">
      {/* Error State: FYI an error will still show in console, but this error msg is whats happening. */}

      {isLoading ? (
        <Loader />
      ) : !results ? (
        <PreScan error={error} onScan={handleScan} />
      ) : // just change === to > to test no issue
      results.violations.length === 0 ? (
        <NoIssue onScan={handleScan} />
      ) : (

        // move this section to a component on next update. cleans up codebase.
        <>
          <div className="flex justify-between items-center mx-3 mt-4">
            <h1 className="text-3xl font-bold">Scan Complete</h1>
            <button
              className="bg-orbit-white hover:bg-orbit-light-blue cursor-pointer hover:text-orbit-white border rounded-sm px-2"
              onClick={handleScan}
              disabled={isLoading}
            >
              {isLoading ? "Scanning..." : "Re-Scan"}
            </button>
          </div>
          <p className="mx-3">{results.violations.length} elements to review</p>
          <div
            className="flex space-x-2 mx-3 pt-8 pb-1"
            role="tablist"
            aria-label="Filter by impact"
          >
            {tabs.map((tab) => (
              <button
                className={`${activeFilter === tab ? "bg-orbit-blue border cursor-pointer text-orbit-white rounded-sm px-2" : "bg-orbit-white cursor-pointer hover:bg-orbit-light-blue border hover:text-orbit-white rounded-sm px-2"}`}
                key={tab}
                role="tab"
                aria-selected={activeFilter === tab}
                onClick={() => setActiveFilter(tab)}
              >
                {tab} ({getCount(tab)})
              </button>
            ))}
          </div>

          {/* Scan Results: list of result cards */}
          <section aria-label="Scan Results">
            {filteredResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </section>
        </>
      )}
    </section>
  );
};
export default Scanner;
