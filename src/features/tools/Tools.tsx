import { useState } from "react";
import { HIGHLIGHT_MESSAGE, HIGH_CONTRAST_MESSAGE } from "../../types";

const Tools = () => {
  const [isHighlightOn, setIsHighlightOn] = useState(false);
  const [isHighContrastOn, setIsHighContrastOn] = useState(false);

  const handleHighlight = async () => {
    const [tab] = await chrome.tabs.query({
      lastFocusedWindow: true,
      active: true,
    });
    if (!tab?.id) return;
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    await chrome.tabs.sendMessage(tab.id, HIGHLIGHT_MESSAGE);
  };

  const handleHighContrast = async () => {
    const [tab] = await chrome.tabs.query({
      lastFocusedWindow: true,
      active: true,
    });
    if (!tab?.id) return;
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    await chrome.tabs.sendMessage(tab.id, HIGH_CONTRAST_MESSAGE);
  };

  return (
    <div>
      <button
        onClick={() => {
          setIsHighlightOn(!isHighlightOn);
          handleHighlight();
        }}
      >
        {isHighlightOn ? "Stop See the Order" : "See the Order"}
      </button>

      <button
        onClick={() => {
          setIsHighContrastOn(!isHighContrastOn);
          handleHighContrast();
        }}
      >
        {isHighContrastOn ? "Turn Off High Contrast" : "Turn On High Contrast"}
      </button>
    </div>
  );
};

export default Tools;
