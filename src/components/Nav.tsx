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

  // tab order lives here. left to right.
  const tabs: Tab[] = ["scanner", "tools", "colors", "checklist"];

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // which tab are we on right now?
    const currentIndex = tabs.indexOf(activeTab);
    // which tab should we move too? (null = dont move)
    let newIndex: number | null = null;

    if (event.key === "ArrowRight") {
      // go to next tab, wrap to start if at the end
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      // go to previous tab, wrap to end if at the start
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      // jump to the first tab
      newIndex = 0;
    } else if (event.key === "End") {
      // jump to last tab
      newIndex = tabs.length - 1;
    }

    // if event.key is pressed, switch to the new tab
    if (newIndex !== null) {
      // stop page from scrolling
      event.preventDefault();
      const newTab = tabs[newIndex];
      // update which tab is active
      onTabClick(newTab);
      // move keyboard focus here
      document.getElementById(`tab-${newTab}`)?.focus();
    }
  };

  return (
    <nav aria-label="Main Navigation">
      {/* role tells screen readers this is a group of tabs */}
      <div
        role="tablist"
        aria-label="Orbit Tab Sections"
        className="flex gap-1 px-4 py-2 border-b justify-between"
        onKeyDown={handleKeyDown}
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
          className={activeTab === "scanner" ? "active" : "nav-link"}
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
          className={activeTab === "tools" ? "active" : "nav-link"}
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
          className={activeTab === "colors" ? "active" : "nav-link"}
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
          className={activeTab === "checklist" ? "active" : "nav-link"}
        >
          Checklist
        </button>
      </div>
    </nav>
  );
};

export default Nav;
