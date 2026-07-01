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


  return <div>Checklist</div>;
};

export default Checklist;
