import { ImageResponse } from "next/og";
import { getPublishedTechArticle } from "../article-store";

export const alt = "APG Tech Wire article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function accent(category: string) {
  if (/tool/i.test(category)) return "TOOLS • SHOP • GEAR";
  if (/future|vehicle/i.test(category)) return "VEHICLES • TECHNOLOGY • TOMORROW";
  if (/engine|induction|build/i.test(category)) return "ENGINES • POWER • BUILDS";
  if (/tow|truck/i.test(category)) return "TRUCKS • TOWING • WORK";
  return "PARTS • GEAR • STRAIGHT ANSWERS";
}

export default async function ArticleImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedTechArticle(slug);
  const category = article?.category || "APG Tech Wire";
  const title = article?.title || "Parts. Gear. Straight answers.";

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "linear-gradient(120deg,#06162c 0%,#0b315b 68%,#124a73 100%)", color: "white", padding: "58px 68px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", opacity: .16, backgroundImage: "linear-gradient(rgba(255,255,255,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.22) 1px,transparent 1px)", backgroundSize: "54px 54px" }} />
      <div style={{ position: "absolute", right: "-110px", top: "-150px", width: "560px", height: "560px", border: "3px solid rgba(245,184,31,.35)", borderRadius: "50%", display: "flex" }} />
      <div style={{ position: "absolute", right: "20px", top: "-20px", width: "320px", height: "320px", border: "2px solid rgba(245,184,31,.25)", borderRadius: "50%", display: "flex" }} />
      <div style={{ zIndex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ width: "78px", height: "78px", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #f5b81f", borderRadius: "50%", color: "#f5b81f", fontSize: "27px", fontWeight: 900 }}>APG</div>
            <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: "30px", fontWeight: 900, letterSpacing: "2px" }}>ANY PART &amp; GEAR</span><span style={{ color: "#f5b81f", fontSize: "20px", fontWeight: 800, letterSpacing: "6px" }}>TECH WIRE</span></div>
          </div>
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,.35)", borderRadius: "999px", padding: "12px 22px", color: "#f5b81f", fontSize: "18px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px" }}>{category}</div>
        </div>
        <div style={{ maxWidth: "980px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ width: "130px", height: "8px", background: "#f5b81f", display: "flex" }} />
          <div style={{ display: "flex", fontSize: title.length > 68 ? "51px" : "61px", lineHeight: 1.02, fontWeight: 900, letterSpacing: "-1.5px", textTransform: "uppercase" }}>{title}</div>
          <div style={{ color: "#f5b81f", fontSize: "20px", fontWeight: 800, letterSpacing: "4px" }}>{accent(category)}</div>
        </div>
      </div>
    </div>,
    size,
  );
}
