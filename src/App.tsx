// Components
import Footer from "./components/Footer";
import Header from "./components/Header";
import Scanner from "./features/scanner/Scanner";


const App = () => {


  return (
    // full viewport height for scanner
    <div className="flex flex-col overflow-hidden h-dvh">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <Scanner />
      </main>

      <Footer />
    </div>
  );
};

export default App;
