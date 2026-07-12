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
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-6 text-xs" style={{ color: "var(--fg-subtle)" }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-1">/</span>
        <span style={{ color: "var(--fg-muted)" }}>{tool.category}</span>
        <span className="mx-1">/</span>
        <span style={{ color: "var(--fg-muted)" }}>{tool.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
            {tool.subtitle && (
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{tool.subtitle}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider badge-${tool.pricing.toLowerCase()}`}
              style={{ padding: "2px 8px", borderRadius: 4 }}>
              {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
            </span>
          </div>
        </div>

        {tool.url && (
          <a href={tool.url} target="_blank" rel="noopener noreferrer"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
            Visit Tool →
          </a>
        )}
      </div>

      <div className="prose-sm max-w-none leading-relaxed">
        {tool.full_description ? (
          <p>{tool.full_description}</p>
        ) : (
          <p style={{ color: "var(--fg-muted)" }}>{tool.description}</p>
        )}
      </div>

      <div className="mt-8 rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs font-medium" style={{ color: "var(--fg-subtle)" }}>Category</dt>
            <dd>{tool.category}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium" style={{ color: "var(--fg-subtle)" }}>Pricing</dt>
            <dd>{tool.pricing}</dd>
          </div>
          {tool.url && (
            <div className="col-span-2">
              <dt className="text-xs font-medium" style={{ color: "var(--fg-subtle)" }}>Website</dt>
              <dd><a href={tool.url} target="_blank" rel="noopener noreferrer"
                className="truncate text-sm hover:underline">{tool.url.replace(/^https?:\/\//, "")}</a></dd>
            </div>
          )}
          {tool.added && (
            <div>
              <dt className="text-xs font-medium" style={{ color: "var(--fg-subtle)" }}>Added</dt>
              <dd>{tool.added}</dd>
            </div>
          )}
        </dl>
      </div>

      {tool.tags.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider">Tags</h2>
          <div className="flex flex-wrap gap-1.5">
            {tool.tags.map(tag => <span key={tag} className="tag-chip">#{tag}</span>)}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider">Related Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}/`}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                className="block rounded-lg p-4 transition-all hover:shadow-sm">
                <h3 className="truncate text-sm font-semibold">{t.name}</h3>
                {t.subtitle && <p className="mt-0.5 line-clamp-2 text-xs" style={{ color: "var(--fg-muted)" }}>{t.subtitle}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
