"use client";

import React from "react";

type Props = {
  onStart?: () => void;
  logoSrc?: string;
  heading?: string;
  description?: string;
  buttonLabel?: string;
};

const COLORS = {
  background: "#FFFFFF",
  textPrimary: "#0B0B0B",
  textSecondary: "#444444",
  primary: "#2E1760",
  accent: "#7A2CF3",
};

export default function OnboardingWelcome({
  onStart,
  logoSrc,
  heading = "Event planning made easy",
  description =
    "Choose event type, location, guests, budget get personalized suggestions for a memorable event...",
  buttonLabel = "Start",
}: Props) {
  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.logoWrap as React.CSSProperties}>
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt="EventsInsta logo" style={styles.logo as React.CSSProperties} />
        ) : (
          <div aria-label="EventsInsta logo">
            <div style={styles.wordmark as React.CSSProperties}>EVENTS INSTA</div>
            <div style={styles.tagline as React.CSSProperties}>Plan.Create.Celebrate</div>
          </div>
        )}
      </div>

      <div style={styles.bottom as React.CSSProperties}>
        <div>
          <h1 style={styles.heading as React.CSSProperties}>{heading}</h1>
          <p style={styles.body as React.CSSProperties}>{description}</p>
        </div>

        <button
          type="button"
          onClick={onStart}
          style={styles.cta as React.CSSProperties}
        >
          <span style={styles.ctaText as React.CSSProperties}>{buttonLabel}</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  logoWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 24,
  },
  logo: {
    width: 220,
    height: 220,
    objectFit: "contain",
  },
  wordmark: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 4,
    textAlign: "center" as const,
    color: COLORS.textPrimary,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center" as const,
    color: COLORS.accent,
  },
  bottom: {
    paddingInline: 24,
    paddingTop: 32,
    paddingBottom: 24,
    display: "flex",
    gap: 24,
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    marginTop: "auto",
  },
  heading: {
    fontSize: 28,
    lineHeight: "34px",
    fontWeight: 800,
    color: COLORS.textPrimary,
    margin: 0,
  },
  body: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: "22px",
    color: COLORS.textPrimary,
    opacity: 0.8,
  },
  cta: {
    height: 64,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    border: 0,
    cursor: "pointer",
    display: "flex",
    width: "100%",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: 700,
  },
} as const;


