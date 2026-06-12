import RadarIcon from "@/assets/icons/radar-scanner.svg";

type PreScanProps = {
  onScan: () => void;
};

const PreScan = ({ onScan }: PreScanProps) => {
  return (
    <section
      className="justify-center items-center flex flex-col gap-16 h-full max-w-sm mx-auto text-center px-4"
      aria-label="Pre-scan instructions"
    >
      {/* https://www.w3.org/WAI/tutorials/images/decorative/ Im learning decorative images dont need alt text "
      "In these cases, a null (empty) alt text should be provided (alt="") so that they can be ignored by assistive technologies, such as screen readers" */}

      <img src={RadarIcon} alt="" className="radar-icon" />
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
