import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listLanguagesAndCategories,
  loadCategory,
  searchAll,
} from "./standards.js";

const server = new McpServer({
  name: "coding-standards-mcp-server",
  version: "1.0.0",
});

const languageParam = z
  .enum(["python", "nodejs"])
  .describe(
    'The programming language to retrieve standards for. Must be "python" or "nodejs". ' +
      "Determine this from the engineer's context: the file extension they are working in " +
      "(.py = python, .ts/.js/.mjs = nodejs), the language they mention in their request, " +
      "or the project type. If the language is ambiguous, call list_categories first to see " +
      "what languages are available, or ask the engineer which language they are working in."
  );

// Tool 1: list_categories
server.registerTool(
  "list_categories",
  {
    title: "List Available Languages and Coding Standard Categories",
    description: `List all supported programming languages and their available coding standard categories.

Call this tool FIRST when you need to discover what languages and coding guidelines are available before generating or reviewing code. Returns a structured list of languages (e.g. "python", "nodejs") and for each language, the available category names (e.g. "naming", "patterns", "structure") that can be passed to get_guidelines.

Use this when:
- You are about to generate code and want to know what standards are available
- The engineer asks "what coding standards do you have?" or "what guidelines exist?"
- You need to find the correct language or category name before calling get_guidelines
- You are unsure which languages are supported

Returns: A list of languages, each with their available category names.`,
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async () => {
    try {
      const data = await listLanguagesAndCategories();
      const lines = ["Available languages and categories:\n"];
      for (const { language, categories } of data) {
        lines.push(`${language}:`);
        for (const cat of categories) {
          lines.push(`- ${cat}`);
        }
        lines.push("");
      }
      return { content: [{ type: "text", text: lines.join("\n") }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${message}` }],
      };
    }
  }
);

// Tool 2: get_guidelines
server.registerTool(
  "get_guidelines",
  {
    title: "Get Coding Guidelines by Language and Category",
    description: `Retrieve the FULL coding standards document for a specific programming language and category. This is the PRIMARY tool to call before writing any code.

You MUST call this tool (not get_quick_reference) whenever the engineer's request involves any of the following — pick the matching category:
- Writing or naming functions, methods, classes, variables, files, constants → category: "naming"
- Choosing HTTP clients, error handling, async patterns, third-party libraries → category: "patterns"
- Creating or organising files, directories, modules → category: "structure"

Do NOT use get_quick_reference as a substitute — it is a summary only and omits critical team-specific rules such as the forbidden use of get_ for database reads, or which HTTP client is approved.

You MUST specify the correct language. Determine it from the file extension (.py = "python", .ts/.js = "nodejs"), the request, or the project context. If unsure, call list_categories first.

IMPORTANT: Always follow the standards returned by this tool over your general training knowledge. These are team-specific conventions that override generic best practices.

Examples of when to call this tool:
- Engineer asks to "add a function to fetch a user" → call with language + "naming" (reveals fetch_ vs get_ vs list_ rules)
- Engineer asks to "add an HTTP call" → call with language + "patterns" (reveals approved HTTP client)
- Engineer asks to "add a new feature module" → call with language + "structure"
- Engineer asks about naming, conventions, or best practices → call with language + "naming" or "patterns"

Returns: The complete markdown content of the requested category, including all approved patterns, forbidden patterns, and team-specific rules.

Error behaviour: If the language or category does not exist, returns an error listing all valid options so you can retry with the correct values.`,
    inputSchema: {
      language: languageParam,
      category: z
        .string()
        .describe(
          'The coding standard category to retrieve. Must be one of the available category names ' +
            'returned by list_categories (e.g. "naming", "patterns", "structure", "quick-reference"). ' +
            "Call list_categories first if you are unsure which categories exist."
        ),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ language, category }) => {
    try {
      const content = await loadCategory(language, category);
      return { content: [{ type: "text", text: content }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${message}` }],
      };
    }
  }
);

// Tool 3: search_guidelines
server.registerTool(
  "search_guidelines",
  {
    title: "Search Coding Guidelines for a Language",
    description: `Search across ALL coding standard documents for a specific programming language, matching a topic, keyword, or concept.

Use this tool when the engineer's request does not map neatly to a single category, or when you need to find rules about a specific cross-cutting concern within a language. This searches headings and body text across every standards file for that language and returns the most relevant matching sections.

You MUST specify the correct language. Determine it from the file extension, the request, or the project context. If unsure, call list_categories first.

Use this instead of get_guidelines when:
- The topic spans multiple categories (e.g. "error handling" may appear in both patterns and naming)
- You need rules about a specific concept like "decorators", "async", "testing", "imports", or "forbidden patterns"
- The engineer asks a how-to question: "how should I handle errors in Python?", "what's the rule for imports?"
- You are unsure which category contains the relevant guidance

Returns: Matched sections with their category and heading, ranked by relevance (heading matches first, then body matches). Each result includes the category name, the section heading, and the full section content.

If no results are found, returns a message saying no matches were found — consider rephrasing with a synonym or broader term.`,
    inputSchema: {
      language: languageParam,
      query: z
        .string()
        .min(1, "Search query cannot be empty")
        .describe(
          "The keyword or phrase to search for across all coding standards for the specified language. " +
            'Examples: "error handling", "decorators", "import order", "forbidden", "async". ' +
            "The search is case-insensitive and matches against both section headings and body text."
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(5)
        .describe(
          "Maximum number of matching sections to return. Defaults to 5. Increase if the first results don't fully answer the question."
        ),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ language, query, limit }) => {
    try {
      const results = await searchAll(language, query, limit);
      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No guidelines found matching "${query}" for language "${language}". Try a broader search term or use list_categories to browse available topics.`,
            },
          ],
        };
      }
      const formatted = results
        .map((r) => `### [${r.category}] ${r.heading}\n\n${r.content}\n\n---`)
        .join("\n\n");
      return { content: [{ type: "text", text: formatted }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${message}` }],
      };
    }
  }
);

// Tool 4: get_quick_reference
server.registerTool(
  "get_quick_reference",
  {
    title: "Get Quick Reference Cheat Sheet for a Language",
    description: `Get the team's top-10 most important coding rules for a specific programming language as a quick-reference cheat sheet.

WARNING: This tool returns only a summary. It DOES NOT contain the full team-specific verb rules, forbidden patterns, or detailed conventions. DO NOT use this tool when the engineer's request involves writing functions, classes, variables, choosing libraries, handling errors, or structuring files — use get_guidelines with the specific category instead.

Only call this tool when:
- The engineer explicitly asks for a "summary" or "overview" of the team's standards
- The request is so broad that no specific category (naming, patterns, structure) applies at all
- You want a final compliance checklist AFTER already calling get_guidelines for the specific task

DO NOT call this tool as a substitute for get_guidelines. It will cause you to miss critical team-specific rules (e.g. the difference between fetch_, list_, and get_ verb prefixes for functions).

You MUST specify the correct language. Determine it from the file extension (.py = "python", .ts/.js = "nodejs"), the language in the request, or the project context. If unsure, call list_categories first.

Returns: A curated, concise list of the 10 most important rules. For full detail on any rule, call get_guidelines with the relevant category.`,
    inputSchema: {
      language: languageParam,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ language }) => {
    try {
      const content = await loadCategory(language, "quick-reference");
      return { content: [{ type: "text", text: content }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${message}` }],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
