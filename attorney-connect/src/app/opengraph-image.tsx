import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AttorneyCompete — When Attorneys Compete, You Win";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e1b4b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            ⚖️
          </div>
          <span style={{ fontSize: "40px", fontWeight: 800, color: "#ffffff" }}>
            Attorney<span style={{ color: "#3b82f6" }}>Compete</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          When Attorneys Compete,{" "}
          <span style={{ color: "#60a5fa" }}>You Win.</span>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: "26px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Compare fees, ratings &amp; results from top attorneys — free for consumers.
        </div>
      </div>
    ),
    { ...size }
  );
}
