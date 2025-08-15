"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CustomizePage() {
  const router = useRouter();
  return (
    <div style={styles.safe as React.CSSProperties}>
      <div style={styles.headerWrap as React.CSSProperties}>
        <div style={styles.headerRow as React.CSSProperties}>
          <button onClick={() => router.push("/create-event")} aria-label="Back" style={styles.back as React.CSSProperties}>‹</button>
          <h1 style={styles.headerTitle as React.CSSProperties}>Step 1 of 5: Customize</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={styles.progress as React.CSSProperties} />
      </div>

      <div style={styles.posterWrap as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1520975940462-3724a3b4d66a?w=900"
          alt="Poster"
          style={styles.poster as React.CSSProperties}
        />
        <button style={styles.editPill as React.CSSProperties} aria-label="Edit poster">✎</button>

        <div style={{ ...styles.dash, top: 110, height: 36 }} />
        <div style={{ ...styles.dash, top: 200, height: 70 }} />
        <div style={{ ...styles.dash, top: 310, height: 36 }} />
      </div>

      <button style={styles.cta as React.CSSProperties} onClick={() => router.push("/create-event/details")}>
        <span style={styles.ctaText as React.CSSProperties}>Next: Event Details</span>
      </button>
    </div>
  );
}

const COLORS = { primary: "#2E1760", bg: "#FFFFFF", progress: "#16a34a" } as const;

const styles = {
  safe: { minHeight: "100vh", backgroundColor: COLORS.bg, padding: 16 },
  headerWrap: {},
  headerRow: { display: "flex", alignItems: "center", gap: 8 },
  back: { fontSize: 28 as const, color: "#111827", background: "transparent", border: 0, cursor: "pointer" },
  headerTitle: { fontSize: 24, fontWeight: 800 as const, color: "#111827", margin: 0 },
  progress: { height: 3, backgroundColor: COLORS.progress, width: "20%", marginTop: 8 },

  posterWrap: { position: "relative" as const, width: 320, height: 480, margin: "20px auto 0" },
  poster: { width: "100%", height: "100%", borderRadius: 8, objectFit: "cover" as const },
  editPill: { position: "absolute" as const, right: 10, top: 10, backgroundColor: COLORS.primary, width: 34, height: 34, borderRadius: 8, color: "#fff", display: "grid", placeItems: "center", border: 0, cursor: "pointer" },
  dash: { position: "absolute" as const, left: 24, right: 24, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#60A5FA", borderRadius: 6 },

  cta: { marginTop: 24, height: 56, borderRadius: 12, backgroundColor: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 640, marginInline: "auto", border: 0, cursor: "pointer" },
  ctaText: { color: "#fff", fontWeight: 700 as const, fontSize: 16 },
} as const;


