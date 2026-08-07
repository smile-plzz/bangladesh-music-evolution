import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Bangladesh Music Evolution",
  description:
    "A computational analysis of genre development, global influences, listener communities, and musical ecosystems in Bangladeshi music.",
};

const NAV_LINKS = [
  { href: "/artists", label: "Artists" },
  { href: "/genres", label: "Genres" },
  { href: "/concerts", label: "Concerts" },
  { href: "/network", label: "Network" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        <header className="border-b border-neutral-800 sticky top-0 z-20 bg-neutral-950/90 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              Bangladesh Music Evolution
            </Link>
            <nav className="flex gap-1 sm:gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-800 mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-neutral-500 flex flex-col sm:flex-row gap-2 sm:justify-between">
            <span>
              Data &amp; research from the{" "}
              <a
                className="underline hover:text-neutral-300"
                href="https://github.com/smile-plzz/bangladesh-music-evolution"
                target="_blank"
                rel="noreferrer"
              >
                bangladesh-music-evolution
              </a>{" "}
              repository.
            </span>
            <span>Built with Next.js · Deployed on Vercel</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
