const Header = () => {
  return (
    <>
      <header className="flex items-center justify-between px-4 py-5 shrink-0 border-b bg-orbit-blue">
        <img
          className="w-16"
          src="../src/assets/logos/orbit-logo-white.svg"
          alt="Orbit"
        />

        <p className="text-orbit-white text-sm tracking-wider font-extralight">Accessibility Assistant</p>
      </header>
    </>
  );
};

export default Header;
