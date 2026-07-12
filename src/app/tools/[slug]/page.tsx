import { tools, getToolBySlug, CAREER_CLUSTERS } from "@/lib/tools";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Favicon, ScreenshotBanner } from "./tool-components";

export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getProfessionClusters(professions: string[]): string[] {
  const clusters: string[] = [];
  for (const [cluster, profs] of Object.entries(CAREER_CLUSTERS)) {
    if (professions.some(p => profs.includes(p))) {
      clusters.push(cluster);
    }
  }
  return clusters;
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const domain = getDomain(tool.url);
  const related = tools
    .filter(t => t.slug !== tool.slug && (t.category === tool.category || t.tags.some(tag => tool.tags.includes(tag))))
    .slice(0, 6);

  const professionClusters = tool.professions?.length ? getProfessionClusters(tool.professions) : [];

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px" }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 24, fontSize: "0.8125rem", color: "var(--fg-subtle)", display: "flex", alignItems: "center", gap: 6 }}>
        <Link href="/" style={{ color: "var(--fg-muted)" }}>Home</Link>
        <span>/</span>
        <Link href={`/categories/${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`} style={{ color: "var(--fg-muted)" }}>
          {tool.category}
        </Link>
        <span>/</span>
        <span>{tool.name}</span>
      </nav>

      {/* Hero Card */}
      <div style={{
        borderRadius: 14, border: "1px solid var(--border)",
        background: "var(--bg-card)", overflow: "hidden",
        marginBottom: 24,
      }}>
        {/* Screenshot / visual banner */}
        <div style={{
          height: 180,
          background: `linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-hover) 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {domain ? (
            <ScreenshotBanner url={tool.url} name={tool.name} />
          ) : (
            <span style={{ fontSize: "3rem", fontWeight: 700, color: "var(--fg-subtle)", opacity: 0.3 }}>
              {tool.name.charAt(0).toUpperCase()}
            </span>
          )}
          {/* Pricing badge overlay */}
          <span className={`price-badge ${tool.pricing.toLowerCase()}`} style={{ position: "absolute", top: 12, right: 12 }}>
            {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
          </span>
        </div>

        {/* Tool info */}
        <div style={{ padding: "16px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {domain && <Favicon domain={domain} name={tool.name} />}
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
                {tool.name}
              </h1>
              {tool.subtitle && (
                <p style={{ margin: "2px 0 0", fontSize: "0.875rem", color: "var(--fg-muted)" }}>
                  {tool.subtitle}
                </p>
              )}
            </div>
          </div>

          {tool.url && (
            <a href={tool.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 14, padding: "8px 18px", borderRadius: 8,
                fontSize: "0.875rem", fontWeight: 500,
                background: "var(--fg)", color: "var(--bg)",
              }}>
              Visit Website →
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--fg)" }}>
        <p style={{ margin: 0 }}>{tool.description}</p>
      </div>

      {/* Meta Info */}
      <div style={{
        marginTop: 28, padding: 20, borderRadius: 12,
        border: "1px solid var(--border)", background: "var(--bg-card)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: "0.875rem" }}>
          <div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-subtle)", marginBottom: 4 }}>
              Category
            </div>
            <Link href={`/categories/${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`}
              style={{ color: "var(--fg)", fontWeight: 500 }}>
              {tool.category}
            </Link>
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-subtle)", marginBottom: 4 }}>
              Pricing
            </div>
            <span className={`price-badge ${tool.pricing.toLowerCase()}`}>
              {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
            </span>
          </div>
          {tool.url && (
            <div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-subtle)", marginBottom: 4 }}>
                Website
              </div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", fontWeight: 500 }}>
                {domain}
              </a>
            </div>
          )}
          {tool.added && (
            <div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-subtle)", marginBottom: 4 }}>
                Added
              </div>
              <div>{tool.added}</div>
            </div>
          )}
          {professionClusters.length > 0 && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-subtle)", marginBottom: 4 }}>
                Best for
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {professionClusters.map(cluster => (
                  <span key={cluster} className="tag-chip">{cluster}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-subtle)", marginBottom: 8 }}>
            Tags
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {tool.tags.map(tag => (
              <span key={tag} className="tag-chip">#{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {related.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 14 }}>
            Related Tools
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {related.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="tool-card">
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</h3>
                {t.subtitle && (
                  <p style={{ margin: "3px 0 0", fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--fg-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {t.subtitle}
                  </p>
                )}
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {t.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
