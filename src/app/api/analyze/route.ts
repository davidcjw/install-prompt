import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUrl, fetchRepoData } from "@/lib/github";
import { generateInstallPrompt, generateEmbedMarkdown } from "@/lib/prompt";

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing required field: url" }, { status: 400 });
  }

  const parsed = parseGitHubUrl(url.trim());
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid GitHub URL. Please enter a URL like https://github.com/owner/repo" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchRepoData(parsed.owner, parsed.repo);
    const prompt = generateInstallPrompt(data);
    const embedMarkdown = generateEmbedMarkdown(url.trim(), prompt);

    return NextResponse.json({
      prompt,
      embedMarkdown,
      agentSource: data.agentPrompt?.source ?? null,
      repo: {
        name: data.repo.name,
        fullName: data.repo.fullName,
        description: data.repo.description,
        url: data.repo.url,
        languages: data.languages,
        stars: data.repo.stars,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message === "RATE_LIMITED" || message.startsWith("RATE_LIMITED:")) {
      const mins = message.split(":")[1];
      const wait = mins ? ` Try again in ~${mins} min` : " Please try again shortly";
      return NextResponse.json(
        {
          error:
            `GitHub API rate limit reached.${wait}, or set a GITHUB_TOKEN to raise the limit to 5,000 requests/hr.`,
        },
        { status: 429 }
      );
    }

    if (message === "REPO_PRIVATE") {
      return NextResponse.json(
        {
          error:
            "Oops, this repo is private! This tool only works with public repositories. Make your repo public or use a personal access token.",
        },
        { status: 403 }
      );
    }

    if (message === "REPO_NOT_FOUND") {
      return NextResponse.json(
        {
          error:
            "Repository not found. Double-check the URL and make sure the repo exists and is public.",
        },
        { status: 404 }
      );
    }

    console.error("Analyze error:", message);
    return NextResponse.json(
      { error: "Failed to analyze repository. Please try again." },
      { status: 500 }
    );
  }
}
