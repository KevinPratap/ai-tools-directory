import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>Tool not found</p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium hover:underline" style={{ color: "var(--fg-muted)" }}>
        &larr; Back home
      </Link>
    </main>
  );
}
