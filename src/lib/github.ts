const GITHUB_API = "https://api.github.com";

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "install-prompt-app",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function ghFetch(path: string): Promise<Response> {
  return fetch(`${GITHUB_API}${path}`, { headers: getHeaders() });
}

export interface RepoInfo {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  defaultBranch: string;
  topics: string[];
  stars: number;
  isPrivate: boolean;
}

export interface RepoData {
  repo: RepoInfo;
  readme: string | null;
  languages: string[];
  configFiles: Record<string, string>;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    if (!["github.com", "www.github.com"].includes(u.hostname)) return null;
    const parts = u.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (parts.length < 2 || !parts[0] || !parts[1]) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

export async function fetchRepoData(owner: string, repo: string): Promise<RepoData> {
  // Fetch repo metadata
  const repoRes = await ghFetch(`/repos/${owner}/${repo}`);

  if (repoRes.status === 404) {
    throw new Error("REPO_NOT_FOUND");
  }
  if (repoRes.status === 403) {
    throw new Error("REPO_PRIVATE");
  }
  if (!repoRes.ok) {
    throw new Error(`GitHub API error: ${repoRes.status}`);
  }

  const repoJson = await repoRes.json();

  if (repoJson.private) {
    throw new Error("REPO_PRIVATE");
  }

  const repoInfo: RepoInfo = {
    name: repoJson.name,
    fullName: repoJson.full_name,
    description: repoJson.description,
    url: repoJson.html_url,
    defaultBranch: repoJson.default_branch,
    topics: repoJson.topics || [],
    stars: repoJson.stargazers_count,
    isPrivate: repoJson.private,
  };

  // Fetch in parallel: README + languages
  const [readmeResult, languagesResult] = await Promise.allSettled([
    fetchReadme(owner, repo),
    fetchLanguages(owner, repo),
  ]);

  const readme = readmeResult.status === "fulfilled" ? readmeResult.value : null;
  const languages = languagesResult.status === "fulfilled" ? languagesResult.value : [];

  // Determine which config files to fetch based on languages
  const configFilesToFetch = getRelevantConfigFiles(languages);

  // Fetch config files in parallel
  const configEntries = await Promise.allSettled(
    configFilesToFetch.map((f) => fetchFile(owner, repo, f, repoInfo.defaultBranch))
  );

  const configFiles: Record<string, string> = {};
  configFilesToFetch.forEach((filename, i) => {
    const result = configEntries[i];
    if (result.status === "fulfilled" && result.value) {
      configFiles[filename] = result.value;
    }
  });

  return { repo: repoInfo, readme, languages, configFiles };
}

async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  const res = await ghFetch(`/repos/${owner}/${repo}/readme`);
  if (!res.ok) return null;
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  // Cap at 12KB to avoid huge READMEs flooding the prompt
  return content.length > 12000 ? content.slice(0, 12000) + "\n\n[...README truncated...]" : content;
}

async function fetchLanguages(owner: string, repo: string): Promise<string[]> {
  const res = await ghFetch(`/repos/${owner}/${repo}/languages`);
  if (!res.ok) return [];
  const json = await res.json();
  // Sort by byte count, return top languages
  return Object.entries(json)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 8)
    .map(([lang]) => lang);
}

async function fetchFile(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<string | null> {
  const res = await ghFetch(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
  if (!res.ok) return null;
  const json = await res.json();
  if (json.encoding !== "base64") return null;
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  // Cap individual config files at 4KB
  return content.length > 4000 ? content.slice(0, 4000) + "\n[...truncated...]" : content;
}

function getRelevantConfigFiles(languages: string[]): string[] {
  const files: string[] = [];
  const langSet = new Set(languages.map((l) => l.toLowerCase()));

  // Always check for these
  const universal = ["Makefile", "docker-compose.yml", "docker-compose.yaml", ".env.example", ".env.sample"];
  files.push(...universal);

  if (langSet.has("javascript") || langSet.has("typescript")) {
    files.push("package.json");
  }
  if (langSet.has("python")) {
    files.push("requirements.txt", "pyproject.toml", "setup.py", "setup.cfg", "Pipfile");
  }
  if (langSet.has("ruby")) {
    files.push("Gemfile");
  }
  if (langSet.has("go")) {
    files.push("go.mod");
  }
  if (langSet.has("rust")) {
    files.push("Cargo.toml");
  }
  if (langSet.has("java") || langSet.has("kotlin") || langSet.has("scala")) {
    files.push("pom.xml", "build.gradle", "build.gradle.kts");
  }
  if (langSet.has("php")) {
    files.push("composer.json");
  }
  if (langSet.has("c#") || langSet.has("f#") || langSet.has("vb")) {
    files.push("*.csproj", "NuGet.config");
  }
  if (langSet.has("elixir")) {
    files.push("mix.exs");
  }
  if (langSet.has("haskell")) {
    files.push("cabal.project", "stack.yaml");
  }

  // Deduplicate
  return [...new Set(files)];
}
