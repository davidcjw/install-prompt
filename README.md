# Install Any Repo with AI

Turn any public GitHub repository into a ready-to-use AI installation prompt.

Paste a GitHub URL → get a structured prompt you can drop into Claude, ChatGPT, Gemini, or any AI assistant to have it install the repo for you.

## Features

- Smartly extracts only installation-relevant sections from READMEs
- Detects tech stack and fetches relevant config files (package.json, requirements.txt, go.mod, etc.)
- Outputs a structured prompt + a Markdown embed snippet for READMEs
- Pre-fill via `?repo=<github-url>` query param

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | No | GitHub PAT for higher rate limits (5000/hr vs 60/hr) |
| `NEXT_PUBLIC_APP_URL` | No | Your deployed URL (for embed badge links) |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- GitHub REST API
