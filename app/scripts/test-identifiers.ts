/**
 * Quick test: run with `npx tsx scripts/test-identifiers.ts`
 * Shows what identifiers get extracted from page.tsx
 */
import fs from "node:fs/promises";

// Inline the extraction function for testing
function extractIdentifiers(code: string): string[] {
  const ids = new Set<string>();

  const patterns = [
    /(?:const|let|var|function|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/g,
    /(?:const|let|var)\s+\{\s*([^}]+)\}/g,
    /import\s+(?:type\s+)?(?:\{\s*([^}]+)\}|([A-Za-z_$][\w$]*))/g,
    /export\s+(?:default\s+)?(?:const|let|var|function|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/g,
    /\b(use[A-Z][\w]*|handle[A-Z][\w]*|on[A-Z][\w]*|set[A-Z][\w]*)\b/g,
    /<([A-Z][\w]*)/g,
    /(?::\s*|as\s+)([A-Z][\w]*(?:<[^>]*>)?)/g,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(code)) !== null) {
      for (let i = 1; i < match.length; i++) {
        const raw = match[i];
        if (!raw) continue;
        if (raw.includes(",")) {
          for (const part of raw.split(",")) {
            const cleaned = part.replace(/\s+as\s+\w+/, "").trim();
            if (
              cleaned &&
              /^[A-Za-z_$][\w$]*$/.test(cleaned) &&
              cleaned.length > 1
            ) {
              ids.add(cleaned);
            }
            const aliasMatch = part.match(/as\s+([A-Za-z_$][\w$]*)/);
            if (aliasMatch) ids.add(aliasMatch[1]);
          }
        } else {
          const cleaned = raw.replace(/<[^>]*>$/, "").trim();
          if (
            cleaned &&
            /^[A-Za-z_$][\w$]*$/.test(cleaned) &&
            cleaned.length > 1
          ) {
            ids.add(cleaned);
          }
        }
      }
    }
  }

  const SKIP = new Set([
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "return",
    "new",
    "this",
    "true",
    "false",
    "null",
    "undefined",
    "void",
    "typeof",
    "instanceof",
    "in",
    "of",
    "from",
    "as",
    "async",
    "await",
    "try",
    "catch",
    "throw",
    "finally",
    "with",
    "default",
    "delete",
    "import",
    "export",
    "extends",
    "implements",
    "super",
    "yield",
    "static",
    "get",
    "set",
    "constructor",
    "string",
    "number",
    "boolean",
    "any",
    "never",
    "unknown",
    "object",
  ]);

  return [...ids].filter((id) => !SKIP.has(id)).sort();
}

async function main() {
  const code = await fs.readFile("app/page.tsx", "utf8");
  const ids = extractIdentifiers(code);

  console.log(`\n📋 Extracted ${ids.length} identifiers from page.tsx:\n`);
  console.log(ids.join(", "));
}

main().catch(console.error);
