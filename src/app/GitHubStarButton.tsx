"use client";

import { useEffect, useState } from "react";
import { Button } from "stripe-ds";

const REPO = "davidcjw/install-prompt";

/**
 * "Star on GitHub" call-to-action. Renders a stripe-ds Button linking to the
 * repo and lazily hydrates the live star count from the public GitHub API
 * (best-effort — silently omits the count if the request is rate-limited).
 */
export function GitHubStarButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d && typeof d.stargazers_count === "number") {
          setStars(d.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <Button
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      ★ Star{stars != null ? ` · ${stars.toLocaleString()}` : ""}
    </Button>
  );
}
