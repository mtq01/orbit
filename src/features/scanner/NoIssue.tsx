import saturn from "@/assets/logos/saturn.svg";

type PreScanProps = {
  onScan: () => void;
};

const PreScan = ({ onScan }: PreScanProps) => {
  return (
    <>
      <div className="justify-center items-center flex flex-col gap-16 h-screen max-w-sm mx-auto text-center px-4">
        <h1 className="font-bold text-2xl max-w-xs tracking-tighter">
          No issues Found!
        </h1>
        <img src={saturn} alt="saturn logo" className="w-24 h-24" />
        <p className="max-w-xs font-medium tracking-tigther">
          Automated scans can't catch everything. Manual testing users uncovers
          what automation misses.
        </p>
        <button
          onClick={onScan}
          className="px-4 w-full max-w-[300px] bg-orbit-blue text-orbit-white text-xl font-bold rounded-lg py-3"
        >
          Run A New Scan
        </button>
        <p className="max-w-xs font-medium tracking-tigther">
          Every improvement you make creates a better experience for everyone.
        </p>
      </div>
    </>
  );
};

export default PreScan;
