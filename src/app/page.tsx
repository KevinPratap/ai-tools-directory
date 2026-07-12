"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { tools, getAllCategories, getAllTags, type Tool } from "@/lib/tools";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}/`} className="tool-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tool.name}</h3>
          {tool.subtitle && (
            <p style={{ margin: "3px 0 0", fontSize: "0.8125rem", lineHeight: 1.4, color: "var(--fg-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {tool.subtitle}
            </p>
          )}
        </div>
        <span className={`price-badge ${tool.pricing.toLowerCase()}`}>
          {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
        </span>
      </div>
      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
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

  const allCategories = useMemo(() => getAllCategories(), []);
  const allTags = useMemo(() => getAllTags(), []);

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
    return result;
  }, [search, selectedCategory, selectedPricing]);

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 16px" }}>
      {/* Hero */}
      <section style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
          AI Tools Directory
        </h1>
        <p style={{ margin: "8px auto 0", maxWidth: 420, fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--fg-muted)" }}>
          {tools.length} handpicked AI tools — searchable, categorized, and free.
        </p>
        <div style={{ maxWidth: 520, margin: "24px auto 0" }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools, categories, tags..."
            className="search-input"
          />
        </div>
      </section>

      {/* Category filters */}
      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button onClick={() => setSelectedCategory("")} className={`cat-btn ${!selectedCategory ? "active" : ""}`}>All</button>
        {allCategories.slice(0, 20).map(cat => (
          <button key={cat.slug}
            onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
            className={`cat-btn ${selectedCategory === cat.slug ? "active" : ""}`}>
            {cat.name} {cat.count}
          </button>
        ))}
      </div>

      {/* Pricing filter */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
        <span className="stat">Price:</span>
        {["", "Free", "Freemium", "Paid"].map(p => (
          <button key={p}
            onClick={() => setSelectedPricing(selectedPricing === p ? "" : p)}
            className={`price-btn ${selectedPricing === p ? "active" : ""}`}>
            {p || "All"}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="stat" style={{ marginBottom: 12 }}>
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Tool grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {filtered.slice(0, 48).map(tool => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filtered.length > 48 && (
        <p className="stat" style={{ marginTop: 24, textAlign: "center" }}>
          Showing 48 of {filtered.length} tools
        </p>
      )}

      {/* Tag cloud */}
      {!search && !selectedCategory && !selectedPricing && (
        <section style={{ marginTop: 64 }}>
          <h2 className="section-title">Browse by Tag</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {allTags.slice(0, 50).map(tag => (
              <span key={tag.name} className="tag-chip" style={{ fontSize: "0.75rem" }}>
                #{tag.name} ({tag.count})
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
