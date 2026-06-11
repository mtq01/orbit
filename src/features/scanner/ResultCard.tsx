import type { AxeResult } from "../../types";
import { ChevronsDown, ChevronsUp, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

// passes AxeResult down to ResultCard below as a prop.
interface ResultCardProps {
  // displays a single result
  result: AxeResult;
}

// axe-core has 4 impact levels (keys). this obj contains their styles (tailwind)... might not need this anymore, not sure yet
const impactStyles = {
  critical: { pill: "bg-red-200 text-black-800" },
  serious: { pill: "bg-orange-200 text-black-800" },
  moderate: { pill: "bg-yellow-200 text-black-800" },
  minor: { pill: "bg-blue-200 text-black-800" },
};

// code section styles
const codeStyle =
  "block text-md text-[var(--color-orbit-white)] bg-[var(--color-orbit-blue)] px-3 py-2 rounded mb-3 truncate";

// accepts the result from ResultCardProps
const ResultCard = ({ result }: ResultCardProps) => {
  const styles = impactStyles[result.impact];
  const [isOpen, setIsOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState(0);

  return (
    <details
      onToggle={(event) => setIsOpen((event.target as HTMLDetailsElement).open)}
      className="border border-gray-200 rounded-lg overflow-hidden m-3"
    >
      <summary className="px-4 py-3 cursor-pointer list-none border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{result.id}</h2>
          {isOpen ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
        </div>
        <span
          className={`${styles.pill} rounded-md text-sm font-bold px-2 py-1 capitalize`}
        >
          {result.impact}
        </span>
        <span className="text-sm opacity-80">
          {" "}
          · {result.nodes.length} element
        </span>
      </summary>

      <section className="px-4 py-3 flex flex-col gap-3">
        {/* description of result */}
        <p>
          {result.nodes[currentNode].any[0] && (
            <>{result.nodes[currentNode].any[0].message}. </>
          )}
          {/* learn best practices link */}
          <a
            href={result.helpUrl}
            target="_blank"
            rel="noreferrer"
            className="text-md text-blue-600 underline"
          >
            <em>Learn '{result.id}' best practices.</em>
          </a>
        </p>

        {/* affected DOM elements (code)*/}
        <article className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Elements in Review</h3>

          {/* buttons, switching thru violations of the same type */}
          <div className="flex justify-between gap-2 border py-2 px-1">
            {/* hide back button when on 1st result, but reserve space for the btn to maintain flex styles */}
            <div className="w-6 items-center flex">
              {currentNode > 0 && (
                <button
                  className="border-none cursor-pointer"
                  onClick={() => {
                    if (currentNode > 0) setCurrentNode(currentNode - 1);
                  }}
                >
                  <ArrowLeft />
                </button>
              )}
            </div>
            <span>
              Element {currentNode + 1} of {result.nodes.length}
            </span>

            <div className="w-6 items-center flex">
              {currentNode < result.nodes.length - 1 && (
                <button
                  className="border-none cursor-pointer"
                  onClick={() => {
                    if (currentNode < result.nodes.length - 1)
                      setCurrentNode(currentNode + 1);
                  }}
                  disabled={currentNode === result.nodes.length - 1}
                >
                  <ArrowRight />
                </button>
              )}
            </div>
          </div>
          <h4 className="font-bold text-lg">How to Fix</h4>

          <div>
            <p>Selector</p>
            <code className={codeStyle}>
              {result.nodes[currentNode].target.join(", ")}
            </code>
          </div>

          <div>
            <p>HTML</p>
            <code className={codeStyle}>{result.nodes[currentNode].html}</code>
          </div>
        </article>
      </section>
    </details>
  );
};

export default ResultCard;
