import RadarIcon from "@/assets/icons/radar-scanner.svg";

type PreScanProps = {
  onScan: () => void;
};

const PreScan = ({ onScan }: PreScanProps) => {
  return (
    <section className="justify-center items-center flex flex-col gap-16 h-screen max-w-sm mx-auto text-center px-4">
      <img src={RadarIcon} alt="radar icon" className="radar-icon" />
      <h1 className="font-bold text-2xl max-w-xs tracking-tighter">
        Check this page for accessibility
      </h1>
      <button
        onClick={onScan}
        className="px-4 w-full max-w-[300px] bg-orbit-blue text-orbit-white text-xl font-bold rounded-lg py-3"
      >
        Run Scan
      </button>
    </section>
  );
};

export default PreScan;
