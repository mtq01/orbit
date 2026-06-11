import type { AxeResult } from "../../types";
import { useState } from "react";

// icons
import arrowLeft from "../../assets/icons/arrow-left.svg";
import arrowRight from "../../assets/icons/arrow-right.svg";
import chevronUp from "../../assets/icons/chevrons-up.svg";
import chevronDown from "../../assets/icons/chevrons-down.svg";

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
  "block text-md text-[var(--color-orbit-white)] bg-[var(--color-orbit-blue)] px-3 py-2 rounded mb-3 break-words";

// accepts the result from ResultCardProps
const ResultCard = ({ result }: ResultCardProps) => {
  const styles = impactStyles[result.impact];
  const [isOpen, setIsOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState(0);

  return (
    <details
      onToggle={(event) => setIsOpen((event.target as HTMLDetailsElement).open)}
      className="border border-gray-200 rounded-lg m-3"
    >
      {/* summary is the built-in label for the details element. It does not need a heading */}
      <summary className="px-4 py-3 border-b border-gray-200 cursor-pointer list-none hover:bg-gray-50 focus-visible:outline-orbit-blue">
        <div className="flex items-center justify-between">
          {/* use span here bcuz no header is needed & the result.id is already descriptive. */}
          <span className="text-lg font-bold">{result.id}</span>
          {isOpen ? (
            <img
              src={chevronUp}
              // alt is left blank bcuz the buttons aria-label describes the action
              alt=""
              aria-hidden="true"
              className="w-5 h-5"
            />
          ) : (
            <img
              src={chevronDown}
              // alt is left blank bcuz the buttons aria-label describes the action
              alt=""
              aria-hidden="true"
              className="w-5 h-5"
            />
          )}
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

      {/* sections need an aria label, this one is dynamic based on the result.id */}
      <section
        // ex announcement: 'color contrast details'
        aria-label={`${result.id} details`}
        className="px-4 py-3 flex flex-col gap-3"
      >
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
            className="text-md text-blue-600 underline focus-visible:outline-orbit-blue"
          >
            <em>Learn '{result.id}' best practices.</em>
          </a>
        </p>

        {/* affected DOM elements (code)*/}
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">Elements in Review</p>

          {/* buttons, switching thru violations of the same type */}
          <div className="flex justify-between gap-2 border py-2 px-1">
            {/* hide back button when on 1st result, but reserve space for the btn to maintain flex styles */}
            <div className="w-6 items-center flex">
              {currentNode > 0 && (
                <button
                  aria-label="Previous Element"
                  className="border-none cursor-pointer focus-visible:outline-orbit-blue"
                  onClick={() => {
                    if (currentNode > 0) setCurrentNode(currentNode - 1);
                  }}
                >
                  <img
                    src={arrowLeft}
                    // alt is left blank bcuz the buttons aria-label describes the action
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5"
                  />
                </button>
              )}
            </div>
            {/* aria-live allows screen reader users to hear the update when they click next/prev. 
            otherwise SR's wont say it when the currentNode changes. "polite" means the SR waits until the user
            finishes what they are currently doing b4 announcing the update. */}
            <span aria-live="polite">
              Element {currentNode + 1} of {result.nodes.length}
            </span>

            <div className="w-6 items-center flex">
              {currentNode < result.nodes.length - 1 && (
                <button
                  aria-label="Next Element"
                  className="border-none cursor-pointer focus-visible:outline-orbit-blue"
                  onClick={() => {
                    if (currentNode < result.nodes.length - 1)
                      setCurrentNode(currentNode + 1);
                  }}
                  disabled={currentNode === result.nodes.length - 1}
                >
                  <img
                    src={arrowRight}
                    // alt is left blank bcuz the buttons aria-label describes the action
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5"
                  />
                </button>
              )}
            </div>
          </div>
          <p className="font-bold text-lg">How to Fix</p>

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
        </div>
      </section>
    </details>
  );
};

export default ResultCard;
