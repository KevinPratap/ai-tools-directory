import { getAllCategories, getToolsByCategory } from "@/lib/tools";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllCategories().map(cat => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allCats = getAllCategories();
  const cat = allCats.find(c => c.slug === slug);
  if (!cat) notFound();

  const filtered = getToolsByCategory(slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-xs" style={{ color: "var(--fg-subtle)" }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-1">/</span>
        <span style={{ color: "var(--fg-muted)" }}>{cat.name}</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">{cat.name}</h1>
      <p className="mb-8 text-sm" style={{ color: "var(--fg-muted)" }}>
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(tool => (
          <Link key={tool.slug} href={`/tools/${tool.slug}/`}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            className="block rounded-lg p-4 transition-all hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{tool.name}</h3>
                {tool.subtitle && (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    {tool.subtitle}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-xs" style={{ color: "var(--fg-subtle)" }}>
                {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {tool.tags.slice(0, 3).map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
