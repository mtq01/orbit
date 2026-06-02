import type { AxeResult } from "../../types";

// passes AxeResult down to ResultCard below as a prop.
interface ResultCardProps {
  violation: AxeResult;
}

// axe-core has 4 impact levels (keys). this obj contains their styles (tailwind)
const impactStyles = {
  critical: "bg-red-300 text-black-700",
  serious: "bg-orange-300 text-black-700",
  moderate: "bg-yellow-300 text-black-700",
  minor: "bg-blue-300 text-black-700",
};

// accepts the violation from ResultCardProps
const ResultCard = ({ violation }: ResultCardProps) => {
  return (
    <article>
      <header>
        {/* rule name (key) */}
        <h3>{violation.id}</h3>
        {/* impactStyles is compared the the violation.impact and outputs the proper style on the displayed violation.*/}
        <span className={impactStyles[violation.impact]}>
          {violation.impact}
        </span>
      </header>

      <p>{violation.description}</p>
      {/* affected DOM elements */}
      <code>{violation.nodes[0].html}</code>
      <a href={violation.helpUrl} target="_blank" rel="noreferrer">
        Learn More
      </a>
    </article>
  );
};

export default ResultCard;
