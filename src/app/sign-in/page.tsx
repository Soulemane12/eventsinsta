"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValid = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    return emailOk && password.length >= 6;
  }, [email, password]);

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: integrate auth
    router.push("/");
  };

  return (
    <div style={styles.safe as React.CSSProperties}>
      <div style={styles.container as React.CSSProperties}>
        <div style={styles.headerRow as React.CSSProperties}>
          <button onClick={() => router.back()} aria-label="Go back" style={styles.backBtn as React.CSSProperties}>
            <span style={styles.backArrow as React.CSSProperties}>‹</span>
          </button>
          <h1 style={styles.title as React.CSSProperties}>Sign In</h1>
          <div style={{ width: 32 }} />
        </div>

        <div style={styles.form as React.CSSProperties}>
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

          <div style={styles.forgotWrap as React.CSSProperties}>
            <Link href="#" style={styles.forgotText as React.CSSProperties}>Forgot password?</Link>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          style={{
            ...(styles.cta as React.CSSProperties),
            opacity: isValid ? 1 : 0.85,
            cursor: isValid ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          <span style={styles.ctaText as React.CSSProperties}>Sign In</span>
        </button>

        <div style={styles.hintRow as React.CSSProperties}>
          <Link href="/home" style={styles.linkDark as React.CSSProperties}>Skip for demo</Link>
        </div>

        <div style={styles.hintRow as React.CSSProperties}>
          <span style={styles.hintText as React.CSSProperties}>Don’t have an account? </span>
          <Link href="/sign-up" style={styles.linkDark as React.CSSProperties}>Sign up</Link>
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
  linkBlue: "#2563EB",
  linkDark: "#0F3A46",
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
  forgotWrap: { alignSelf: "flex-end" as const },
  forgotText: { color: COLORS.linkBlue, fontWeight: 600, textDecoration: "none" },
  cta: {
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    marginTop: 16,
    border: 0,
    color: "#fff",
  },
  ctaText: { color: "#fff", fontSize: 18, fontWeight: 700 },
  hintRow: {
    marginTop: "auto",
    alignSelf: "center" as const,
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  hintText: { fontSize: 15, color: COLORS.hint },
  linkDark: { color: COLORS.linkDark, fontWeight: 700, textDecoration: "none" },
} as const;


