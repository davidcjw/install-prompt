import { RepoData } from "./github";

const INSTALL_KEYWORDS = [
  "install",
  "setup",
  "set up",
  "getting started",
  "quick start",
  "quickstart",
  "prerequisites",
  "requirements",
  "usage",
  "running",
  "how to run",
  "development",
  "local",
  "configuration",
  "docker",
  "environment",
];

export function extractInstallSections(readme: string): string {
  const lines = readme.split("\n");
  const sections: string[] = [];
  let inRelevantSection = false;
  let currentSection: string[] = [];
  let depth = 0;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);

    if (headingMatch) {
      const headingLevel = headingMatch[1].length;
      const headingText = headingMatch[2].toLowerCase();
      const isRelevant = INSTALL_KEYWORDS.some((kw) => headingText.includes(kw));

      if (isRelevant) {
        if (currentSection.length > 0) sections.push(currentSection.join("\n").trim());
        currentSection = [line];
        inRelevantSection = true;
        depth = headingLevel;
      } else if (inRelevantSection && headingLevel <= depth) {
        // New section at same or higher level ends the relevant section
        if (currentSection.length > 0) sections.push(currentSection.join("\n").trim());
        currentSection = [];
        inRelevantSection = false;
      } else if (inRelevantSection) {
        currentSection.push(line);
      }
    } else if (inRelevantSection) {
      currentSection.push(line);
    }
  }

  if (currentSection.length > 0) sections.push(currentSection.join("\n").trim());

  if (sections.length === 0) {
    // Fallback: return first 3000 chars of README
    return readme.slice(0, 3000) + (readme.length > 3000 ? "\n\n[...README truncated...]" : "");
  }

  const joined = sections.join("\n\n---\n\n");
  return joined.length > 8000 ? joined.slice(0, 8000) + "\n\n[...truncated...]" : joined;
}

function sanitizePackageJson(content: string): string {
  try {
    const pkg = JSON.parse(content);
    // Only keep relevant fields
    const slim = {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      engines: pkg.engines,
      scripts: pkg.scripts,
      dependencies: pkg.dependencies,
      peerDependencies: pkg.peerDependencies,
    };
    // Remove undefined keys
    Object.keys(slim).forEach((k) => slim[k as keyof typeof slim] === undefined && delete slim[k as keyof typeof slim]);
    return JSON.stringify(slim, null, 2);
  } catch {
    return content;
  }
}

export function generateInstallPrompt(data: RepoData): string {
  const { repo, readme, languages, configFiles } = data;

  const installContent = readme ? extractInstallSections(readme) : null;

  const configSection = buildConfigSection(configFiles);

  const lines: string[] = [];

  lines.push(`# AI Installation Assistant for: ${repo.fullName}`);
  lines.push("");
  lines.push(
    `You are an expert developer helping me install and set up the GitHub repository **[${repo.fullName}](${repo.url})** on my local machine.`
  );
  lines.push("");

  lines.push("## Repository Overview");
  lines.push(`- **Repo:** ${repo.url}`);
  if (repo.description) lines.push(`- **Description:** ${repo.description}`);
  if (languages.length > 0) lines.push(`- **Languages:** ${languages.join(", ")}`);
  if (repo.topics.length > 0) lines.push(`- **Topics:** ${repo.topics.join(", ")}`);
  lines.push("");

  if (installContent) {
    lines.push("## Installation Instructions (from README)");
    lines.push("");
    lines.push(installContent);
    lines.push("");
  }

  if (configSection) {
    lines.push("## Project Configuration Files");
    lines.push("");
    lines.push(configSection);
    lines.push("");
  }

  lines.push("## Your Task");
  lines.push("");
  lines.push(
    "Please help me install and run this project on my machine by doing the following:"
  );
  lines.push("");
  lines.push(
    "1. **Understand my environment first** — Ask me about my OS (macOS/Linux/Windows), existing tools installed, and any other relevant context."
  );
  lines.push(
    "2. **Check prerequisites** — Identify any required tools (Node.js, Python, Docker, etc.) and tell me how to install them if I don't have them."
  );
  lines.push(
    "3. **Walk me through installation** — Provide exact terminal commands I should run, one step at a time."
  );
  lines.push(
    "4. **Handle environment variables** — If the project requires secrets or configuration, identify what's needed and ask me for those values."
  );
  lines.push(
    "5. **Verify it works** — Tell me how to confirm the project is running correctly."
  );
  lines.push("");
  lines.push(
    "If any step is unclear or you need more information, ask me before proceeding."
  );
  lines.push("");
  lines.push(
    "Start by briefly summarising what this project does, then ask me the first questions you need answered before we begin."
  );

  return lines.join("\n");
}

function buildConfigSection(configFiles: Record<string, string>): string {
  const parts: string[] = [];

  for (const [filename, content] of Object.entries(configFiles)) {
    const processed = filename === "package.json" ? sanitizePackageJson(content) : content;
    const ext = filename.split(".").pop() || "";
    const lang = extToLang(ext);
    parts.push(`### \`${filename}\`\n\`\`\`${lang}\n${processed}\n\`\`\``);
  }

  return parts.join("\n\n");
}

function extToLang(ext: string): string {
  const map: Record<string, string> = {
    json: "json",
    toml: "toml",
    yaml: "yaml",
    yml: "yaml",
    txt: "text",
    py: "python",
    rb: "ruby",
    js: "javascript",
    ts: "typescript",
    xml: "xml",
    gradle: "groovy",
    mod: "go",
    lock: "text",
    cfg: "ini",
    ini: "ini",
    env: "bash",
    sample: "bash",
    example: "bash",
  };
  return map[ext] || "text";
}

export function generateEmbedMarkdown(repoUrl: string, prompt: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://install-prompt.vercel.app";
  const encodedRepo = encodeURIComponent(repoUrl);

  return [
    "## AI-Powered Installation",
    "",
    `[![Install with AI](https://img.shields.io/badge/Install%20with%20AI-8A2BE2?style=for-the-badge&logo=anthropic&logoColor=white)](${appUrl}?repo=${encodedRepo})`,
    "",
    "Or copy and paste the prompt below into any AI assistant (Claude, ChatGPT, Gemini, etc.):",
    "",
    "<details>",
    "<summary>📋 Click to expand AI Installation Prompt</summary>",
    "",
    "```",
    prompt,
    "```",
    "",
    "</details>",
  ].join("\n");
}
