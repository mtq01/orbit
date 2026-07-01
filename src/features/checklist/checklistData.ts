// interfaces describe the shape of an object so TypeScript knows what to expect

// single checklist item (id, label, wcag reference)
interface ChecklistItem {
  id: string;
  label: string;
  // wcag? means optional, only show the tag when it exists (documentation and user testing have no wcag reference)
  wcag?: string;
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
    id: "keyboard-navigation",
    label: "Keyboard Navigation",
    items: [
      {
        id: "keyboard-1",
        label:
          "Unplug your mouse. Try to use the whole page with only Tab, Enter, Space, and arrow keys.",
        wcag: "2.1.1",
      },
      {
        id: "keyboard-2",
        label: "Every link, button, input abd modal works with keyboard only.",
        wcag: "2.1.1",
      },
      {
        id: "keyboard-3",
        label:
          "You can always Tab away from any part of the page. No dead ends.",
        wcag: "2.1.2",
      },
      {
        id: "keyboard-4",
        label: "After closing a modal, focus goes back to where you were",
        wcag: "2.4.3",
      },
      {
        id: "keyboard-5",
        label:
          "Tab order follows the reading order of the page. No unexpected jumps.",
        wcag: "2.4.3",
      },
    ],
  },
  {
    id: "screen-reader",
    label: "Screen Reader",
    items: [
      {
        id: "screen-reader-1",
        label: "Test with VoiceOver (Mac: Cmd+F5) or NVDA (Windows, free). Try navigating by headings and links.",
        wcag: "4.1.2",
      },
      {
        id: "screen-reader-2",
        label: "Page title is announced correctly when the page loads.",
        wcag: "2.4.2",
      },
      {
        id: "screen-reader-3",
        label: "All images have alt text that describes what they mean, not just what they look like.",
        wcag: "1.1.1",
      },
      {
        id: "screen-reader-4",
        label: "Form fields say their name and type out loud when focused.",
        wcag: "1.3.1",
      },
      {
        id: "screen-reader-5",
        label: "New content like errors and success messages is read out loud automatically.",
        wcag: "4.1.3",
      },
      {
        id: "screen-reader-6",
        label: "Modals are announced correctly. Focus stays inside while the modal is open.",
        wcag: "4.1.2",
      },
    ],
  },
  {
  id: "visual-cognitive",
  label: "Visual & Cognitive",
  items: [
    {
      id: "visual-1",
      label: "Zoom to 200% (Cmd/Ctrl +). All content is still readable with no overlap.",
      wcag: "1.4.4"
    },
    {
      id: "visual-2",
      label: "Zoom to 400%. Content reflows to a single column with no horizontal scrolling needed.",
      wcag: "1.4.10"
    },
    {
      id: "visual-3",
      label: "All error messages explain the problem in words. Not just a red border.",
      wcag: "3.3.1"
    },
    {
      id: "visual-4",
      label: "Instructions don't rely on color or position alone. Avoid saying 'click the green button.'",
      wcag: "1.3.3"
    },
    {
      id: "visual-5",
      label: "Animation can be paused or stopped. Test with the Reduce Motion setting on your OS.",
      wcag: "2.3.3"
    },
  ]
},
  {
    id: "user-testing",
    label: "User Testing",
    items: [
      {
        id: "user-testing-1",
        label: "Someone who uses assistive technology has tested the main user flow.",
      },
      {
        id: "user-testing-2",
        label: "Someone with low vision has tested the page at their preferred zoom level.",
      },
      {
        id: "user-testing-3",
        label: "A disabled user has completed the main flows like checkout and sign-up.",
      },
    ],
  },
  {
    id: "documentation",
    label: "Documentation",
    items: [
      {
        id: "documentation-1",
        label: "An Accessibility Statement is in the footer with a contact email for users who need help.",
      },{
        id: "documentation-2",
        label: "An ACR or VPAT has been made for enterprise or government clients.",
      },{
        id: "documentation-3",
        label: "Known issues are written down with fix dates. Nothing is silently ignored.",
      },
    ],
  },
];
