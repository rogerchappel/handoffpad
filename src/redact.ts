const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp; replacement: string }> = [
  { name: "github-token", pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/g, replacement: "[REDACTED:GITHUB_TOKEN]" },
  { name: "aws-access-key", pattern: /AKIA[0-9A-Z]{16}/g, replacement: "[REDACTED:AWS_ACCESS_KEY]" },
  { name: "generic-secret-assignment", pattern: /\b(api[_-]?key|token|secret|password)\s*=\s*[^\s'\"]+/gi, replacement: "$1=[REDACTED:SECRET]" },
  { name: "bearer-token", pattern: /Bearer\s+[A-Za-z0-9._~+/-]+=*/g, replacement: "Bearer [REDACTED:BEARER_TOKEN]" }
];

export interface RedactionResult {
  text: string;
  redactions: string[];
}

export function redactText(input: string, home = process.env.HOME ?? ""): RedactionResult {
  let text = input;
  const redactions = new Set<string>();

  if (home && text.includes(home)) {
    text = text.split(home).join("~");
    redactions.add("home-path");
  }

  for (const rule of SECRET_PATTERNS) {
    if (rule.pattern.test(text)) {
      redactions.add(rule.name);
      text = text.replace(rule.pattern, rule.replacement);
    }
    rule.pattern.lastIndex = 0;
  }

  return { text, redactions: [...redactions].sort() };
}

export function mergeRedactions(...groups: string[][]): string[] {
  return [...new Set(groups.flat())].sort();
}
