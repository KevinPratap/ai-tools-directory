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
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 16px" }}>
      <nav style={{ marginBottom: 24, fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
        <Link href="/">Home</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--fg-muted)" }}>{cat.name}</span>
      </nav>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>{cat.name}</h1>
      <p style={{ margin: "6px 0 32px", fontSize: "0.9375rem", color: "var(--fg-muted)" }}>
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {filtered.map(tool => (
          <Link key={tool.slug} href={`/tools/${tool.slug}/`} className="tool-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tool.name}</h3>
                {tool.subtitle && (
                  <p style={{ margin: "3px 0 0", fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--fg-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {tool.subtitle}
                  </p>
                )}
              </div>
              <span className={`price-badge ${tool.pricing.toLowerCase()}`}>
                {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"}
              </span>
            </div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
              {tool.tags.slice(0, 3).map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
