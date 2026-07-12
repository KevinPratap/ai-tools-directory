"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',t==='dark')})()`
        }} />
      </head>
      <body className="min-h-screen antialiased">
        <header style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">AI Tools</Link>
            <nav className="flex items-center gap-5 text-xs font-medium">
              <Link href="/" style={{ color: "var(--fg-muted)" }} className="hover:underline">Home</Link>
              <button onClick={toggleTheme} style={{ color: "var(--fg-muted)" }} className="hover:underline text-xs">
                {dark ? "Light" : "Dark"}
              </button>
            </nav>
          </div>
        </header>
        {children}
        <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }} className="py-8 text-center text-xs">
          <p style={{ color: "var(--fg-subtle)" }}>AI Tools Directory &mdash; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
