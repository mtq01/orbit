import { useState, useEffect } from "react";
import { checklistData } from "../checklist/checklistData";

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
    // delete the saved data from localStorage
    localStorage.removeItem("orbit-checklist");
  };

  return (
    <>
      <p className="font-bold">Checklist</p>
      <section>
        <div>
          <p>
            {checkedCount} of {totalItems} completed
          </p>
        </div>
        <progress max={totalItems} value={checkedCount}>
          {checkedCount}
        </progress>
      </section>

      {/* checkbox categories */}
      <section>
        {/* checkbox items */}
        {checklistData.map((category) => (
          <details key={category.id} className="border-t border-b py-3 my-1">
            <summary className="flex justify-between px-3">
              <p>{category.label}</p>
              <p>
                1 / 4 <span>Open/Close</span>
              </p>
            </summary>
            <ul>
              {category.items.map((item) => (
                <li className="flex items-start justify-start gap-2 py-2 px-2 m-2">
                  <input
                    type="checkbox"
                    checked={checked[item.id] ?? false}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 shrink-0 w-4 h-4 cursor-pointer accent-orbit-blue"
                  />
                  <label htmlFor={item.id} className="cursor-pointer">
                    {item.label}{" "}
                    <a href={item.wcagUrl} target="_blank">
                      {item.wcag}
                    </a>
                  </label>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </section>

        {/* reset checklist */}
      <button onClick={resetChecklist} className="cursor-pointer">
        Reset All
      </button>
    </>
  );
};

export default Checklist;
