import type { Metadata } from "next";
import { ContactBlock } from "@/components/sections/ContactBlock";

export const metadata: Metadata = {
  title: "Contact — Abdus Salam",
  description: "Get in touch — WhatsApp, phone, or email.",
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <div className="px-6 md:px-10 pt-28 md:pt-36 text-center">
        <h1 className="text-gradient-accent text-4xl md:text-6xl font-semibold">
          Contact
        </h1>
      </div>
      <ContactBlock />
    </main>
  );
}
