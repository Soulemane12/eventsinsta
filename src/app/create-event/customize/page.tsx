"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomizePage() {
  const router = useRouter();

  // Editable fields (you can persist these later)
  const [titleTop, setTitleTop] = useState("Join us for our annual");
  const [titleMain, setTitleMain] = useState("Parish Feast\nGet-Together");
  const [titleBottom, setTitleBottom] = useState("Dec 6, 2023 | 11:30 am\nA5 Villa, Kochi");

  // optional: focus top field when pencil is pressed
  const editRef = useRef<HTMLDivElement | null>(null);

  return (
    <div style={styles.safe as React.CSSProperties}>
      {/* Header */}
      <div style={styles.headerWrap as React.CSSProperties}>
        <div style={styles.headerRow as React.CSSProperties}>
          <button
            onClick={() => router.push("/create-event")}
            aria-label="Back"
            style={styles.back as React.CSSProperties}
          >
            ‹
          </button>
          <h1 style={styles.headerTitle as React.CSSProperties}>1 of 5: Customize</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={styles.progress as React.CSSProperties} />
      </div>

      {/* Poster */}
      <div style={styles.posterCard as React.CSSProperties}>
        <div style={styles.poster as React.CSSProperties}>
          <div style={styles.flagPattern} />
          <div style={styles.paintStroke} />
          {/* static preview text (sits under the editable boxes) */}
          <div style={styles.eventContent}>
            <div style={styles.topText}>{titleTop}</div>
            <div style={styles.mainTitle}>
              {titleMain.split("\n").map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
            <div style={styles.bottomText}>
              {titleBottom.split("\n").map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Pencil */}
        <button
          style={styles.editPill as React.CSSProperties}
          aria-label="Edit poster"
          onClick={() => editRef.current?.focus()}
        >
          ✎
        </button>

        {/* Editable overlays */}
        <EditableBox
          top={110}
          height={36}
          initial={titleTop}
          onChange={setTitleTop}
          align="center"
          fontSize={14}
          fontWeight={600}
        />
        <EditableBox
          top={200}
          height={90}
          initial={titleMain}
          onChange={setTitleMain}
          align="center"
          fontSize={28}
          lineHeight="32px"
          refEl={editRef}
          multiline
        />
        <EditableBox
          top={310}
          height={40}
          initial={titleBottom}
          onChange={setTitleBottom}
          align="center"
          fontSize={14}
          fontWeight={600}
          multiline
        />
      </div>

      {/* CTA */}
      <button
        style={styles.cta as React.CSSProperties}
        onClick={() => router.push("/create-event/details")}
      >
        <span style={styles.ctaText as React.CSSProperties}>Next: Event Details</span>
      </button>
    </div>
  );
}

/* ---------------- Editable dashed box ---------------- */

type BoxProps = {
  top: number;
  height: number;
  initial: string;
  onChange: (v: string) => void;
  align?: "left" | "center";
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: string;
  multiline?: boolean;
  refEl?: React.RefObject<HTMLDivElement | null>;
};

function EditableBox({
  top,
  height,
  initial,
  onChange,
  align = "center",
  fontSize = 16,
  fontWeight = 500,
  lineHeight,
  multiline,
  refEl,
}: BoxProps) {
  return (
    <div
      style={{
        ...styles.dash,
        top,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        background: "rgba(255,255,255,0.08)",
        borderColor: "#3B82F6",
      }}
    >
      <div
        ref={refEl as any}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Edit text"
        onInput={(e) => onChange((e.target as HTMLDivElement).innerText)}
        style={{
          padding: "6px 10px",
          outline: "none",
          minWidth: 120,
          textAlign: align,
          fontSize,
          fontWeight,
          lineHeight: lineHeight ?? (multiline ? "20px" : "18px"),
          color: "#1F2937",
          whiteSpace: "pre-wrap",
        }}
        // set initial text
        dangerouslySetInnerHTML={{ __html: initial.replace(/\n/g, "<br/>") }}
      />
    </div>
  );
}

/* ---------------- Styles ---------------- */

const COLORS = { primary: "#2E1760", bg: "#FFFFFF", progress: "#16a34a" } as const;

const styles = {
  safe: {
    minHeight: "100vh",
    backgroundColor: COLORS.bg,
    padding: 16,
    display: "flex",
    flexDirection: "column",
  },

  headerWrap: { marginBottom: 8 },
  headerRow: { display: "flex", alignItems: "center", gap: 8 },
  back: {
    fontSize: 28 as const,
    color: "#111827",
    background: "transparent",
    border: 0,
    cursor: "pointer",
    lineHeight: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: 800 as const, color: "#111827", margin: 0 },
  progress: {
    height: 3,
    backgroundColor: COLORS.progress,
    width: "20%", // Step 1 of 5
    marginTop: 8,
    borderRadius: 2,
  },

  posterCard: {
    position: "relative" as const,
    width: 320,
    height: 480,
    margin: "16px auto 0",
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  poster: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    background: "linear-gradient(135deg, #CFE8EC 0%, #A6D5D9 100%)",
    position: "relative" as const,
    overflow: "hidden",
  },

  flagPattern: {
    position: "absolute" as const,
    bottom: 10,
    right: 0,
    left: 0,
    height: 90,
    background:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0 16px, transparent 16px 32px)",
    opacity: 0.7,
  },

  paintStroke: {
    position: "absolute" as const,
    top: "52%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    height: 360,
    background:
      "radial-gradient(closest-side, rgba(255,255,255,0.98), rgba(255,255,255,0.92) 65%, rgba(255,255,255,0) 70%)",
    borderRadius: "50%",
  },

  eventContent: {
    position: "absolute" as const,
    top: "52%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "86%",
    textAlign: "center" as const,
    color: "#5B6570",
    zIndex: 1,
    pointerEvents: "none", // actual editing happens in overlays
  },
  topText: { fontSize: 14, marginBottom: 8 },
  mainTitle: { fontSize: 28, fontWeight: 700 as const, lineHeight: "32px", marginBottom: 12 },
  bottomText: { fontSize: 12, lineHeight: "16px" },

  editPill: {
    position: "absolute" as const,
    right: 12,
    top: 12,
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 8,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    border: 0,
    cursor: "pointer",
    zIndex: 3,
  },

  dash: {
    position: "absolute" as const,
    left: 24,
    right: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 6,
    zIndex: 2,
  },

  cta: {
    marginTop: 24,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 640,
    marginInline: "auto",
    border: 0,
    cursor: "pointer",
  },
  ctaText: { color: "#fff", fontWeight: 700 as const, fontSize: 16 },
} as const;


