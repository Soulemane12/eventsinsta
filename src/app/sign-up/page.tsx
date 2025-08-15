"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const isValid = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    return name.trim().length > 1 && emailOk && password.length >= 6 && agreed;
  }, [name, email, password, agreed]);

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: integrate auth
    router.push("/sign-in");
  };

  return (
    <div style={styles.safe as React.CSSProperties}>
      <div style={styles.container as React.CSSProperties}>
        <div style={styles.headerRow as React.CSSProperties}>
          <button onClick={() => router.back()} aria-label="Go back" style={styles.backBtn as React.CSSProperties}>
            <span style={styles.backArrow as React.CSSProperties}>‹</span>
          </button>
          <h1 style={styles.title as React.CSSProperties}>Sign Up</h1>
          <div style={{ width: 32 }} />
        </div>

        <div style={styles.form as React.CSSProperties}>
          <div style={styles.inputWrap as React.CSSProperties}>
            <span style={styles.leftGlyph as React.CSSProperties}>👤</span>
            <input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input as React.CSSProperties}
              type="text"
            />
          </div>

          <div style={styles.inputWrap as React.CSSProperties}>
            <span style={styles.leftGlyph as React.CSSProperties}>✉️</span>
            <input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input as React.CSSProperties}
              type="email"
            />
          </div>

          <div style={styles.inputWrap as React.CSSProperties}>
            <span style={styles.leftGlyph as React.CSSProperties}>🔒</span>
            <input
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input as React.CSSProperties}
              type={showPassword ? "text" : "password"}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <button
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={styles.eyeBtn as React.CSSProperties}
              type="button"
            >
              <span style={styles.eyeText as React.CSSProperties}>{showPassword ? "🙈" : "👁"}</span>
            </button>
          </div>

          <div style={styles.termsRow as React.CSSProperties}>
            <button
              onClick={() => setAgreed((v) => !v)}
              aria-pressed={agreed}
              aria-label="Agree to terms"
              style={{
                ...(styles.checkbox as React.CSSProperties),
                ...(agreed ? styles.checkboxChecked : {}),
              }}
              type="button"
            >
              {agreed ? <span style={styles.checkboxTick as React.CSSProperties}>✓</span> : null}
            </button>

            <p style={styles.termsText as React.CSSProperties}>
              I agree to the healthcare {" "}
              <a href="#" style={styles.link as React.CSSProperties}>Terms of Service</a>{" "}
              and {" "}
              <a href="#" style={styles.link as React.CSSProperties}>Privacy Policy</a>
            </p>
          </div>
        </div>

        <div style={styles.hintRow as React.CSSProperties}>
          <span style={styles.hintText as React.CSSProperties}>Already have an account? </span>
          <Link href="/sign-in" style={styles.link as React.CSSProperties}>Sign In</Link>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          style={{
            ...(styles.cta as React.CSSProperties),
            opacity: isValid ? 1 : 0.8,
            cursor: isValid ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          <span style={styles.ctaText as React.CSSProperties}>Sign Up</span>
        </button>

        <div style={{ marginTop: 12, alignSelf: "center" }}>
          <Link href="/home">Skip for demo</Link>
        </div>
      </div>
    </div>
  );
}

const COLORS = {
  bg: "#FFFFFF",
  text: "#0B0B0B",
  hint: "#6B7280",
  inputBg: "#F5F6FA",
  inputBorder: "#E7E7EA",
  primary: "#2E1760",
};

const RADIUS = 14;

const styles = {
  safe: { minHeight: "100vh", backgroundColor: COLORS.bg },
  container: {
    margin: "0 auto",
    maxWidth: 520,
    paddingInline: 20,
    paddingTop: 8,
    paddingBottom: 16,
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingBlock: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    background: "transparent",
    border: 0,
    cursor: "pointer",
  },
  backArrow: { fontSize: 28, lineHeight: "28px", color: COLORS.text },
  title: {
    flex: 1,
    textAlign: "left" as const,
    fontSize: 28,
    fontWeight: 800,
    color: COLORS.text,
    marginLeft: 8,
    marginBlock: 0,
  },
  form: { marginTop: 12, display: "grid", gap: 14 },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderStyle: "solid" as const,
    borderRadius: RADIUS,
    paddingInline: 14,
    height: 56,
    gap: 8,
  },
  leftGlyph: {
    width: 26,
    textAlign: "center" as const,
    fontSize: 18,
    opacity: 0.85,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: COLORS.text,
    outline: "none",
    border: 0,
    background: "transparent",
  },
  eyeBtn: { paddingInline: 4, paddingBlock: 6, background: "transparent", border: 0, cursor: "pointer" },
  eyeText: { fontSize: 18 },
  termsRow: { display: "flex", alignItems: "flex-start", gap: 12, marginTop: 6 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderStyle: "solid" as const,
    borderColor: COLORS.inputBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    display: "flex",
  },
  checkboxChecked: { backgroundColor: "#FFFFFF", borderColor: COLORS.primary },
  checkboxTick: { color: COLORS.primary, fontSize: 16, fontWeight: 800 },
  termsText: { flex: 1, fontSize: 14, lineHeight: "20px", color: COLORS.text, margin: 0 },
  link: { color: COLORS.primary, fontWeight: 700, textDecoration: "none" },
  hintRow: {
    marginTop: "auto",
    alignSelf: "center" as const,
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  hintText: { fontSize: 15, color: COLORS.hint },
  cta: {
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    border: 0,
    color: "#fff",
  },
  ctaText: { color: "#fff", fontSize: 18, fontWeight: 700 },
} as const;


