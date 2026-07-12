"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { tools, getAllCategories, getCareerClusters, CAREER_CLUSTERS, type Tool } from "@/lib/tools";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}/`} className="tool-card">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tool.name}</h3>
          {tool.subtitle && (
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--fg-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {tool.subtitle}
            </p>
          )}
        </div>
        <span className={`price-badge ${tool.pricing.toLowerCase()}`}>
          {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
        </span>
      </div>
      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
        {tool.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag-chip">{tag}</span>
        ))}
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const allCategories = useMemo(() => getAllCategories(), []);
  const careerClusters = useMemo(() => getCareerClusters(), []);
  const visibleCategories = showAllCategories ? allCategories : allCategories.slice(0, 8);

  const filtered = useMemo(() => {
    let result = tools;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter(t =>
        t.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === selectedCategory
      );
    }

    if (selectedPricing) {
      result = result.filter(t => t.pricing === selectedPricing);
    }

    if (selectedCareer) {
      const cluster = Object.entries(CAREER_CLUSTERS).find(
        ([name]) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === selectedCareer
      );
      if (cluster) {
        const profSet = new Set(cluster[1]);
        result = result.filter(t => t.professions && t.professions.some(p => profSet.has(p)));
      }
    }

    return result;
  }, [search, selectedCategory, selectedPricing, selectedCareer]);

  const hasActiveFilters = search || selectedCategory || selectedPricing || selectedCareer;

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px" }}>
      {/* Hero */}
      <section style={{ marginBottom: 28, textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
          AI Tools Directory
        </h1>
        <p style={{ margin: "6px auto 0", maxWidth: 400, fontSize: "0.875rem", lineHeight: 1.5, color: "var(--fg-muted)" }}>
          {tools.length} handpicked AI tools — searchable, categorized, and free.
        </p>
        <div style={{ maxWidth: 480, margin: "16px auto 0" }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools, categories, tags..."
            className="search-input"
          />
        </div>
      </section>

      {/* Filters */}
      <div className="filter-bar">
        {/* Career filter */}
        <div className="filter-group">
          <span className="filter-label">Role</span>
          <div className="filter-row">
            <button onClick={() => setSelectedCareer("")} className={`filter-btn filter-btn-sm ${!selectedCareer ? "active" : ""}`}>All</button>
            {careerClusters.map(c => (
              <button key={c.key}
                onClick={() => setSelectedCareer(selectedCareer === c.key ? "" : c.key)}
                className={`filter-btn filter-btn-sm ${selectedCareer === c.key ? "active" : ""}`}>
                {c.name} <span style={{ opacity: 0.5 }}>{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <div className="filter-row">
            <button onClick={() => { setSelectedCategory(""); setShowAllCategories(false); }} className={`filter-btn ${!selectedCategory ? "active" : ""}`}>All</button>
            {visibleCategories.map(cat => (
              <button key={cat.slug}
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                className={`filter-btn ${selectedCategory === cat.slug ? "active" : ""}`}>
                {cat.name} <span style={{ opacity: 0.5 }}>{cat.count}</span>
              </button>
            ))}
            {allCategories.length > 8 && (
              <button onClick={() => setShowAllCategories(!showAllCategories)} className="show-more">
                {showAllCategories ? "Less" : `+${allCategories.length - 8} more`}
              </button>
            )}
          </div>
        </div>

        {/* Pricing filter */}
        <div className="filter-group">
          <span className="filter-label">Price</span>
          <div className="filter-row">
            {["", "Free", "Freemium", "Paid"].map(p => (
              <button key={p}
                onClick={() => setSelectedPricing(selectedPricing === p ? "" : p)}
                className={`filter-btn filter-btn-sm ${selectedPricing === p ? "active" : ""}`}>
                {p || "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="stat" style={{ marginBottom: 12 }}>
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {filtered.slice(0, 48).map(tool => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filtered.length > 48 && (
        <p className="stat" style={{ marginTop: 20, textAlign: "center" }}>
          Showing 48 of {filtered.length} tools
        </p>
      )}

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--fg-muted)", marginTop: 48, fontSize: "0.875rem" }}>
          No tools match your filters. Try a different combination.
        </p>
      )}

      {/* Tag cloud — only when no filters active */}
      {!hasActiveFilters && (
        <>
          <div className="section-divider" />
          <section>
            <h2 className="filter-label" style={{ marginBottom: 10 }}>Browse by Tag</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {(() => {
                const tagMap = new Map<string, number>();
                for (const t of tools) {
                  for (const tag of t.tags) {
                    if (tag) tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                  }
                }
                const sorted = Array.from(tagMap.entries())
                  .map(([name, count]) => ({ name, count }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 40);
                return sorted.map(tag => (
                  <span key={tag.name} className="tag-chip" style={{ fontSize: "0.75rem" }}>
                    #{tag.name} <span style={{ opacity: 0.4 }}>{tag.count}</span>
                  </span>
                ));
              })()}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
