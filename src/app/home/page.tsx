"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const userName = "Jared";

  return (
    <div style={styles.safe as React.CSSProperties}>
      <div style={styles.scroll as React.CSSProperties}>
        <div style={styles.container as React.CSSProperties}>
          <h1 style={styles.h1 as React.CSSProperties}>Hello {userName}!</h1>

          <div style={styles.heroCard as React.CSSProperties}>
            <p style={styles.heroText as React.CSSProperties}>
              Now that you are all set.
              <br />
              Let’s make your events extraordinary,
              <br />
              starting right here!
            </p>
            <button
              type="button"
              onClick={() => router.push("/create-event")}
              style={styles.heroBtn as React.CSSProperties}
            >
              <span style={styles.heroBtnText as React.CSSProperties}>Plan an Event</span>
            </button>
          </div>

          <h2 style={styles.sectionTitle as React.CSSProperties}>Invitations</h2>
          <div style={styles.row as React.CSSProperties}>
            <div style={styles.ovalIcon as React.CSSProperties}><span style={styles.ovalEmoji as React.CSSProperties}>📨</span></div>
            <div style={{ flex: 1 }}>
              <div style={styles.itemTitle as React.CSSProperties}>No Invitations</div>
              <div style={styles.itemBody as React.CSSProperties}>
                No invitations received? Take charge and plan your own event with EventJoy. It’s easy and fun!
              </div>
            </div>
          </div>

          <h2 style={{ ...(styles.sectionTitle as React.CSSProperties), marginTop: 24 }}>Upcoming Events</h2>
          <div style={styles.row as React.CSSProperties}>
            <div style={styles.ovalIcon as React.CSSProperties}><span style={styles.ovalEmoji as React.CSSProperties}>📅</span></div>
            <div style={{ flex: 1 }}>
              <div style={styles.itemTitle as React.CSSProperties}>No Events</div>
              <div style={styles.itemBody as React.CSSProperties}>
                Your event calendar is a blank canvas. Use EventJoy to paint it with memorable moments.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tabs as React.CSSProperties}>
        <TabIcon glyph="🏠" onClick={() => router.push("/home")} />
        <TabIcon glyph="➕" onClick={() => router.push("/create-event")} />
        <TabIcon glyph="👤" onClick={() => {}} />
      </div>
    </div>
  );
}

function TabIcon({ glyph, onClick }: { glyph: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={styles.tabButton as React.CSSProperties}>
      <span style={styles.tabGlyph as React.CSSProperties}>{glyph}</span>
    </button>
  );
}

const COLORS = {
  bg: "#F7F7FA",
  text: "#0B0B0B",
  sub: "#6B7280",
  primary: "#2E1760",
  card: "#6f57a0",
  tabBg: "#2E1760",
  white: "#FFFFFF",
};

const styles = {
  safe: { minHeight: "100vh", backgroundColor: COLORS.bg, position: "relative" as const },
  scroll: { paddingBottom: 120 },
  container: { padding: 24, maxWidth: 720, margin: "0 auto" },
  h1: { fontSize: 28, fontWeight: 800, color: COLORS.text, marginBottom: 16 },
  heroCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 20 },
  heroText: { color: COLORS.white, fontSize: 16, lineHeight: "22px", marginBottom: 16 },
  heroBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start" as const,
    paddingInline: 18,
    border: 0,
    color: "#fff",
    cursor: "pointer",
    display: "inline-flex",
  },
  heroBtnText: { color: "#fff", fontWeight: 700, fontSize: 16 },

  sectionTitle: { fontSize: 22, fontWeight: 800, color: COLORS.text, marginTop: 28, marginBottom: 12 },
  row: { display: "flex", gap: 16, alignItems: "flex-start" },

  ovalIcon: {
    width: 96,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
    display: "flex",
  },
  ovalEmoji: { fontSize: 28 },
  itemTitle: { fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 6 },
  itemBody: { color: COLORS.sub, lineHeight: "20px" },

  tabs: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: COLORS.tabBg,
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabButton: { width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: 0, cursor: "pointer" },
  tabGlyph: { fontSize: 26, color: "#fff" },
} as const;

 


