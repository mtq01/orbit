import type { AxeResult } from "../../types";

// passes AxeResult down to ResultCard below as a prop.
interface ResultCardProps {
    // displays a single violation
  violation: AxeResult;
}

// axe-core has 4 impact levels (keys). this obj contains their styles (tailwind)
const impactStyles = {
  critical: { band: "bg-red-100", pill: "bg-red-200 text-black-800" },
  serious: { band: "bg-orange-100", pill: "bg-orange-200 text-black-800" },
  moderate: { band: "bg-yellow-100", pill: "bg-yellow-200 text-black-800" },
  minor: { band: "bg-blue-100", pill: "bg-blue-200 text-black-800" },
};

// accepts the violation from ResultCardProps
const ResultCard = ({ violation }: ResultCardProps) => {
  const styles = impactStyles[violation.impact];

  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden">
      <header
        className={`${styles.band} px-4 py-3 flex items-center justify-between`}
      >
        {/* rule name (key) */}
        <h3 className="text-lg">{violation.id}</h3>
        {/* impactStyles is compared the the violation.impact and outputs the proper style on the displayed violation.*/}
        <span
          className={`${styles.pill} text-xs font-bold px-2 py-1 rounded-full capitalize`}
        >
          {violation.impact}
        </span>
      </header>

      <div className="px-4 py-3 flex flex-col gap-3">
        {/* description of violation */}
        <p className="text-md text-gray-600 mb-3">{violation.help}</p>

        {/* affected DOM elements (code)*/}
        <code className="block text-md bg-gray-100 px-3 py-2 rounded mb-3 truncate">
          {violation.nodes[0].html}
        </code>

        {/* what specifically failed */}
        <p className="text-md text-gray-600 mb-3">
          {violation.nodes[0].failureSummary}
        </p>

        {/* learn best practices link */}
        <a
          href={violation.helpUrl}
          target="_blank"
          rel="noreferrer"
          className="block text-md text-blue-600"
        >
          Learn <em>'{violation.id}'</em> best practices.
        </a>
      </div>
    </article>
  );
};

export default ResultCard;
