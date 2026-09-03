/**
 * Editor setup content — single source of truth for /setup, in the same
 * spirit as content/privacy.ts and content/case-studies: typed data, not JSX
 * scattered through a page component.
 *
 * The shape is deliberately generic (section → labelled groups → named
 * items) because /gear reuses it verbatim from content/gear.ts. Anything
 * that needs a sentence of explanation gets a `note`, not a second field —
 * this is a list of what's installed, not a review of it.
 *
 * Keep this HONEST and current. A setup page that lists an extension the
 * author uninstalled a year ago is the kind of small wrongness a sharp
 * interviewer notices; bump SETUP_LAST_UPDATED whenever the lists change.
 */

export interface SetupItem {
  name: string;
  /** Qualifier shown next to the name, e.g. "occasionally". Lower case. */
  note?: string;
}

export interface SetupGroup {
  label: string;
  items: SetupItem[];
}

export interface SetupSection {
  title: string;
  groups: SetupGroup[];
}

/** Shown under the page title. Update whenever the sections below change. */
export const SETUP_LAST_UPDATED = "3 September 2026";

export const SETUP_SECTIONS: SetupSection[] = [
  {
    title: "Code editors",
    groups: [
      {
        label: "Preferred IDEs",
        items: [
          { name: "VS Code" },
          { name: "Cursor", note: "occasionally" },
        ],
      },
    ],
  },
  {
    title: "Testing",
    groups: [
      {
        label: "API & debugging",
        items: [{ name: "Postman" }, { name: "Thunder Client" }],
      },
    ],
  },
  {
    title: "Editor themes",
    groups: [
      {
        label: "Color themes",
        items: [{ name: "Catppuccin Mocha" }, { name: "Cursor Dark" }],
      },
      {
        label: "Icon packs",
        items: [{ name: "Catppuccin Icons" }, { name: "Mizu Icons" }],
      },
      {
        label: "Product icons",
        items: [{ name: "Fluent Icons" }, { name: "Carbon Icons" }],
      },
    ],
  },
  {
    title: "Extensions",
    groups: [
      {
        label: "Everyday toolkit",
        items: [
          { name: "Auto Import" },
          { name: "Auto Close Tag" },
          { name: "Color Highlight" },
          { name: "CSS Peek" },
          { name: "ES7+ React/Redux Snippets" },
          { name: "HTML CSS Support" },
          { name: "Image Preview" },
          { name: "Live Server" },
          { name: "npm IntelliSense" },
          { name: "Path IntelliSense" },
          { name: "Prettier" },
          { name: "React Component Generator" },
          { name: "Tailwind CSS IntelliSense" },
        ],
      },
    ],
  },
  {
    title: "AI assistants",
    groups: [
      {
        label: "In the editor",
        items: [
          { name: "GitHub Copilot", note: "free plan" },
          { name: "Claude Code" },
        ],
      },
    ],
  },
];
