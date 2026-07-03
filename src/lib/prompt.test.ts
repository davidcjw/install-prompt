import { describe, expect, it } from "vitest";
import {
  extractInstallSections,
  generateEmbedMarkdown,
  generateInstallPrompt,
} from "./prompt";
import type { RepoData } from "./github";

describe("extractInstallSections", () => {
  it("captures headings matching INSTALL_KEYWORDS", () => {
    const readme = [
      "# My Project",
      "",
      "## Installation",
      "",
      "Run `npm install` to get started.",
    ].join("\n");

    const result = extractInstallSections(readme);

    expect(result).toContain("## Installation");
    expect(result).toContain("npm install");
  });

  it("excludes unrelated sections", () => {
    const readme = [
      "# My Project",
      "",
      "## License",
      "",
      "MIT License, see LICENSE file.",
      "",
      "## Installation",
      "",
      "Run `npm install`.",
    ].join("\n");

    const result = extractInstallSections(readme);

    expect(result).toContain("## Installation");
    expect(result).not.toContain("## License");
    expect(result).not.toContain("MIT License");
  });

  it("handles an empty README sanely", () => {
    const result = extractInstallSections("");
    expect(result).toBe("");
  });

  it("falls back to a truncated excerpt when no relevant sections exist", () => {
    const readme = ["# My Project", "", "## License", "", "MIT."].join("\n");
    const result = extractInstallSections(readme);
    expect(result).toContain("# My Project");
    expect(result).toContain("## License");
  });

  it("preserves code fences within a captured section", () => {
    const readme = [
      "## Getting Started",
      "",
      "```bash",
      "npm install",
      "npm run dev",
      "```",
    ].join("\n");

    const result = extractInstallSections(readme);

    expect(result).toContain("```bash");
    expect(result).toContain("npm install\nnpm run dev");
    expect(result).toContain("```");
  });

  it("ends a relevant section at the next same-or-higher-level heading", () => {
    const readme = [
      "## Installation",
      "",
      "Step one.",
      "",
      "## Contributing",
      "",
      "Please open a PR.",
    ].join("\n");

    const result = extractInstallSections(readme);

    expect(result).toContain("Step one.");
    expect(result).not.toContain("Please open a PR.");
  });
});

function makeRepoData(overrides: Partial<RepoData> = {}): RepoData {
  return {
    repo: {
      name: "repo",
      fullName: "owner/repo",
      description: "A test repo",
      url: "https://github.com/owner/repo",
      defaultBranch: "main",
      topics: [],
      stars: 0,
      isPrivate: false,
    },
    readme: null,
    languages: [],
    configFiles: {},
    agentPrompt: null,
    ...overrides,
  };
}

describe("generateInstallPrompt", () => {
  it("uses the agent prompt directly when present", () => {
    const data = makeRepoData({
      agentPrompt: { content: "Do the install thing.", source: "AGENTS.md" },
    });

    const result = generateInstallPrompt(data);

    expect(result).toContain("owner/repo");
    expect(result).toContain("`AGENTS.md`");
    expect(result).toContain("Do the install thing.");
  });

  it("builds a prompt from README install content when there is no agent prompt", () => {
    const data = makeRepoData({
      readme: "## Installation\n\nRun `npm install`.",
    });

    const result = generateInstallPrompt(data);

    expect(result).toContain("## Installation Instructions (from README)");
    expect(result).toContain("npm install");
    expect(result).toContain("## Your Task");
  });
});

describe("generateEmbedMarkdown", () => {
  it("assembles a markdown badge and details block containing the prompt", () => {
    const result = generateEmbedMarkdown("https://github.com/owner/repo", "my prompt text");

    expect(result).toContain("## AI-Powered Installation");
    expect(result).toContain(encodeURIComponent("https://github.com/owner/repo"));
    expect(result).toContain("my prompt text");
    expect(result).toContain("<details>");
  });
});
