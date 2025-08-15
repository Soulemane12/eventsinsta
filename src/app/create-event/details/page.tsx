"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DetailsPage() {
  const router = useRouter();
  const [hideGuestList, setHideGuestList] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => router.back()} style={btnBack}>‹</button>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>2 of 5: Event Details</h1>
        </div>
        <div style={{ height: 3, background: "#16a34a", width: "40%", marginTop: 8 }} />

        <div style={{ padding: 16, color: "#0B0B0B" }}>
          <Label>Event Title</Label>
          <Input placeholder="Enter event title" />

          <Label>Event Type</Label>
          <div style={inputRow}>
            <input placeholder="Select event type" style={inputFlex} />
            <span style={{ fontSize: 18, marginLeft: 8 }}>⌄</span>
          </div>

          <Label>Event Description</Label>
          <textarea placeholder="Write your event description" style={{ ...input, height: 100, color: "#0B0B0B" }} />

          <h3 style={subhead}>Event Timing</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ ...inputRow, flex: 1 }}><span style={leadIcon}>📅</span><input placeholder="DD/MM/YY" style={{ ...inputFlex, color: "#0B0B0B" }} /></div>
            <div style={{ ...inputRow, flex: 1 }}><span style={leadIcon}>🕒</span><input placeholder="12:00 AM" style={{ ...inputFlex, color: "#0B0B0B" }} /></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ ...inputRow, flex: 1 }}><span style={leadIcon}>📅</span><input placeholder="DD/MM/YY" style={{ ...inputFlex, color: "#0B0B0B" }} /></div>
            <div style={{ ...inputRow, flex: 1 }}><span style={leadIcon}>🕒</span><input placeholder="12:00 AM" style={{ ...inputFlex, color: "#0B0B0B" }} /></div>
          </div>

          <Label>Location</Label>
          <Input placeholder="Location" />

          <Label>Hosted By</Label>
          <Input placeholder="Enter host name" />

          <h3 style={subhead}>Guest Options</h3>
          <div style={{ color: "#0B0B0B", marginBottom: 8 }}>Hide the guest list from attendees for this event</div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={hideGuestList} onChange={(e) => setHideGuestList(e.target.checked)} />
            <span>Hide guest list</span>
          </label>

          <button style={cta} onClick={() => router.push("/create-event/preview")}>
            <span style={ctaText}>Next: Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const input = { background: "#F5F6FA", border: "1px solid #E7E7EA", borderRadius: 12, height: 52, paddingInline: 14 } as const;
const inputRow = { background: "#F5F6FA", border: "1px solid #E7E7EA", borderRadius: 12, height: 52, paddingInline: 12, display: "flex", alignItems: "center" } as const;
const inputFlex = { flex: 1, height: "100%", background: "transparent", border: 0, outline: "none" } as const;
const leadIcon = { fontSize: 16, width: 22, textAlign: "center" as const, marginRight: 6 } as const;
const subhead = { fontSize: 18, fontWeight: 800, marginTop: 8, marginBottom: 8 } as const;
const cta = { height: 56, borderRadius: 12, background: "#2E1760", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16, border: 0, cursor: "pointer" } as const;
const ctaText = { color: "#fff", fontWeight: 700 as const, fontSize: 16 } as const;
const btnBack = { fontSize: 28, background: "transparent", border: 0, cursor: "pointer" } as const;

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontWeight: 700, marginBottom: 6, marginTop: 10 }}>{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={input as React.CSSProperties} />;
}


