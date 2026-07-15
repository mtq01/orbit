import { useState } from "react";
import { HIGHLIGHT_MESSAGE, CLEAR_HIGHLIGHT_MESSAGE } from "../../types";
import type { HighlightResponse } from "../../types";

const Tools = () => {
  const [isHighContrastOn, setIsHighContrastOn] = useState(false);
  const [showOrderResults, setShowOrderResults] = useState(false);
  const [stopCount, setStopCount] = useState(0);

  const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
      lastFocusedWindow: true,
      active: true,
    });
    return tab;
  };

  const handleSeeOrder = async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    chrome.tabs.connect(tab.id, { name: "orbit-panel" });
    const response = (await chrome.tabs.sendMessage(
      tab.id,
      HIGHLIGHT_MESSAGE,
    )) as HighlightResponse;

    if (response?.success) {
      setStopCount(response.count ?? 0);
      setShowOrderResults(true);
    }
  };

  const handleClear = async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    await chrome.tabs.sendMessage(tab.id, CLEAR_HIGHLIGHT_MESSAGE);
    setShowOrderResults(false);
    setStopCount(0);
  };

  const handleHighContrast = async (on: boolean) => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    chrome.tabs.connect(tab.id, { name: "orbit-panel" });
    await chrome.tabs.sendMessage(tab.id, { type: "RUN_HIGH_CONTRAST", on });
  };

  if (showOrderResults) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="rounded-lg bg-orbit-light-blue px-4 py-3 text-orbit-white">
          <p className="text-2xl font-heading font-semibold">{stopCount}</p>
          <p className="text-sm text-orbit-white/80">keyboard stops found</p>
        </div>

        <button
          onClick={handleClear}
          className="rounded-md bg-orbit-blue px-4 py-2 text-sm font-medium text-orbit-white hover:bg-orbit-light-blue"
        >
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 font-body">
      <button
        onClick={handleSeeOrder}
        className="flex w-full flex-col items-start gap-1 rounded-md bg-orbit-blue px-4 py-3 text-left text-orbit-white hover:bg-orbit-light-blue"
      >
        <span className="text-ml">See The Tab Order</span>
        <span className="text-sm">
          Number every keyboard stop and check the sequence.
        </span>
      </button>
      <button
        onClick={() => {
          const next = !isHighContrastOn;
          setIsHighContrastOn(next);
          handleHighContrast(next);
        }}
        className={`flex w-full flex-col items-start gap-1 rounded-md px-4 py-3 text-left text-orbit-white ${
          isHighContrastOn
            ? "bg-orbit-muted hover:bg-orbit-blue"
            : "bg-orbit-blue hover:bg-orbit-light-blue"
        }`}
      >
        <span className="text-ml">
          {isHighContrastOn
            ? "Turn Off High Contrast"
            : "Turn On High Contrast"}
        </span>
        <span className="text-sm">
          Some users rely on high contrast mode. Turn this on and verify
          everything is still readable.
        </span>
      </button>
    </div>
  );
};

export default Tools;
