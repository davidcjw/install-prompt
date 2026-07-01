"use client";

import { useState, useEffect, useRef } from "react";
import {
  DisplayHeading,
  Mono,
  Tag,
  Button,
  HairlineRule,
} from "stripe-ds";
import { GitHubStarButton } from "./GitHubStarButton";

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
    <button type="button" onClick={handleCopy} className="ip-ctl">
      {state === "copied" ? "Copied ✓" : label}
    </button>
  );
}

function RepoCard({ repo }: { repo: RepoMeta }) {
  return (
    <div className="ip-panel ip-panel--filled p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <a href={repo.url} target="_blank" rel="noopener noreferrer">
          <Mono size="body" weight="medium">
            {repo.fullName} ↗
          </Mono>
        </a>
        <Mono size="micro" tone="muted">
          ★ {repo.stars.toLocaleString()}
        </Mono>
      </div>
      {repo.description && (
        <Mono as="p" size="mono" tone="muted" className="mt-2 line-clamp-2">
          {repo.description}
        </Mono>
      )}
      {repo.languages.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {repo.languages.map((lang) => (
            <Tag key={lang}>{lang}</Tag>
          ))}
        </div>
      )}
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
    <div className="ip-panel overflow-hidden">
      <div className="ip-panel__head" onClick={() => setOpen(!open)}>
        <Mono size="mono" weight="medium" caps>
          {title}
        </Mono>
        <div className="flex items-center gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <CopyButton text={content} label={copyLabel} />
          </div>
          <Mono size="micro" tone="muted">
            {open ? "[ − ]" : "[ + ]"}
          </Mono>
        </div>
      </div>
      {open && (
        <div className="ip-panel__body">
          <pre className="ip-pre">{content}</pre>
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
    // Prefill from the ?repo= query param on mount. Reading window.location must
    // happen client-side in an effect to avoid a hydration mismatch on the input.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="relative flex-1 flex flex-col">
      <div className="ip-grid-bg fixed inset-0 pointer-events-none opacity-60" />

      {/* top nav */}
      <header className="relative">
        <div className="flex items-center gap-3 px-5 sm:px-8 py-4">
          <Mono size="mono" weight="medium">
            install-prompt
          </Mono>
          <HairlineRule vertical />
          <Mono size="micro" tone="muted" caps className="hidden sm:inline">
            github → ai prompt
          </Mono>
          <div className="ml-auto">
            <GitHubStarButton />
          </div>
        </div>
        <HairlineRule />
      </header>

      <main className="relative w-full max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-20 flex-1">
        {/* hero */}
        <div className="mb-10">
          <div className="mb-6">
            <Tag>● Built for the agentic era</Tag>
          </div>
          <DisplayHeading level="hero" marker="AI">
            Install any repo
          </DisplayHeading>
          <Mono as="p" size="body" tone="muted" className="mt-5 max-w-md">
            Paste a GitHub URL and get a ready-to-use prompt for Claude, ChatGPT,
            or any AI assistant — so it can install the repo for you
            automatically.
          </Mono>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mono size="mono" tone="muted">
                  /
                </Mono>
              </span>
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="github.com/owner/repo"
                className="ip-input"
                style={{ paddingLeft: 30 }}
                disabled={loading}
                autoFocus
              />
            </div>
            <Button
              variant="primary"
              as="button"
              type="submit"
              disabled={loading || !url.trim()}
              style={
                loading || !url.trim()
                  ? { opacity: 0.4, cursor: "not-allowed" }
                  : undefined
              }
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="ip-spin" />
                  Analyzing
                </span>
              ) : (
                "Generate prompt"
              )}
            </Button>
          </div>
        </form>

        {!result && !error && !loading && (
          <div className="flex items-center gap-2 flex-wrap mb-10">
            <Mono size="micro" tone="muted" caps>
              Try
            </Mono>
            {exampleRepos.map((repo) => {
              const short = repo.replace("https://github.com/", "");
              return (
                <button
                  key={repo}
                  type="button"
                  onClick={() => setUrl(repo)}
                  className="ip-ctl"
                  style={{ textTransform: "none" }}
                >
                  {short}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div className="ip-panel ip-panel--filled p-4 mb-6">
            <Mono size="mono" className="ip-blink">
              ✗ {error}
            </Mono>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <RepoCard repo={result.repo} />

            <div className="ip-panel p-3">
              {result.agentSource ? (
                <Mono size="mono" tone="muted">
                  ✓ Found existing AI agent instructions in{" "}
                  <Mono size="mono" weight="medium">
                    {result.agentSource}
                  </Mono>{" "}
                  — used directly.
                </Mono>
              ) : (
                <Mono size="mono" tone="muted">
                  ↻ No agent instructions file found — prompt generated from
                  README &amp; config files.
                </Mono>
              )}
            </div>

            <OutputSection
              title="AI Installation Prompt"
              content={result.prompt}
              copyLabel="Copy prompt"
              defaultOpen={true}
            />

            <OutputSection
              title="README Embed Snippet"
              content={result.embedMarkdown}
              copyLabel="Copy markdown"
              defaultOpen={false}
            />

            <Mono as="p" size="micro" tone="muted" className="text-center pt-2">
              Paste the prompt into Claude, ChatGPT, Gemini, or any AI assistant.
              Add the embed snippet to your README so others can do the same.
            </Mono>
          </div>
        )}
      </main>

      {/* footer */}
      <footer className="relative mt-auto">
        <HairlineRule />
        <div className="flex items-center justify-center gap-2 px-5 py-5">
          <Mono size="micro" tone="muted" caps>
            Open source
          </Mono>
          <HairlineRule vertical />
          <a
            href="https://github.com/davidcjw/install-prompt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mono size="micro" tone="muted" caps>
              View on GitHub ↗
            </Mono>
          </a>
        </div>
      </footer>
    </div>
  );
}
