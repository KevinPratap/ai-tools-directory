"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { tools, getAllCategories, getAllTags, type Tool } from "@/lib/tools";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}/`}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      className="group block rounded-lg p-4 transition-all hover:shadow-sm"
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
        <span className="shrink-0 text-xs font-medium" style={{ color: "var(--fg-subtle)" }}>
          {tool.pricing === "Free" ? "○" : tool.pricing === "Paid" ? "●" : "◐"} {tool.pricing}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {tool.tags.slice(0, 3).map((tag) => (
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Tools Directory</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: "var(--fg-muted)" }}>
          {tools.length} handpicked AI tools, categorized and searchable.
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tools, categories, tags..."
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}
            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--fg)]"
          />
        </div>
      </section>

      {/* Category filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <button onClick={() => setSelectedCategory("")}
          style={{ background: !selectedCategory ? "var(--fg)" : "var(--bg-secondary)", color: !selectedCategory ? "var(--bg)" : "var(--fg-muted)" }}
          className="rounded-md px-3 py-1.5 font-medium transition-all">All</button>
        {allCategories.slice(0, 15).map(cat => (
          <button key={cat.slug} onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
            style={{ background: selectedCategory === cat.slug ? "var(--fg)" : "var(--bg-secondary)", color: selectedCategory === cat.slug ? "var(--bg)" : "var(--fg-muted)" }}
            className="rounded-md px-3 py-1.5 font-medium transition-all whitespace-nowrap">
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Pricing filter */}
      <div className="mb-8 flex items-center gap-2 text-xs">
        <span style={{ color: "var(--fg-subtle)" }}>Price:</span>
        {["", "Free", "Freemium", "Paid"].map(p => (
          <button key={p} onClick={() => setSelectedPricing(selectedPricing === p ? "" : p)}
            style={{ background: selectedPricing === p ? "var(--fg)" : "var(--bg-secondary)", color: selectedPricing === p ? "var(--bg)" : "var(--fg-muted)" }}
            className="rounded-md px-3 py-1 font-medium transition-all">{p || "All"}</button>
        ))}
      </div>

      <div className="mb-4 text-xs" style={{ color: "var(--fg-subtle)" }}>
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.slice(0, 48).map(tool => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filtered.length > 48 && (
        <p className="mt-6 text-center text-xs" style={{ color: "var(--fg-subtle)" }}>
          Showing 48 of {filtered.length} tools
        </p>
      )}

      {/* Tag cloud */}
      <section className="mt-16">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider">Browse by Tag</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 50).map(tag => (
            <span key={tag.name} className="tag-chip text-xs">
              #{tag.name} ({tag.count})
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
