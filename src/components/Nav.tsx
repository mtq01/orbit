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
    <nav aria-label="Main Navigation">
      {/* role tells screen readers this is a group of tabs */}
      <div
        role="tablist"
        aria-label="Orbit Tab Sections"
        className="flex gap-1 px-4 py-2 border-b"
      >
      <button
        // each btn is announced as a tab, not just a button
        role="tab"
        // announces which tab is currently active
        aria-selected={activeTab === "scanner"}
        // links each tab to its content panel by ID
        aria-controls="panel-scanner"
        // lets the panel reference back with aria-labelledby
        id="tab-scanner"
        // only the active tab is in the natural tab order, arrow keys do the rest
        tabIndex={activeTab === "scanner" ? 0 : -1}
        onClick={() => onTabClick("scanner")}
        className={activeTab === "scanner" ? "active" : ""}
      >
        Scan
      </button>

      <button
        role="tab"
        aria-selected={activeTab === "tools"}
        aria-controls="panel-tools"
        id="tab-tools"
        tabIndex={activeTab === "tools" ? 0 : -1}
        onClick={() => onTabClick("tools")}
        className={activeTab === "tools" ? "active" : ""}
      >
        Tools
      </button>

      <button
        role="tab"
        aria-selected={activeTab === "colors"}
        aria-controls="panel-colors"
        id="tab-colors"
        tabIndex={activeTab === "colors" ? 0 : -1}
        onClick={() => onTabClick("colors")}
        className={activeTab === "colors" ? "active" : ""}
      >
        Colors
      </button>

      <button
        role="tab"
        aria-selected={activeTab === "checklist"}
        aria-controls="panel-checklist"
        id="tab-checklist"
        tabIndex={activeTab === "checklist" ? 0 : -1}
        onClick={() => onTabClick("checklist")}
        className={activeTab === "checklist" ? "active" : ""}
      >
        Checklist
      </button>
      </div>
    </nav>
  );
};

export default Nav;
