// External libraries
import { useState } from "react";

// Types
// We created a custom Type called tab. it only accepts these strings. anything else will throw an error
import type { Tab } from "./types";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScannerTest from "./features/scanner/ScannerTest";
// import Scanner from "./features/scanner/Scanner";
import Colors from "./features/colors/Colors";
import Tools from "./features/tools/Tools";
import Checklist from "./features/checklist/Checklist";

const App = () => {
  // Create a usestate for the selected Tab - typescript requires that we specify what the state takes
  // <Tab> is the syntax in this case, our custom type - if we were using a string for example, it would be useState<string>("sanner");

  const [activeTab, setActiveTab] = useState<Tab>("scanner");

  // Created a handle click funtion that only accepts tab type as a prop. once it receives it, it updates the current state.
  // The syntax is (Prop-name: Type)

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    // full viewport height for scanner
    <div className="flex flex-col overflow-hidden h-dvh">
      <Header />

      {/* nav can be repurposed for Filters */}
      <Nav activeTab={activeTab} onTabClick={handleTabClick} />

      <main
        // ID, ROLE, and ARIA-LABELLEDBY should be moved to the FILTERS container when its built ---->>> MAHTAB
        // dynamically sets the panels ID based on the active tab.
        id={`panel-$activeTab}`}
        // tells screen readers, 'this is the content area associated with the active tab'
        role="tabpanel"
        // points back to the active tab btn by its ID (used to announce the panels name, ex "Scanner Tab Panel")
        aria-labelledby={`tab-${activeTab}`}
        className="flex-1 overflow-y-auto"
      >
        {/* && = only render this component if the condition on the left is true */}
        {activeTab === "scanner" && <ScannerTest />}
        {activeTab === "tools" && <Tools />}
        {activeTab === "colors" && <Colors />}
        {activeTab === "checklist" && <Checklist />}
      </main>

      <Footer />
    </div>
  );
};

export default App;
