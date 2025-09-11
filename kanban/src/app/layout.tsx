import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { sans, serif } from "./fonts";

export const metadata: Metadata = {
  title: "Kanban",
  description: "Next.js Kanban Task Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans">
        <header className="sticky top-0 z-50 bg-gradient-to-b from-sand/60 to-transparent backdrop-blur supports-[backdrop-filter]:bg-sand/50">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="font-serif text-2xl tracking-tight text-cocoa">
              Kanban
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link className="btn btn-ghost" href="/">Board</Link>
              <Link className="btn btn-ghost" href="/tasks">Backlog</Link>
            </nav>
          </div>
        </header>

        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
