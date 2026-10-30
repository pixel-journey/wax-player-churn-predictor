import type { ChurnRiskResult } from "./types";

export function exportChurnMarkdown(result: ChurnRiskResult): string {
  const lines = [
    `# Churn risk — ${result.account}`,
    "",
    `> Educational only · score ${result.riskScore} (${result.level})`,
    "",
    "## Components",
    "",
  ];
  for (const [k, v] of Object.entries(result.components)) {
    lines.push(`- **${k}**: ${v}`);
  }
  lines.push("", "## Flags", "");
  for (const f of result.flags) {
    lines.push(`- [${f.level}] ${f.message}`);
  }
  lines.push("", result.methodologyNote, "");
  return lines.join("\n");
}

export function downloadText(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
