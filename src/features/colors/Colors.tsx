import { useState } from "react";
import { Pipette } from "lucide-react";
import { contrastRatio, wcagResults } from "./Contrast";

// EyeDropper isn't in TS's default lib yet, so declare it
declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

const Colors = () => {
  const [fg, setFg] = useState("#060d20");
  const [bg, setBg] = useState("#fcf8f8");

  const ratio = contrastRatio(fg, bg);
  const results = ratio ? wcagResults(ratio) : null;

  const pickColor = async (set: (v: string) => void) => {
    if (!window.EyeDropper) return;
    try {
      const { sRGBHex } = await new window.EyeDropper().open();
      set(sRGBHex);
    } catch {
      // user pressed Esc — ignore
    }
  };

  const ColorInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-orbit-blue">{label}</label>
      <div className="flex items-center gap-2">
        <span
          className="h-9 w-9 shrink-0 rounded border border-orbit-muted"
          style={{ backgroundColor: value }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 rounded-md border border-orbit-muted px-2 py-1 font-code text-sm"
        />
        {window.EyeDropper && (
          <button
            onClick={() => pickColor(onChange)}
            aria-label={`Sample ${label.toLowerCase()} color from screen`}
            title="Pick a color from your screen"
            className="cursor-pointer rounded-md bg-orbit-blue p-2 text-orbit-white hover:bg-orbit-light-blue"
          >
            <Pipette size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-sm text-orbit-muted">
        Type or paste hex colors below, or use the eyedropper to sample any
        color on your screen.
      </p>

      <ColorInput label="Foreground" value={fg} onChange={setFg} />
      <ColorInput label="Background" value={bg} onChange={setBg} />

      {/* live preview */}
      <div
        className="rounded-lg p-4 text-center"
        style={{ backgroundColor: bg, color: fg }}
      >
        <p className="text-base">Normal text sample</p>
        <p className="text-xl font-semibold">Large text sample</p>
      </div>

      {ratio ? (
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-heading font-semibold text-orbit-blue">
            {ratio.toFixed(2)}:1
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Badge label="AA Normal" pass={results!.aaNormal} />
            <Badge label="AA Large" pass={results!.aaLarge} />
            <Badge label="AAA Normal" pass={results!.aaaNormal} />
            <Badge label="AAA Large" pass={results!.aaaLarge} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-critical">Enter two valid hex colors.</p>
      )}
    </div>
  );
};

const Badge = ({ label, pass }: { label: string; pass: boolean }) => (
  <span
    className={`rounded px-2 py-1 text-center text-xs font-medium text-orbit-white ${
      pass ? "bg-moderate" : "bg-critical"
    }`}
  >
    {label} {pass ? "Pass" : "Fail"}
  </span>
);

export default Colors;
