/* 
  - Data sourced from The A11Y Project (https://www.a11yproject.com/checklist/)
  - Licensed under APLv2 (https://www.apache.org/licenses/LICENSE-2.0)
*/



// interfaces describe the shape of an object so TypeScript knows what to expect

// single checklist item (id, label, wcag reference)
interface ChecklistItem {
  id: string;
  label: string;
  wcag: string;
  wcagUrl: string;
}

// one accordion section (id, heading label, array of checklistItem objects)
interface ChecklistCategory {
  id: string;
  label: string;
  items: ChecklistItem[];
}

// typed array of checklist categories. each item must match the ChecklistCategory shape
export const checklistData: ChecklistCategory[] = [
  {
    id: "content",
    label: "Content",
    items: [
      {
        id: "content-1",
        label: "Use plain language and avoid figures of speech, idioms, and complicated metaphors.",
        wcag: "3.1.5",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html",
      },
      {
        id: "content-2",
        label: "Make sure that button, a, and label element content is unique and descriptive.",
        wcag: "1.3.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
      },
      {
        id: "content-3",
        label: "Use left-aligned text for left-to-right (LTR) languages, and right-aligned text for right-to-left (RTL) languages.",
        wcag: "1.4.8",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html",
      },
    ],
  },
  {
    id: "global-code",
    label: "Global Code",
    items: [
      {
        id: "global-1",
        label: "Validate your HTML.",
        wcag: "4.1.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/parsing.html",
      },
      {
        id: "global-2",
        label: "Use a lang attribute on the html element.",
        wcag: "3.1.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
      },
      {
        id: "global-3",
        label: "Provide a unique title for each page or view.",
        wcag: "2.4.2",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
      },
      {
        id: "global-4",
        label: "Ensure that viewport zoom is not disabled.",
        wcag: "1.4.4",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html",
      },
      {
        id: "global-5",
        label: "Use landmark elements to indicate important content regions.",
        wcag: "4.1.2",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
      },
      {
        id: "global-6",
        label: "Ensure a linear content flow.",
        wcag: "2.4.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
      },
      {
        id: "global-7",
        label: "Avoid using the autofocus attribute.",
        wcag: "2.4.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
      },
      {
        id: "global-8",
        label: "Remove title attribute tooltips.",
        wcag: "4.1.2",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
      },
    ],
  },
  {
    id: "keyboard",
    label: "Keyboard",
    items: [
      {
        id: "keyboard-1",
        label: "Make sure there is a visible focus style for interactive elements that are navigated to via keyboard input.",
        wcag: "2.4.7",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
      },
      {
        id: "keyboard-2",
        label: "Check to see that keyboard focus order matches the visual layout.",
        wcag: "1.3.2",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html",
      },
      {
        id: "keyboard-3",
        label: "Remove invisible focusable elements.",
        wcag: "2.4.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
      },
    ],
  },
  {
    id: "images",
    label: "Images",
    items: [
      {
        id: "images-1",
        label: "Make sure that all img elements have an alt attribute.",
        wcag: "1.1.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
      },
      {
        id: "images-2",
        label: "Make sure that decorative images use null alt (empty) attribute values.",
        wcag: "1.1.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
      },
      {
        id: "images-3",
        label: "Provide a text alternative for complex images such as charts, graphs, and maps.",
        wcag: "1.1.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
      },
      {
        id: "images-4",
        label: "For images containing text, make sure the alt description includes the image's text.",
        wcag: "1.1.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
      },
    ],
  },
  {
    id: "controls",
    label: "Controls",
    items: [
      {
        id: "controls-1",
        label: "Use the a element for links.",
        wcag: "1.3.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
      },
      {
        id: "controls-2",
        label: "Ensure that links are recognizable as links.",
        wcag: "1.4.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
      },
      {
        id: "controls-3",
        label: "Ensure that controls have :focus states.",
        wcag: "2.4.7",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
      },
      {
        id: "controls-4",
        label: "Use the button element for buttons.",
        wcag: "1.3.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
      },
      {
        id: "controls-5",
        label: "Provide a skip link and make sure that it is visible when focused.",
        wcag: "2.4.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
      },
      {
        id: "controls-6",
        label: "Identify links that open in a new tab or window.",
        wcag: "G201",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Techniques/general/G201",
      },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    items: [
      {
        id: "forms-1",
        label: "All inputs in a form are associated with a corresponding label element.",
        wcag: "3.2.2",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html",
      },
      {
        id: "forms-2",
        label: "Use fieldset and legend elements where appropriate.",
        wcag: "1.3.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
      },
      {
        id: "forms-3",
        label: "Inputs use autocomplete where appropriate.",
        wcag: "1.3.5",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html",
      },
      {
        id: "forms-4",
        label: "Make sure that form input errors are displayed in list above the form after submission.",
        wcag: "3.3.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
      },
      {
        id: "forms-5",
        label: "Associate input error messaging with the input it corresponds to.",
        wcag: "3.3.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
      },
      {
        id: "forms-6",
        label: "Make sure that error, warning, and success states are not visually communicated by just color.",
        wcag: "1.4.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
      },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    items: [
      {
        id: "appearance-1",
        label: "Check your content in specialized browsing modes like Windows High Contrast or Inverted Colors.",
        wcag: "1.4.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
      },
      {
        id: "appearance-2",
        label: "Increase text size to 200%. Is the content still readable?",
        wcag: "1.4.4",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html",
      },
      {
        id: "appearance-3",
        label: "Double-check that good proximity between content is maintained.",
        wcag: "1.3.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html",
      },
      {
        id: "appearance-4",
        label: "Make sure color isn't the only way information is conveyed.",
        wcag: "1.4.1",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
      },
      {
        id: "appearance-5",
        label: "Make sure instructions are not visual or audio-only.",
        wcag: "1.3.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html",
      },
      {
        id: "appearance-6",
        label: "Use a simple, straightforward, and consistent layout.",
        wcag: "1.4.10",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html",
      },
    ],
  },
  {
    id: "color-contrast",
    label: "Color Contrast",
    items: [
      {
        id: "color-contrast-1",
        label: "Check the contrast for all normal-sized text. Level AA requires a contrast ratio of 4.5:1.",
        wcag: "1.4.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
      },
      {
        id: "color-contrast-2",
        label: "Check the contrast for all large-sized text. Level AA requires a contrast ratio of 3:1.",
        wcag: "1.4.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
      },
      {
        id: "color-contrast-3",
        label: "Check the contrast for all icons. Level AA requires a contrast ratio of 3.0:1.",
        wcag: "1.4.11",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
      },
      {
        id: "color-contrast-4",
        label: "Check the contrast of borders for input elements (text input, radio buttons, checkboxes, etc.).",
        wcag: "1.4.11",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
      },
      {
        id: "color-contrast-5",
        label: "Check text that overlaps images or video.",
        wcag: "1.4.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
      },
      {
        id: "color-contrast-6",
        label: "Check custom ::selection colors for sufficient contrast.",
        wcag: "1.4.3",
        wcagUrl: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
      },
    ],
  },
];
