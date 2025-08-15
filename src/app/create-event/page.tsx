export default function CreateEventPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="/home" aria-label="Back" style={{ fontSize: 28, textDecoration: "none", color: "#1f2937" }}>‹</a>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#1f2937" }}>Create an Event</h1>
        </div>

        <div style={{ background: "#3E1C87", marginTop: 8, padding: 16, borderRadius: 8 }}>
          <div style={{ color: "#E9E1FF", fontWeight: 700, marginBottom: 6 }}>Event Type</div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, height: 48, display: "flex", alignItems: "center", paddingInline: 14, color: "#fff" }}>
            <input placeholder="Select event type" style={{ flex: 1, height: "100%", background: "transparent", border: 0, outline: "none", color: "#fff" }} />
            <span style={{ fontSize: 18, opacity: 0.9, color: "#fff" }}>⌄</span>
          </div>
        </div>

        <div style={{ paddingInline: 12, paddingTop: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: "#1f2937" }}>Popular Categories</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingBottom: 96 }}>
            {DEFAULT_CATEGORIES.map((c) => (
              <a key={c.id} href="/create-event/customize" style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.title} style={{ width: "100%", height: 130, objectFit: "cover" }} />
                  <div style={{ padding: 10, fontWeight: 700, color: "#111827" }}>{c.title}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CATEGORIES = [
  { id: "grad", title: "Graduation", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800" },
  { id: "ann", title: "Anniversary", image: "https://images.unsplash.com/photo-1542662565-7e4b66bae529?w=800" },
  { id: "wedding", title: "Wedding Party", image: "https://images.unsplash.com/photo-1522008250122-c0c7a5f346e4?w=800" },
  { id: "kid", title: "Kid Party", image: "https://images.unsplash.com/photo-1548372293-3f41fd497b86?w=800" },
  { id: "rooftop", title: "Rooftop Party", image: "https://images.unsplash.com/photo-1540946507605-9752a2bba6c0?w=800" },
  { id: "corp", title: "Corporate Event", image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=800" },
] as const;


