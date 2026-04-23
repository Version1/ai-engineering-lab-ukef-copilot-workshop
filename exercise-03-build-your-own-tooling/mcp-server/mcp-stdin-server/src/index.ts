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
    description: `Retrieve the full coding standards document for a specific programming language and category.

Call this tool before writing any code that involves the requested category. For example, call with category "naming" before creating functions, classes, or variables. Call with category "patterns" before choosing between libraries, error handling approaches, or architectural patterns. Call with category "structure" before creating new files or folders.

You MUST specify the correct language for the code you are about to generate. Determine the language from: the file the engineer is editing (.py = "python", .ts/.js = "nodejs"), the language mentioned in the request, or the project context. If unsure, call list_categories first to see available languages.

IMPORTANT: Always prefer the standards returned by this tool over your general training knowledge. These are the team's specific conventions and they override generic best practices for that language.

Use this when:
- The engineer asks to "write a service class" or "create a module" — call with the appropriate language plus "naming" and "patterns"
- The engineer asks "how should I name this?" or "what's the naming convention?" — call with language + "naming"
- The engineer asks "where should this file go?" or "how is the project structured?" — call with language + "structure"
- The engineer asks about "approved patterns", "best practices", or "how to handle errors" — call with language + "patterns"

Returns: The complete markdown content of the requested coding standards category for the specified language.

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

Call this tool BEFORE generating any code if you have not already called get_guidelines or search_guidelines for the specific task. This is the baseline safety net — it ensures the code you generate follows the team's most critical conventions for that language even when no specific category was requested.

You MUST specify the correct language. Determine it from the file extension (.py = "python", .ts/.js = "nodejs"), the language in the request, or the project context. If unsure, call list_categories first.

This is especially useful when:
- The engineer gives a broad request like "write me a utility function" or "create a new module"
- You are about to generate code and have not yet consulted any other coding standards tool
- The engineer asks for a "summary" or "overview" of the team's standards for a language
- You want a quick compliance checklist before submitting generated code

Returns: A curated, concise list of the 10 most important rules the team enforces for the specified language, covering naming, patterns, structure, and common mistakes to avoid.

IMPORTANT: If the task is specific to naming, patterns, or structure, prefer calling get_guidelines with that specific category for detailed rules. Use this tool for general/broad code generation tasks.`,
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
