import type { AxeResult } from "../../types";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useState } from "react";

// passes AxeResult down to ResultCard below as a prop.
interface ResultCardProps {
  // displays a single result
  result: AxeResult;
}

// axe-core has 4 impact levels (keys). this obj contains their styles (tailwind)... might not need this anymore, not sure yet
const impactStyles = {
  critical:   { pill: "bg-red-200 text-black-800" },
  serious:    { pill: "bg-orange-200 text-black-800" },
  moderate:   { pill: "bg-yellow-200 text-black-800" },
  minor:      { pill: "bg-blue-200 text-black-800" },
};

// accepts the result from ResultCardProps
const ResultCard = ({ result }: ResultCardProps) => {
  const styles = impactStyles[result.impact];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details onToggle={(event) => setIsOpen((event.target as HTMLDetailsElement).open)} className="border border-gray-200 rounded-lg overflow-hidden m-3">
      <summary className="px-4 py-3 cursor-pointer list-none">
        <div className="flex items-center justify-between">
          <h3 className="text-lg">{result.id}</h3>
            { isOpen ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
        </div>
        <span className={`${styles.pill} text-xs font-bold px-2 py-1 capitalize`}>
          {result.impact} - {result.nodes.length} element
        </span>
      </summary>

      <div className="px-4 py-3 flex flex-col gap-3">
        {/* description of result */}
        <p className="text-md text-gray-600 mb-3">{result.help}</p>

        {/* affected DOM elements (code)*/}
        <code className="block text-md bg-gray-100 px-3 py-2 rounded mb-3 truncate">
          {result.nodes[0].html}
        </code>

        {/* what specifically failed */}
        <p className="text-md text-gray-600 mb-3">
          {result.nodes[0].failureSummary}
        </p>

        {/* learn best practices link */}
        <a
          href={result.helpUrl}
          target="_blank"
          rel="noreferrer"
          className="block text-md text-blue-600"
        >
          Learn <em>'{result.id}'</em> best practices.
        </a>
      </div>
    </details>
  );
};

export default ResultCard;
