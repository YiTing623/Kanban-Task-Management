import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kanban",
  description: "Next.js Kanban Task Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="font-semibold">Kanban</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link className="hover:underline" href="/">Board</Link>
              <Link className="hover:underline" href="/tasks">Backlog</Link>
            </nav>
          </div>
        </header>

        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
