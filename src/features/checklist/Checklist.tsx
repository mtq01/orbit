import { useState, useEffect } from "react";
import { checklistData } from "../checklist/checklistData";
import chevronUp from "../../assets/icons/chevrons-up.svg";
import chevronDown from "../../assets/icons/chevrons-down.svg";
import externalLink from "../../assets/icons/external-link.svg";

// function 1: component
const Checklist = () => {
  // checked state: stores each item id as a key and true/false as the value
  // lazy initializer reads from localStorage on first render so checked state persists between sessions
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("orbit-checklist");
    // if saved data exists parse it back into an object, otherwise start with an empty object
    if (saved) {
      return JSON.parse(saved);
    } else {
      return {};
    }
  });

  // declare state for categories (open/close)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );

  // declare the handler function for categories (open/close)
  const categoryToggle = (id: string, isOpen: boolean) => {
    const updated = { ...openCategories }; // copy the current object
    updated[id] = isOpen; // update just this one category
    setOpenCategories(updated); // save the new object back to state
  };

  // every time checked changes, save the updated state to localStorage
  useEffect(() => {
    localStorage.setItem("orbit-checklist", JSON.stringify(checked));
  }, [checked]);

  // toggles a single checklist item between checked and unchecked
  const toggleItem = (id: string) => {
    // copy the current checked object and flip the value for the clicked item
    if (checked[id]) {
      // if it was true, make it false
      setChecked({ ...checked, [id]: false });
    } else {
      // if it was false or didnt exist yet, make it true
      setChecked({ ...checked, [id]: true });
    }
  };

  // total number of checklist items across all categories
  // flatMap converts the 'checklistData' array of arrays and flattens them into a SINGLE array for easy mapping. Length counts everytying in that array
  const totalItems = checklistData.flatMap((category) => category.items).length;

  // checks boolean value of ALL checklist items. filters for the items with a value of TRUE. counts how many TRUE checkbox items there are.
  const checkedCount = Object.values(checked).filter(
    (value) => value === true,
  ).length;

  // when user clicks "reset all" btn: reset the setChecked to an empty object and delete the previous orbit-checklist from local
  const resetChecklist = () => {
    // wipe the checked state back to empty
    setChecked({});
    // collapse all accordions
    setOpenCategories({});
    // delete the saved data from localStorage
    localStorage.removeItem("orbit-checklist");
  };

  // function 1 return
  return (
    <>
      <section className="px-3 py-5">
        <div>
          <h2 className="font-semibold">
            {checkedCount} of {totalItems} completed
          </h2>
        </div>
        <progress
          max={totalItems}
          value={checkedCount}
          className="w-full h-2 rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full"
        >
          {checkedCount}
        </progress>
        <p className="text-sm">
          This checklist uses the{" "}
          <a
            className="underline text-blue-600 hover:no-underline"
            href="https://www.w3.org/WAI/standards-guidelines/wcag/"
            target="_blank"
          >
            Web Content Accessibility Guidelines (WCAG)
          </a>{" "}
          as a reference point. WCAG is a shared standard for web content
          accessibility for individuals, organizations, and governments.
        </p>
      </section>

      <section>
        {/* function 2: checklist category counts (map callback) */}
        {checklistData.map((category) => {
          const categoryCheckedCount = category.items.filter(
            (item) => checked[item.id],
          ).length;

          // function 2 return
          return (
            <details
              key={category.id}
              open={openCategories[category.id] ?? false}
              onToggle={(event) =>
                categoryToggle(category.id, event.currentTarget.open)
              }
              className="border-t border-b border-gray-200 my-1 cursor-pointer focus-visible:outline-orbit-blue"
            >
              {/* summary */}
              <summary className="flex justify-between py-3 px-3 hover:bg-gray-100">
                <h3 className="font-semibold text-sm">{category.label}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs px-1 py-0.5 rounded-sm bg-gray-300">
                    {categoryCheckedCount} / {category.items.length}
                  </p>
                  <img
                    src={openCategories[category.id] ? chevronUp : chevronDown}
                    alt=""
                    aria-hidden="true"
                    className="w-4 h-4"
                  />
                </div>
              </summary>

              <ul>
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    // adds light green bg when checked, bg hover states
                    className={`flex items-start justify-start gap-2 py-2 px-2 m-2 rounded ${
                      checked[item.id]
                        ? "bg-green-100 hover:bg-green-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      id={item.id}
                      type="checkbox"
                      checked={checked[item.id] ?? false}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 shrink-0 w-4 h-4 cursor-pointer accent-orbit-blue"
                    />
                    <label
                      htmlFor={item.id}
                      // adds line-thru text when checked
                      className={`cursor-pointer text-sm ${
                        checked[item.id] ? "line-through" : ""
                      }`}
                    >
                      {item.label}
                      <a
                        href={item.wcagUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex gap-1 items-center text-xs w-fit px-1 py-0.5 rounded-sm text-blue-600 underline hover:no-underline"
                      >
                        {item.wcag}
                        <img className="w-3 h-3" src={externalLink} alt="" />
                      </a>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </section>

      <div className="flex flex-col gap-5 mx-3 my-3">
        <button
          onClick={resetChecklist}
          className="cursor-pointer px-2 py-1 w-fit bg-orbit-blue text-orbit-white hover:bg-red-800 hover:underline"
        >
          Reset Checklist
        </button>

        {/* A11y Project License Backlink: REQUIRED */}
        <p className="text-xs">
          This checklist is adapted from <strong>The A11y Project</strong>{" "}
          <a
            href="https://a11yproject.com"
            target="_blank"
            className="underline text-blue-600 hover:no-underline"
          >
            (allyproject.com)
          </a>
          , licensed under the Apache License 2.0.
        </p>
      </div>
    </>
  );
};

export default Checklist;
