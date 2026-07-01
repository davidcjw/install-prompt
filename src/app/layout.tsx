import type { Metadata } from "next";
import "stripe-ds/styles.css";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://install-prompt.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Install Any Repo with AI",
  description:
    "Paste a GitHub URL and get a ready-to-use prompt for Claude, ChatGPT, or any AI assistant to install the repo for you automatically.",
  keywords: [
    "AI install prompt",
    "GitHub repo installer",
    "Claude",
    "ChatGPT",
    "AI agent",
    "developer tools",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Install Any Repo with AI",
    description:
      "Turn any GitHub README into an AI installation prompt. Works with Claude, ChatGPT, Gemini, and more.",
    url: "/",
    siteName: "Install Any Repo with AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Install Any Repo with AI",
    description:
      "Turn any GitHub README into an AI installation prompt. Works with Claude, ChatGPT, Gemini, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="sd-surface min-h-full flex flex-col">{children}</body>
    </html>
  );
}
