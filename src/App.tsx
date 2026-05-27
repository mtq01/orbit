import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Scanner from "./features/scan/Scanner";
import Colors from "./features/colors/Colors";
import Tools from "./features/tools/Tools";
import Checklist from "./features/colorpicker/Checklist";

// We created a custom Type called tab. it only accepts these strings. anything else will throw an error

import type { Tab } from "./types";

import { useState } from "react";

const App = () => {
  // Create a usestate for the selected Tab - typescript requires that we specify what the state takes
  // <Tab> is the syntax in this case, our custom type - if we were using a string for example, it would be useState<string>("sanner");

  const [activeTab, setActiveTab] = useState<Tab>("scan");

  // Created a handle click funtion that only accepts tab type as a prop. once it receives it, it updates the current state.
  // The syntax is (Prop-name: Type)

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="panel">
      <Nav activeTab={activeTab} onTabClick={handleTabClick} />

      <main>
        {activeTab === "scan" && <Scanner />}
        {activeTab === "tools" && <Tools />}
        {activeTab === "colors" && <Colors />}
        {activeTab === "checklist" && <Checklist />}
      </main>

      <Footer />
    </div>
  );
};

export default App;
