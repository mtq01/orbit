import type { AxeResult } from "../../types";

interface ResultCardProps {
  violation: AxeResult;
}

const ResultCard = ({ violation }: ResultCardProps) => {
  return (
    <article>
      <header>
        {/* rule name (key) */}
        <h3>{violation.id}</h3>
        {/* impact score */}
        <p>{violation.impact}</p>
      </header>


      <p>{violation.description}</p>
      {/* affected DOM elements */}
      <code>{violation.nodes[0].html}</code>
      <a href={violation.helpUrl} target="_blank" rel="noreferrer">Learn More</a>
    </article>
  );
};

export default ResultCard;
