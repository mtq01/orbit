import type { AxeResult } from "../../types";
import ResultCard from "../scanner/ResultCard";

interface ImpactGroupProps {
  // bucket labels: "violations, passes, or incomplete"
  label: string;
  // all results for each bucket as an array
  results: AxeResult[];
}

// da 4 impact lvls axe-core uses. 'as const' locks them as literal types.
const impactGroupLevels = ["critical", "serious", "moderate", "minor"] as const;

const ImpactGroups = ({ label, results }: ImpactGroupProps) => {
  return (
    // outer accordion (shows bucket label & total count)
    <details>
      <summary>
        {label} ({results.length})
      </summary>

      {/* loops over each impact lvl and creates an inner accordion for each */}
      {impactGroupLevels.map((level) => {
        // filter the full bucket down to only results matching the impact lvl
        const filtered = results.filter((r) => r.impact === level);
        return (
          // inner accordion: shows the impact lvl and count of results at that lvl
          <details key={level}>
            <summary>
              {level} ({filtered.length})
            </summary>

            {/* renders a ResultCard based on the filtered results, using its key and displaying the result */}
            {filtered.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </details>
        );
      })}
    </details>
  );
};

export default ImpactGroups;
