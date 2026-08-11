import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "linear-gradient(180deg, #0a1420 0%, #0f2620 100%)",
          color: "#eef5ef",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#34c759" }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: "#34c759" }} />
          Available for work · Liverpool, UK
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 28 }}>Daksh Singhvi</div>
        <div style={{ fontSize: 38, marginTop: 12, color: "rgba(238,245,239,0.72)" }}>
          Software Engineer · dsinghvi07@gmail.com
        </div>
      </div>
    ),
    size
  );
}
