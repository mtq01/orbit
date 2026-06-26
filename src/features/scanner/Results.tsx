import ResultCard from "./ResultCard";
import type { AxeResult, AxeResults, FilterTab } from "../../types";
import { useState } from "react";

type ResultProps = {
  results: AxeResults;
  onRescan: () => void;
};

const Results = ({ results, onRescan }: ResultProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const tabs: FilterTab[] = ["all", "critical", "serious", "moderate"];
  let filteredResults: AxeResult[];

  if (activeFilter === "all") {
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

  return (
    <>
      <div className="flex justify-between items-center mx-3 mt-4">
        <h1 className="text-3xl font-bold">Scan Complete</h1>
        <button
          className="bg-orbit-white hover:bg-orbit-light-blue cursor-pointer hover:text-orbit-white border rounded-sm px-2"
          onClick={onRescan}
        >
          Re-Scan
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
  );
};

export default Results;
