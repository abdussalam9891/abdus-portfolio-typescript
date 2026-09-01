import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { EntrySequence } from "@/components/entry/EntrySequence";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdus Salam — Full-Stack Developer",
  description:
    "Full-stack developer based in New Delhi, India. I build and ship production sites and apps for businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <EntrySequence />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
