import { FRAMES, Stage, mono, ink, sub, faint, muted, RED } from "./frames";

/* Hero storyboard — 15 STATIC 16:9 frames, built as real GUI scenes (not caption
   cards). No animation. Frames live in ./frames (shared with the /hero-motion
   animatic). Each frame implies a camera move (noted, not built). */

function Meta({ label, children, warn }: { label: string; children: React.ReactNode; warn?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <span style={{ fontFamily: mono, fontSize: 10, color: warn ? RED : faint, minWidth: 80, paddingTop: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontSize: 13, color: warn ? "#f0b8b2" : muted, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

export default function HeroStoryboard() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--canvas)", color: ink, padding: "30px clamp(16px,4vw,56px) 120px" }}>
      <header style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>Hero storyboard — 15 static frames (GUI scenes)</h1>
        <p style={{ color: sub, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>
          Real GUI scenes, not caption cards. Each frame implies a camera move (noted, not built). Spine:{" "}
          <strong style={{ color: muted }}>power → the conversation creates value → tool-switch drops the thread → markdown helps then loses nuance → you become the memory bus → Rift makes the work reusable across agents.</strong>{" "}
          The F03 corrected line returns as the F15 poster. Static only — motion lives at{" "}
          <a href="/hero-motion" style={{ color: "#8aa0ff" }}>/hero-motion</a>.
        </p>
      </header>

      <div style={{ maxWidth: 900, margin: "30px auto 0", display: "flex", flexDirection: "column", gap: 44 }}>
        {FRAMES.map((f) => (
          <section key={f.n}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: mono, fontSize: 13, color: faint }}>{f.n}</span>
              <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>{f.title}</h2>
              <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 11, color: faint }}>{f.ts}</span>
            </div>
            <Stage>{f.visual}</Stage>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ fontSize: 14.5, color: ink, fontWeight: 600, lineHeight: 1.4 }}>{f.feeling}</div>
              <Meta label="Camera">{f.camera}</Meta>
              <Meta label="Takeaway">{f.takeaway}</Meta>
              <Meta label="Risk" warn>
                {f.risk}
              </Meta>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
