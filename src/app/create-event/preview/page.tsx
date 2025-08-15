"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => router.back()} style={btnBack}>‹</button>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>3 of 5: Preview</h1>
        </div>
        <div style={{ height: 3, background: "#16a34a", width: "60%", marginTop: 8 }} />

        <div style={{ background: "#fff", borderRadius: 12, padding: 8, boxShadow: "0 4px 10px rgba(0,0,0,0.06)", marginTop: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1520975940462-3724a3b4d66a?w=900" alt="Poster" style={{ width: "100%", height: 220, borderRadius: 8, objectFit: "cover" }} />
          <button style={posterEdit}>✎</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Family Get-Together</h2>
          <button style={editBtn}>✎ Edit Details</button>
        </div>

        <InfoRow icon="📅" text="Wednesday, 6 Dec 2023" />
        <InfoRow icon="⏰" text="11:30 am – 5:00 pm" />
        <a href="#" style={link}>+ Add to Calendar</a>
        <InfoRow icon="📍" text={`“A5 Villa”, Kent Nalukettu,\nnear Udhyan Auditorium, Vennala,\nKochi, Kerala-682028`} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800" alt="Map" style={{ width: "100%", height: 120, borderRadius: 10, margin: "10px 0" }} />

        <h3 style={h3}>Hosted By</h3>
        <div style={body}>Dylan Thomas</div>

        <h3 style={h3}>Event Description</h3>
        <div style={body}>Join us for a joyful celebration of faith, family, and fellowship at our annual Parish Feast Family Get-Together! Let us spend quality time with each other and create new memories that will last a lifetime. We are excited to see you there!</div>

        <h3 style={h3}>Guest List</h3>
        <GuestRow name="Guest Name" count="1 Guest" />
        <GuestRow name="Guest Name" count="2 Guests" />

        <button style={cta} onClick={() => router.push("/create-event/add-guests")}>
          <span style={ctaText}>Next: Add Guests</span>
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "flex-start" }}>
      <span style={{ width: 22, textAlign: "center" }}>{icon}</span>
      <div style={body as React.CSSProperties}>{text}</div>
    </div>
  );
}

function GuestRow({ name, count }: { name: string; count: string }) {
  return (
    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontWeight: 700 }}>{name}</div>
      <div style={{ color: "#16a34a", fontWeight: 700 }}>{count}</div>
    </div>
  );
}

const btnBack = { fontSize: 28, background: "transparent", border: 0, cursor: "pointer" } as const;
const posterEdit = { position: "absolute" as const, right: 18, top: 18, background: "#2E1760", width: 36, height: 36, borderRadius: 8, color: "#fff", display: "grid", placeItems: "center", border: 0 } as const;
const editBtn = { paddingInline: 10, paddingBlock: 6, background: "#E5E7EB", borderRadius: 8, border: 0, cursor: "pointer" } as const;
const link = { color: "#2563EB", textDecoration: "none", display: "inline-block", marginTop: 8 } as const;
const h3 = { fontSize: 16, fontWeight: 800, color: "#0B0B0B", marginTop: 16, marginBottom: 6 } as const;
const body = { color: "#6B7280", lineHeight: "20px" } as const;
const cta = { height: 56, borderRadius: 12, background: "#2E1760", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 18, border: 0, cursor: "pointer", width: "100%" } as const;
const ctaText = { color: "#fff", fontWeight: 700, fontSize: 16 } as const;


