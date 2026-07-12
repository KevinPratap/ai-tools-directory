import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "96px 16px", textAlign: "center" }}>
      <h1 style={{ fontSize: "4rem", fontWeight: 700, letterSpacing: "-0.04em", margin: 0, color: "var(--fg)" }}>404</h1>
      <p style={{ marginTop: 8, fontSize: "0.9375rem", color: "var(--fg-muted)" }}>Tool not found</p>
      <Link href="/" style={{ display: "inline-block", marginTop: 24, fontSize: "0.875rem", fontWeight: 500, color: "var(--fg-muted)" }}>← Back home</Link>
    </main>
  );
}
