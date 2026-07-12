"use client";

import { useState } from "react";

export function Favicon({ domain, name }: { domain: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontSize: "1rem", fontWeight: 600, color: "var(--fg-muted)",
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: "var(--bg-secondary)",
      border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
    }}>
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={name}
        style={{ width: 22, height: 22 }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function ScreenshotBanner({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span style={{ fontSize: "3rem", fontWeight: 700, color: "var(--fg-subtle)", opacity: 0.3 }}>
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={`https://image.thum.io/get/width/600/crop/800/${url}`}
      alt={`${name} screenshot`}
      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
      onError={() => setFailed(true)}
    />
  );
}
