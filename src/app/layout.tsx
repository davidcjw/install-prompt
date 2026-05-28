import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Install Any Repo with AI",
  description:
    "Paste a GitHub URL and get a ready-to-use prompt for Claude, ChatGPT, or any AI assistant to install the repo for you automatically.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Install Any Repo with AI",
    description:
      "Turn any GitHub README into an AI installation prompt. Works with Claude, ChatGPT, Gemini, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
