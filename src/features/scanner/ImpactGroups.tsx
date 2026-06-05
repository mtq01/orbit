import type { AxeResult } from "../../types";
import ResultCard from "../scanner/ResultCard";

interface ImpactGroupProps {
  // 4 types of violations
  impact: "critical" | "serious" | "moderate" | "minor";
  // displays a whole group of violations (needs to be array)
  violations: AxeResult[];
}

const ImpactGroups = ({ impact, violations }: ImpactGroupProps) => {
  return (
    <details>
      {/* shows impact lvl and number of violations found */}
      <summary>
        {impact} {violations.length}
      </summary>

      {/* [Output]
      - .violations             = look at the violations array (from axe-core)
      - .map((violation) =>     = loop thru all obj in the array & identify each violation.
      - <ResultsCard ...>       = for each violation, render a card. 
      - key={violation.id}      = the unique ID of each violation (from axe-core).
      - violation={violation}   = displays the full obj based on the props in ResultCard.tsx  
      */}
      {violations.map((violation) => (
        <ResultCard key={violation.id} violation={violation} />
      ))}
    </details>
  );
};

export default ImpactGroups;
