# Install Any Repo with AI

**Live:** https://install-prompt.vercel.app

Turn any public GitHub repository into a ready-to-use AI installation prompt. Paste a GitHub URL → get a structured prompt you can drop into Claude, ChatGPT, Gemini, or any AI assistant to have it install the repo for you automatically.

## How it works

1. Checks for a dedicated agent instructions file in the repo (see [Agent files](#agent-files)). If found, uses it directly.
2. Otherwise, extracts installation-relevant sections from the README (headings like "Getting Started", "Setup", "Prerequisites", etc.) and fetches relevant config files based on the detected tech stack.
3. Assembles everything into a structured prompt + a Markdown embed snippet you can drop into your own README.

## Agent files

If your repo contains any of the following files, its content is used as the prompt directly — no README parsing needed:

| File | Used by |
|---|---|
| `AGENTS.md` | General convention |
| `AGENT.md` | General convention |
| `CLAUDE.md` | Claude Code |
| `.claude/CLAUDE.md` | Claude Code |
| `llms.txt` | Emerging standard |
| `.cursorrules` | Cursor |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `COPILOT.md` | GitHub Copilot |
| `AI_INSTALL.md` / `INSTALL_AGENT.md` | Custom |

Files are checked in the order listed above; the first match wins.

## README embed

After generating a prompt, the app also gives you a Markdown snippet to paste into your own README:

```markdown
## AI-Powered Installation

[![Install with AI](https://img.shields.io/badge/Install%20with%20AI-8A2BE2?style=for-the-badge&logo=anthropic&logoColor=white)](https://install-prompt.vercel.app?repo=https://github.com/you/your-repo)

<details>
<summary>📋 Click to expand AI Installation Prompt</summary>

... generated prompt ...

</details>
```

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | No | GitHub PAT — raises rate limit from 60 to 5000 req/hr. No scopes needed for public repos. |
| `NEXT_PUBLIC_APP_URL` | No | Your deployed URL, used for badge links in the embed snippet. |

## Design

The UI uses [`stripe-ds`](./vendor/stripe-ds) — a monochrome "developer terminal" design system reverse-extracted from [stripe.dev](https://stripe.dev/): mono type, dotted hairlines, an 8px grid, and light weights on light-grey paper. The compiled package is vendored under `vendor/stripe-ds` (consumed via `file:vendor/stripe-ds`) so it builds on Vercel without a registry.

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- [`stripe-ds`](./vendor/stripe-ds) design system + Tailwind CSS for layout
- GitHub REST API (no LLM on the backend)
