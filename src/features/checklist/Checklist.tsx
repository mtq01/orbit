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



  return <div>Checklist</div>;
};

export default Checklist;
