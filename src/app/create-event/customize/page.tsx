"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CustomizePage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF", padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <div style={styles.headerWrap as React.CSSProperties}>
        <div style={styles.headerRow as React.CSSProperties}>
          <button onClick={() => router.push("/create-event")} aria-label="Back" style={{ fontSize: 28, color: "#000000", background: "transparent", border: 0, cursor: "pointer" }}>‹</button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#000000", margin: 0 }}>1 of 5: Customize</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ height: 4, backgroundColor: "#16a34a", width: "20%", marginTop: 8 }} />
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 400, height: 600, margin: "20px auto 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1520975940462-3724a3b4d66a?w=900"
          alt="Poster"
          style={{ width: "100%", height: "100%", borderRadius: 8, objectFit: "cover" }}
        />
        <button 
          style={{ 
            position: "absolute", 
            right: 10, 
            top: 10, 
            backgroundColor: "#2E1760", 
            width: 40, 
            height: 40, 
            borderRadius: 8, 
            color: "#fff", 
            fontSize: 18,
            display: "grid", 
            placeItems: "center", 
            border: 0, 
            cursor: "pointer" 
          }} 
          aria-label="Edit poster"
        >
          ✎
        </button>

        <div style={{ position: "absolute", left: 24, right: 24, top: 110, height: 36, borderWidth: 2, borderStyle: "dashed", borderColor: "#60A5FA", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 24, right: 24, top: 200, height: 70, borderWidth: 2, borderStyle: "dashed", borderColor: "#60A5FA", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 24, right: 24, top: 310, height: 36, borderWidth: 2, borderStyle: "dashed", borderColor: "#60A5FA", borderRadius: 6 }} />
      </div>

      <button 
        style={{ 
          marginTop: 24, 
          height: 60, 
          borderRadius: 12, 
          backgroundColor: "#2E1760", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "100%", 
          border: 0, 
          cursor: "pointer" 
        }} 
        onClick={() => router.push("/create-event/details")}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Next: Event Details</span>
      </button>
    </div>
  );
}

