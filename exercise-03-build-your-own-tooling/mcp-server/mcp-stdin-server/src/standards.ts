import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STANDARDS_DIR = path.resolve(__dirname, "..", "..", "standards");

function validatePathSegment(value: string, label: string): void {
  if (value.includes("..") || value.includes("/") || value.includes("\\")) {
    throw new Error(`Invalid ${label}: "${value}"`);
  }
}

export async function getAvailableLanguages(): Promise<string[]> {
  const entries = await fs.readdir(STANDARDS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

export async function listLanguagesAndCategories(): Promise<
  { language: string; categories: string[] }[]
> {
  const languages = await getAvailableLanguages();
  const result = await Promise.all(
    languages.map(async (language) => {
      const langDir = path.join(STANDARDS_DIR, language);
      const files = await fs.readdir(langDir);
      const categories = files
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""))
        .sort();
      return { language, categories };
    })
  );
  return result;
}

export async function loadCategory(
  language: string,
  category: string
): Promise<string> {
  validatePathSegment(language, "language");
  validatePathSegment(category, "category");

  const languages = await getAvailableLanguages();
  if (!languages.includes(language)) {
    throw new Error(
      `Language "${language}" not found. Available languages: ${languages.join(", ")}`
    );
  }

  const langDir = path.join(STANDARDS_DIR, language);
  const files = await fs.readdir(langDir);
  const categories = files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  if (!categories.includes(category)) {
    throw new Error(
      `Category "${category}" not found for language "${language}". Available categories: ${categories.sort().join(", ")}`
    );
  }

  const filePath = path.join(langDir, `${category}.md`);
  return fs.readFile(filePath, "utf-8");
}

export interface SearchResult {
  category: string;
  heading: string;
  content: string;
}

export async function searchAll(
  language: string,
  query: string,
  limit = 5
): Promise<SearchResult[]> {
  validatePathSegment(language, "language");

  const languages = await getAvailableLanguages();
  if (!languages.includes(language)) {
    throw new Error(
      `Language "${language}" not found. Available languages: ${languages.join(", ")}`
    );
  }

  const langDir = path.join(STANDARDS_DIR, language);
  const files = await fs.readdir(langDir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const lowerQuery = query.toLowerCase();
  const headingMatches: SearchResult[] = [];
  const bodyMatches: SearchResult[] = [];

  for (const file of mdFiles) {
    const category = file.replace(/\.md$/, "");
    const filePath = path.join(langDir, file);
    const content = await fs.readFile(filePath, "utf-8");

    // Split by ## headings (H2)
    const sections = content.split(/^## /m);

    // Step 1: Check the H1 preamble first
    const preamble = sections[0]?.trim() ?? "";
    if (preamble.startsWith("#")) {
      const h1Heading = preamble.split("\n")[0].replace(/^#+\s*/, "").trim();

      if (h1Heading.toLowerCase().includes(lowerQuery)) {
        // H1 matched — add entire file content as body, skip H2 search
        const fullBody = sections.length > 1
          ? "## " + sections.slice(1).join("\n\n## ").trim()
          : "";
        headingMatches.push({ category, heading: h1Heading, content: fullBody });
        continue; // ← skip to the next file, don't search H2s
      }
    }

    // Step 2: H1 didn't match — search individual H2 sections
    for (const section of sections.slice(1)) {
      if (!section.trim()) continue;

      const lines = section.split("\n");
      const heading = lines[0].trim();
      const body = lines.slice(1).join("\n").trim();

      const headingLower = heading.toLowerCase();
      const bodyLower = body.toLowerCase();

      if (headingLower.includes(lowerQuery)) {
        headingMatches.push({ category, heading, content: body });
      } else if (bodyLower.includes(lowerQuery)) {
        bodyMatches.push({ category, heading, content: body });
      }
    }
  }

  // Heading matches rank higher than body-only matches
  return [...headingMatches, ...bodyMatches].slice(0, limit);
}
