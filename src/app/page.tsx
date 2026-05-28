"use client";

import { useState, useEffect, useRef } from "react";

interface RepoMeta {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  languages: string[];
  stars: number;
}

interface AnalyzeResult {
  prompt: string;
  embedMarkdown: string;
  agentSource: string | null;
  repo: RepoMeta;
}

type CopyState = "idle" | "copied";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setState("copied");
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-150"
    >
      {state === "copied" ? (
        <span className="text-emerald-400">Copied!</span>
      ) : (
        label
      )}
    </button>
  );
}

function RepoCard({ repo }: { repo: RepoMeta }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white hover:text-violet-300 transition-colors"
          >
            {repo.fullName} ↗
          </a>
          <span className="text-xs text-white/50">★ {repo.stars.toLocaleString()}</span>
        </div>
        {repo.description && (
          <p className="text-sm text-white/60 mt-1 line-clamp-2">{repo.description}</p>
        )}
        {repo.languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {repo.languages.map((lang) => (
              <span
                key={lang}
                className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30"
              >
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OutputSection({
  title,
  content,
  copyLabel,
  defaultOpen = true,
}: {
  title: string;
  content: string;
  copyLabel: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-white/90">{title}</span>
        <div className="flex items-center gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <CopyButton text={content} label={copyLabel} />
          </div>
          <span className="text-white/40 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10">
          <pre className="p-4 text-xs leading-relaxed overflow-auto max-h-[460px] whitespace-pre-wrap break-words font-mono text-white/70">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) setUrl(repoParam);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const exampleRepos = [
    "https://github.com/vercel/next.js",
    "https://github.com/fastapi/fastapi",
    "https://github.com/django/django",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
            Built for the agentic era
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
              Install Any Repo
            </span>
            <br />
            <span className="bg-gradient-to-br from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-md mx-auto">
            Paste a GitHub URL and get a ready-to-use prompt for Claude, ChatGPT, or any AI
            assistant — so it can install the repo for you automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                ⌥
              </div>
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500/60 transition-all"
                disabled={loading}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all duration-150 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Analyzing…
                </span>
              ) : (
                "Generate Prompt"
              )}
            </button>
          </div>
        </form>

        {!result && !error && !loading && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-white/30 mb-10">
            <span>Try:</span>
            {exampleRepos.map((repo) => {
              const short = repo.replace("https://github.com/", "");
              return (
                <button
                  key={repo}
                  onClick={() => setUrl(repo)}
                  className="hover:text-violet-400 transition-colors underline underline-offset-2"
                >
                  {short}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <RepoCard repo={result.repo} />

            {result.agentSource ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <span>✓</span>
                <span>
                  Found existing AI agent instructions in{" "}
                  <code className="font-mono bg-emerald-500/20 px-1 rounded">{result.agentSource}</code>
                  {" "}— used directly.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs">
                <span>↻</span>
                <span>No agent instructions file found — prompt generated from README &amp; config files.</span>
              </div>
            )}

            <OutputSection
              title="AI Installation Prompt"
              content={result.prompt}
              copyLabel="Copy Prompt"
              defaultOpen={true}
            />

            <OutputSection
              title="README Embed Snippet"
              content={result.embedMarkdown}
              copyLabel="Copy Markdown"
              defaultOpen={false}
            />

            <p className="text-xs text-white/30 text-center pt-2">
              Paste the prompt into Claude, ChatGPT, Gemini, or any AI assistant.
              <br />
              Add the embed snippet to your README so others can do the same.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 py-4 text-center text-white/20 text-xs">
        Open source ·{" "}
        <a
          href="https://github.com/davidcjw/install-prompt"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/50 transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
