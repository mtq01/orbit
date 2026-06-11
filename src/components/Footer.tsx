import { Info, Globe } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="flex justify-between border-t py-5 px-4 shrink-0">
        <p className="flex gap-2 items-center">
          <Info />
          <span className="text-sm">Orbit v1.0</span>
        </p>
        <Globe />
      </footer>
    </>
  );
};

export default Footer;
