import type { Tab } from "../types";

// Create nav prop types to let typescript know what type of prop the nav should accept

type NavProps = {
  //tab is just a type that only accepts certain string

  activeTab: Tab;

  // onTabClick is just the funtion we passed down. Its a function that updates the use state on the "app" Page.
  // all this means that the other prop we should accept is a function that takes the "tab type" as a prop, and returns nothing.

  onTabClick: (tab: Tab) => void;
};

// specify what props the nav should take
// In other words, // must have: a Tab // must have: that function

const Nav = ({ activeTab, onTabClick }: NavProps) => {
  return (
    <nav>
      {/*Note: No styles right now */}
      <button
        onClick={() => onTabClick("scanner")}
        className={activeTab === "scanner" ? "active" : ""}
      >
        Scan
      </button>

      <button
        onClick={() => onTabClick("tools")}
        className={activeTab === "tools" ? "active" : ""}
      >
        Tools
      </button>

      <button
        onClick={() => onTabClick("colors")}
        className={activeTab === "colors" ? "active" : ""}
      >
        Colors
      </button>

      <button
        onClick={() => onTabClick("checklist")}
        className={activeTab === "checklist" ? "active" : ""}
      >
        Checklist
      </button>
    </nav>
  );
};

export default Nav;
