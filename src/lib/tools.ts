import toolsData from "@/data/tools.json";

export type Tool = {
  slug: string;
  name: string;
  subtitle: string;
  pricing: string;
  category: string;
  description: string;
  full_description: string;
  url: string;
  tags: string[];
  professions: string[];
  added: string;
  alternatives: number;
};

export type Category = { name: string; count: number; slug: string };

type DataFile = {
  tools: Tool[];
  categories: Category[];
  meta: { total_tools: number; total_categories: number; source: string };
};

const data = toolsData as DataFile;
export const tools = data.tools;
export const categories = data.categories;

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getAllCategories(): Category[] {
  const catMap = new Map<string, number>();
  for (const t of tools) {
    if (t.category) {
      const key = t.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      catMap.set(key, (catMap.get(key) || 0) + 1);
    }
  }
  return Array.from(catMap.entries())
    .map(([slug, count]) => ({
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
      slug,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): { name: string; count: number }[] {
  const tagMap = new Map<string, number>();
  for (const t of tools) {
    for (const tag of t.tags) {
      if (tag) tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter(
    (t) =>
      t.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === categorySlug
  );
}
