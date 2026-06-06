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
      - .map((result) =>     = loop thru all obj in the array & identify each result.
      - <ResultsCard ...>    = for each result, render a card. 
      - key={result.id}      = the unique ID of each result (from axe-core).
      - result={result}      = displays the full obj based on the props in ResultCard.tsx  
      */}
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </details>
  );
};

export default ImpactGroups;
