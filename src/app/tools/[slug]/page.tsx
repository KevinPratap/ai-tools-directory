import { tools, getToolBySlug } from "@/lib/tools";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = tools
    .filter(t => t.slug !== tool.slug && (t.category === tool.category || t.tags.some(tag => tool.tags.includes(tag))))
    .slice(0, 6);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 24, fontSize: "0.8125rem", color: "var(--fg-subtle)" }}>
        <Link href="/" style={{}}>Home</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--fg-muted)" }}>{tool.category}</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--fg-muted)" }}>{tool.name}</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>{tool.name}</h1>
            {tool.subtitle && (
              <p style={{ margin: "6px 0 0", fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--fg-muted)" }}>{tool.subtitle}</p>
            )}
          </div>
          <span className={`price-badge ${tool.pricing.toLowerCase()}`}>
            {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
          </span>
        </div>

        {tool.url && (
          <a href={tool.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "10px 20px", borderRadius: 8, fontSize: "0.875rem", fontWeight: 500, background: "var(--fg)", color: "var(--bg)" }}>
            Visit Tool →
          </a>
        )}
      </div>

      {/* Description */}
      <div style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}>
        {tool.full_description ? (
          <p style={{ margin: 0 }}>{tool.full_description}</p>
        ) : (
          <p style={{ margin: 0, color: "var(--fg-muted)" }}>{tool.description}</p>
        )}
      </div>

      {/* Meta */}
      <div style={{ marginTop: 32, padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: "0.875rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fg-subtle)", marginBottom: 2 }}>Category</div>
            <div>{tool.category}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fg-subtle)", marginBottom: 2 }}>Pricing</div>
            <div>{tool.pricing}</div>
          </div>
          {tool.url && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fg-subtle)", marginBottom: 2 }}>Website</div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                {tool.url.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {tool.added && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fg-subtle)", marginBottom: 2 }}>Added</div>
              <div>{tool.added}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 className="section-title">Tags</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tool.tags.map(tag => <span key={tag} className="tag-chip">#{tag}</span>)}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 className="section-title">Related Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {related.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="tool-card">
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</h3>
                {t.subtitle && (
                  <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--fg-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {t.subtitle}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
