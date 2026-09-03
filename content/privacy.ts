/**
 * Privacy policy content — single source of truth for /privacy, in the same
 * spirit as content/case-studies: typed data, not JSX scattered through a
 * page component. If this ever moves behind a CMS, the page keeps rendering
 * as long as the shape below is what comes back.
 *
 * Keep this HONEST. Every claim here is checkable against the code:
 * no analytics package is installed, no cookies are set, the only browser
 * storage is the two sessionStorage keys named in section 03, and the
 * contact form's only destination is the Resend call in
 * app/api/contact/route.ts. If any of that changes, this file changes in
 * the same commit — a policy that describes a site you no longer run is
 * worse than no policy.
 */

export type PolicyBlock =
  | { kind: "text"; lead?: string; body: string }
  | { kind: "list"; items: string[] };

export interface PolicySection {
  title: string;
  blocks: PolicyBlock[];
}

/** Shown under the page title. Update whenever the sections below change. */
export const PRIVACY_LAST_UPDATED = "3 September 2026";

export const PRIVACY_SECTIONS: PolicySection[] = [
  {
    title: "What this policy covers",
    blocks: [
      {
        kind: "text",
        body:
          "This policy explains what happens to information when you browse this portfolio, send a message through the contact form, or change a site preference such as the sound toggle. It covers this site only — not the external sites linked from it, including GitHub, LinkedIn, Instagram, X, and the live client projects shown in the work section, each of which has its own policy.",
      },
    ],
  },
  {
    title: "Information collected",
    blocks: [
      {
        kind: "text",
        lead: "Information you send.",
        body:
          "If you use the contact form, the first name, last name, email address, and message you type are delivered to Abdus Salam's inbox so he can reply. That is the whole payload — there is no hidden field, no marketing list, and the site has no database, so nothing you send is stored on the site itself.",
      },
      {
        kind: "text",
        lead: "Information you send another way.",
        body:
          "The WhatsApp, phone, and email links elsewhere on the site simply hand off to those apps. Anything you send that way is governed by whichever service you used to send it.",
      },
      {
        kind: "text",
        lead: "Usage information.",
        body:
          "There is no analytics on this site. No Google Analytics, no tracking pixels, no advertising or session-recording scripts, and no visitor profile of any kind. The hosting provider keeps ordinary server request logs, as any web host does, and those are used only to keep the site running and secure.",
      },
    ],
  },
  {
    title: "Cookies and browser storage",
    blocks: [
      {
        kind: "text",
        body:
          "This site sets no cookies. It does use a small amount of browser session storage, which lives on your device, is never transmitted to the site, and is discarded when you close the tab:",
      },
      {
        kind: "list",
        items: [
          "entry-sequence-played — records that you have already seen the opening animation, so it does not replay on every page you visit.",
          "ambient-audio-muted — records that you muted the background music, so it stays muted for the rest of your visit.",
        ],
      },
      {
        kind: "text",
        body:
          "Because both are session storage rather than cookies or local storage, they expire on their own when the tab closes. Nothing here is used to identify or track you.",
      },
    ],
  },
  {
    title: "Fonts, media, and third parties",
    blocks: [
      {
        kind: "text",
        lead: "Fonts.",
        body:
          "Typefaces are downloaded at build time and served from this site, so your browser makes no request to Google Fonts and no third party sees your IP address for typography.",
      },
      {
        kind: "text",
        lead: "Images.",
        body:
          "Project screenshots and other imagery are served from this site's own assets.",
      },
      {
        kind: "text",
        lead: "Background audio.",
        body:
          "The ambient track streams from a media host. It is requested lazily — only after you interact with the page, and never if you have muted the site — so a visit where you never click nor press a key does not fetch it at all.",
      },
      {
        kind: "text",
        lead: "GitHub activity.",
        body:
          "The contribution graph on the About page is fetched by this site's server from a public GitHub mirror and cached. Your browser never contacts that service, and nothing about you is sent to it.",
      },
      {
        kind: "text",
        lead: "Service providers.",
        body:
          "The site runs on Vercel, and the contact form is delivered through Resend. Both process data only to perform those functions.",
      },
    ],
  },
  {
    title: "How information is used",
    blocks: [
      {
        kind: "list",
        items: [
          "To read and reply to messages you send through the contact form.",
          "To remember, for the length of your visit, that you have seen the intro animation and whether you muted the sound.",
          "To keep the site available, diagnose technical problems, and protect it from abuse.",
        ],
      },
      {
        kind: "text",
        body:
          "Your information is not used to profile you, to target advertising, or to build a mailing list.",
      },
    ],
  },
  {
    title: "Sharing and retention",
    blocks: [
      {
        kind: "text",
        body:
          "Personal information is never sold or traded. It is shared only with the service providers listed above, which are needed to host the site and deliver contact-form messages, or where disclosure is required by law.",
      },
      {
        kind: "text",
        body:
          "Contact messages arrive as email and are kept for as long as is reasonably useful to answer you and to maintain a record of the conversation, then deleted. There is no analytics data to retain, because none is collected.",
      },
    ],
  },
  {
    title: "Your choices",
    blocks: [
      {
        kind: "list",
        items: [
          "Mute the background music from the control in the corner of any page. The site also honours your operating system's reduced-motion setting and drops the animation accordingly.",
          "Clear browser storage, or simply close the tab, to reset the sound and intro preferences described above.",
          "Choose not to use the contact form — WhatsApp, phone, and email reach the same person directly.",
          "Depending on where you live, you may have the right to request access to, correction of, or deletion of information you have sent. Ask through any contact method on the site and it will be honoured.",
        ],
      },
    ],
  },
  {
    title: "Policy updates",
    blocks: [
      {
        kind: "text",
        body:
          "This policy is updated whenever the site's behaviour changes — a new tool, a new form field, or anything that touches your data. The date at the top of this page reflects the most recent revision.",
      },
    ],
  },
];
