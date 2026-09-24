"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // The theme only exists in the browser: the inline script above has already
  // put the right class on <html>, so mirror it into state after first paint
  // instead of calling setState during the effect body (which cascades a
  // second render before the first one has painted).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setDark(isDark);
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
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
      <body>
        <header style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
            <Link href="/" style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "-0.02em" }}>AI Tools</Link>
            <nav style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.8125rem" }}>
              <Link href="/" style={{ color: "var(--fg-muted)" }}>Home</Link>
              <button onClick={toggleTheme} style={{ color: "var(--fg-muted)", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "0.8125rem" }}>
                {mounted ? (dark ? "Light" : "Dark") : ""}
              </button>
            </nav>
          </div>
        </header>
        {children}
        <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)", padding: "20px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--fg-subtle)", margin: 0 }}>AI Tools Directory &mdash; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
