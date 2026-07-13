import ResultCard from "./ResultCard";
import type { AxeResult, AxeResults, FilterTab } from "../../types";
import { useState } from "react";

type ResultProps = {
  results: AxeResults;
  onRescan: () => void;
};

const Results = ({ results, onRescan }: ResultProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    setOpenId(null);
  };
  const tabs: FilterTab[] = ["all", "critical", "serious", "moderate"];
  let filteredResults: AxeResult[];

  if (activeFilter === "all") {
    filteredResults = [...results.violations].sort(
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
    <div className="flex flex-col h-full px-4 max-w-xl mx-auto">
      <div className=" my-10">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tighter ">
            Scan Complete
          </h1>
          <button
            className="cursor-pointer bg-orbit-blue text-orbit-white border rounded-lg px-2 py-1 whitespace-nowrap shrink-0"
            onClick={onRescan}
          >
            <span className="text-orbit-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>{" "}
              Re-Scan
            </span>
          </button>
        </div>
        <p className="text-orbit-muted">
          {results.violations.length} elements to review
        </p>
      </div>
      <div
        className="flex gap-1.5 mb-6 items-center flex-wrap"
        role="tablist"
        aria-label="Filter by impact"
      >
        {tabs.map((tab) => (
          <button
            className={`border cursor-pointer rounded-md capitalize tracking-tight px-2 py-1 text-sm whitespace-nowrap ${activeFilter === tab ? "bg-orbit-blue text-orbit-white" : "bg-orbit-white hover:bg-orbit-light-blue hover:text-orbit-white "}`}
            key={tab}
            role="tab"
            aria-selected={activeFilter === tab}
            onClick={() => handleFilterChange(tab)}
          >
            {tab} ({getCount(tab)})
          </button>
        ))}
      </div>
      {/* Scan Results: list of result cards */}
      <section aria-label="Scan Results">
        {filteredResults.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            // only one result card can be open at a time, so we check if the current result.id matches the one we clicked on
            isOpen={openId === result.id}
            onToggle={handleToggle}
          />
        ))}
      </section>
    </div>
  );
};

export default Results;
