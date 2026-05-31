import type { AxeResult } from "../../types";

interface ResultCardProps {
    violation: AxeResult;
}

const ResultCard = ({ violation }: ResultCardProps) => {
    return (
        <div>
            <p>{violation.id}</p>
            <p>{violation.impact}</p>
            <p>{violation.description}</p>
            <p>{violation.nodes[0].html}</p>
        </div>
    )
}

export default ResultCard;