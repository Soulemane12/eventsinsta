"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Contact = { id: string; name: string };

const DEFAULT_CONTACTS: Contact[] = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
  { id: "3", name: "Charlie Davis" },
];

export default function AddGuestsPage() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => DEFAULT_CONTACTS.filter(c => c.name.toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => router.back()} style={btnBack}>‹</button>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>4 of 5: Add Guests</h1>
        </div>
        <div style={{ height: 3, background: "#16a34a", width: "80%", marginTop: 8 }} />

        <div style={{ height: 50, borderRadius: 12, background: "#F5F6FA", border: "1px solid #E7E7EA", paddingInline: 12, display: "flex", alignItems: "center", marginTop: 16 }}>
          <span style={{ marginRight: 8 }}>🔎</span>
          <input placeholder="Search contacts" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, height: "100%", background: "transparent", border: 0, outline: "none" }} />
          <button style={{ background: "transparent", border: 0, cursor: "pointer" }}>👤➕</button>
        </div>

        <div style={{ paddingTop: 8, paddingBottom: 100 }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ height: 56, borderRadius: 10, background: "#fff", border: "1px solid #E7E7EA", paddingInline: 14, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
              <button style={{ background: "#2E1760", color: "#fff", paddingInline: 14, paddingBlock: 8, borderRadius: 8, border: 0, cursor: "pointer" }}>Add</button>
            </div>
          ))}
        </div>

        <button style={cta} onClick={() => router.push("/home")}>
          <span style={ctaText}>Next: Review & Send</span>
        </button>
      </div>
    </div>
  );
}

const btnBack = { fontSize: 28, background: "transparent", border: 0, cursor: "pointer" } as const;
const cta = { position: "fixed" as const, left: 16, right: 16, bottom: 16, height: 56, borderRadius: 12, background: "#2E1760", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: 0, cursor: "pointer" } as const;
const ctaText = { color: "#fff", fontWeight: 700, fontSize: 16 } as const;


