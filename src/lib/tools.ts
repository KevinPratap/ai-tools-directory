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
export type CareerCluster = { name: string; count: number; key: string };

type DataFile = {
  tools: Tool[];
  categories: Category[];
  meta: { total_tools: number; total_categories: number; source: string };
};

const data = toolsData as DataFile;
export const tools = data.tools;
export const categories = data.categories;

export const CAREER_CLUSTERS: Record<string, string[]> = {
  "Engineering": [
    "Developers", "Web Developers", "Mobile Developers", "Software Architects",
    "DevOps Engineers", "Cloud Architects", "Blockchain Developers",
    "IoT Engineers", "QA Engineers", "Network Engineers", "System Administrators",
    "IT Managers", "IT Support Specialists",
    "Automotive Engineers", "Aerospace Engineers", "Biomedical Engineers",
    "Chemical Engineers", "Civil Engineers", "Electrical Engineers",
    "Environmental Engineers", "Structural Engineers", "Transportation Engineers",
    "Manufacturing Engineers", "Industrial Engineers", "Forensic Engineers",
  ],
  "Data & AI": [
    "Data Scientists", "Data Analysts", "Data Engineers", "ML Engineers",
    "Computational Biologists", "Data Visualization Specialists",
    "Geospatial Analysts", "Data Privacy Officers", "Actuaries",
    "Business Analysts", "Budget Analysts",
  ],
  "Design": [
    "Designers", "UI Designers", "UX Designers", "Graphic Designers",
    "Product Designers", "Industrial Designers", "Interior Designers",
    "Motion Designers", "Fashion Designers", "Textile Designers",
    "Costume Designers", "Landscape Designers", "Web Designers",
    "Digital Artists", "3D Artists", "Animators", "Illustrators",
    "Art Directors", "Creative Directors",
  ],
  "Marketing & Sales": [
    "Digital Marketers", "Content Marketers", "SEO Specialists",
    "Social Media Managers", "Brand Managers", "Brand Strategists",
    "Growth Marketers", "Marketing Analysts", "E-Commerce Managers",
    "Brand Consultants", "Community Managers", "Influencers",
    "Sales Professionals", "Business Owners", "Startup Founders",
    "Executives", "Product Managers", "Venture Capitalists",
    "Real Estate Agents", "Real Estate Developers", "Real Estate Investors",
  ],
  "Content & Writing": [
    "Content Creators", "Copywriters", "Ghostwriters", "Grant Writers",
    "Medical Writers", "Technical Writers", "Journalists", "Columnists",
    "Screenwriters", "Book Editors", "Podcasters", "Communications Specialists",
    "Content Strategists", "Columnists",
  ],
  "Video & Media": [
    "Filmmakers", "Video Creators", "Videographers", "Video Game Designers",
    "Media Producers", "Music Producers", "Musicians", "Sound Engineers",
    "Voice Actors", "Photographers", "Wedding Photographers",
    "Wildlife Photographers", "Visual Effects Artists", "Game Developers",
    "Game Writers",
  ],
  "Healthcare": [
    "Doctors", "Surgeons", "Nurse Practitioners", "Dentists", "Dermatologists",
    "Cardiologists", "Radiologists", "Psychiatrists", "Clinical Psychologists",
    "Chiropractors", "Healthcare Professionals", "Nutritionists",
    "Fitness Coaches", "Health Coaches", "Medical Writers",
    "Pharmacists", "Audiologists", "Art Therapists", "Addiction Counselors",
    "Athletes", "Personal Trainers", "Yoga Instructors",
  ],
  "Finance & Legal": [
    "Finance Professionals", "Financial Advisors", "Financial Planners",
    "Investment Bankers", "Portfolio Managers", "Tax Professionals",
    "Accountants", "Tax Lawyers", "Lawyers", "Patent Attorneys",
    "Entertainment Lawyers", "Insurance Professionals",
    "Contract Managers", "Compliance Officers", "Appraisers",
  ],
  "HR & Operations": [
    "HR & Recruiters", "Recruiters", "Technical Recruiters",
    "HR Business Partners", "Talent Agents", "Career Coaches",
    "Corporate Trainers", "Executive Assistants", "Event Planners",
    "Procurement Managers", "Logistics Managers", "Supply Chain Managers",
    "Warehouse Managers", "Fleet Managers", "Hospitality Managers",
    "Property Managers", "Quality Managers",
  ],
  "Research & Education": [
    "Researchers & Students", "Curriculum Designers", "Instructional Designers",
    "Language Teachers", "Science Communicators", "Behavioral Scientists",
    "Biologists", "Biochemists", "Chemists", "Astronomers",
    "Anthropologists", "Archaeologists", "Epidemiologists",
    "Clinical Researchers", "Clinical Trial Managers", "Food Scientists",
    "Meteorologists", "Space Scientists",
  ],
};

export function getCareerClusters(): CareerCluster[] {
  const clusterMap = new Map<string, number>();
  for (const [cluster, profs] of Object.entries(CAREER_CLUSTERS)) {
    const profSet = new Set(profs);
    let count = 0;
    for (const t of tools) {
      if (t.professions && t.professions.some(p => profSet.has(p))) {
        count++;
      }
    }
    if (count > 0) {
      clusterMap.set(cluster, count);
    }
  }
  return Array.from(clusterMap.entries())
    .map(([name, count]) => ({ name, count, key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))
    .sort((a, b) => b.count - a.count);
}

export function toolsInCareerCluster(clusterKey: string): Tool[] {
  const entry = Object.entries(CAREER_CLUSTERS).find(
    ([_, profs]) => clusterKey === "all" || clusterKey === "" || clusterKey === clusterKey
  );
  if (!clusterKey || clusterKey === "all") return tools;
  const clusterName = Object.keys(CAREER_CLUSTERS).find(
    k => k.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clusterKey
  );
  if (!clusterName) return tools;
  const profSet = new Set(CAREER_CLUSTERS[clusterName]);
  return tools.filter(t => t.professions && t.professions.some(p => profSet.has(p)));
}

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
