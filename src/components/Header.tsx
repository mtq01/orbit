import OrbitLogo from "../assets/logos/orbit-logo-white.svg";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-6 shrink-0 border-b bg-orbit-blue  ">
      <img className="w-20" src={OrbitLogo} alt="Orbit" />

      <p className="text-orbit-white text-sm text-center">
        Accessibility <br /> Assistant
      </p>
    </header>
  );
};

export default Header;
