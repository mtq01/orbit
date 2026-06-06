import type { AxeResult } from "../../types";
import ResultCard from "../scanner/ResultCard";

interface ImpactGroupProps {
  // 4 types of results
  impact: "critical" | "serious" | "moderate" | "minor";
  // displays a whole group of results (needs to be array)
  results: AxeResult[];
}

const ImpactGroups = ({ impact, results }: ImpactGroupProps) => {
  return (
    <details>
      {/* shows impact lvl and number of results found */}
      <summary>
        {impact} {results.length}
      </summary>

      {/* [Output]
      - .results             = look at the results array (from axe-core)
      - .map((violation) =>     = loop thru all obj in the array & identify each violation.
      - <ResultsCard ...>       = for each violation, render a card. 
      - key={violation.id}      = the unique ID of each violation (from axe-core).
      - violation={violation}   = displays the full obj based on the props in ResultCard.tsx  
      */}
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </details>
  );
};

export default ImpactGroups;
