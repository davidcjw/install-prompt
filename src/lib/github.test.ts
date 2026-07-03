import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AGENT_FILES,
  fetchAgentPrompt,
  getRelevantConfigFiles,
  parseGitHubUrl,
} from "./github";

function contentsResponse(content: string): Response {
  return new Response(
    JSON.stringify({ content: Buffer.from(content).toString("base64"), encoding: "base64" }),
    { status: 200 }
  );
}

function notFoundResponse(): Response {
  return new Response(null, { status: 404 });
}

/** Mocks fetch so only the given repo-relative paths resolve to content. */
function mockFetchForPaths(available: Record<string, string>) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      const match = Object.keys(available).find((path) => url.includes(`/contents/${path}?`));
      if (match) return Promise.resolve(contentsResponse(available[match]));
      return Promise.resolve(notFoundResponse());
    })
  );
}

describe("parseGitHubUrl", () => {
  it("parses a standard github.com repo URL", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("returns null for a non-github host", () => {
    expect(parseGitHubUrl("https://gitlab.com/vercel/next.js")).toBeNull();
  });

  it("returns null for a malformed URL", () => {
    expect(parseGitHubUrl("not a url")).toBeNull();
  });
});

describe("agent-file precedence", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("declares the documented priority order, first match wins", () => {
    expect(AGENT_FILES.slice(0, 8)).toEqual([
      "AGENTS.md",
      "AGENT.md",
      "CLAUDE.md",
      ".claude/CLAUDE.md",
      "llms.txt",
      ".cursorrules",
      ".github/copilot-instructions.md",
      "COPILOT.md",
    ]);
  });

  it("prefers AGENTS.md over every lower-priority file", () => {
    mockFetchForPaths({
      "AGENTS.md": "top priority",
      "AGENT.md": "should be ignored",
      "CLAUDE.md": "should be ignored",
      "llms.txt": "should be ignored",
    });

    return fetchAgentPrompt("owner", "repo", "main").then((result) => {
      expect(result).toEqual({ content: "top priority", source: "AGENTS.md" });
    });
  });

  it("falls back to CLAUDE.md when AGENTS.md and AGENT.md are absent", () => {
    mockFetchForPaths({
      "CLAUDE.md": "claude instructions",
      "llms.txt": "should be ignored",
      "COPILOT.md": "should be ignored",
    });

    return fetchAgentPrompt("owner", "repo", "main").then((result) => {
      expect(result).toEqual({ content: "claude instructions", source: "CLAUDE.md" });
    });
  });

  it("falls back to a low-priority custom file when nothing higher-priority exists", () => {
    const last = AGENT_FILES[AGENT_FILES.length - 1];
    mockFetchForPaths({ [last]: "custom instructions" });

    return fetchAgentPrompt("owner", "repo", "main").then((result) => {
      expect(result).toEqual({ content: "custom instructions", source: last });
    });
  });

  it("returns null when no agent file exists in the repo", () => {
    mockFetchForPaths({});

    return fetchAgentPrompt("owner", "repo", "main").then((result) => {
      expect(result).toBeNull();
    });
  });
});

describe("getRelevantConfigFiles (tech-stack detection)", () => {
  it("always includes universal config files", () => {
    const files = getRelevantConfigFiles([]);
    expect(files).toContain("Makefile");
    expect(files).toContain("docker-compose.yml");
    expect(files).toContain(".env.example");
  });

  it("adds package.json for JavaScript/TypeScript repos", () => {
    const files = getRelevantConfigFiles(["TypeScript", "JavaScript"]);
    expect(files).toContain("package.json");
  });

  it("adds Python config files for Python repos", () => {
    const files = getRelevantConfigFiles(["Python"]);
    expect(files).toContain("requirements.txt");
    expect(files).toContain("pyproject.toml");
  });

  it("adds go.mod for Go repos and omits unrelated language files", () => {
    const files = getRelevantConfigFiles(["Go"]);
    expect(files).toContain("go.mod");
    expect(files).not.toContain("package.json");
    expect(files).not.toContain("Gemfile");
  });

  it("deduplicates file names", () => {
    const files = getRelevantConfigFiles(["JavaScript", "TypeScript"]);
    expect(files.filter((f) => f === "package.json")).toHaveLength(1);
  });
});
