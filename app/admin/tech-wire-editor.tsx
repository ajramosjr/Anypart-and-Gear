"use client";

import { createClient } from "@/lib/supabase/client";
import { ExternalLink, FilePenLine, ImageUp, Newspaper, Plus, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DatabaseTechArticle } from "@/app/tech-wire/article-store";

type FormState = { id?: string; title: string; slug: string; imageUrl: string; category: string; summary: string; readTime: string; content: string; pros: string; cons: string; sourceLabel: string; sourceUrl: string };
const emptyForm: FormState = { title: "", slug: "", imageUrl: "", category: "", summary: "", readTime: "5 min read", content: "", pros: "", cons: "", sourceLabel: "", sourceUrl: "" };
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function lines(value: string) { return value.split("\n").map((line) => line.trim()).filter(Boolean); }

function toForm(article: DatabaseTechArticle): FormState {
  const pros = article.sections.find((section) => /advantage|benefit|pros/i.test(section.heading));
  const cons = article.sections.find((section) => /tradeoff|limitation|concern|cons/i.test(section.heading));
  const main = article.sections.filter((section) => section !== pros && section !== cons).map((section) => `${section.heading}\n${section.body}`).join("\n\n");
  return { id: article.id, title: article.title, slug: article.slug, imageUrl: article.image_url || "", category: article.category, summary: article.summary, readTime: article.read_time, content: main, pros: (pros?.bullets || []).join("\n"), cons: (cons?.bullets || []).join("\n"), sourceLabel: article.sources[0]?.label || "", sourceUrl: article.sources[0]?.url || "" };
}

export default function TechWireEditor({ initialArticles, userId }: { initialArticles: DatabaseTechArticle[]; userId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [articles, setArticles] = useState(initialArticles);
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const setField = (field: keyof FormState, value: string) => setForm((current) => current ? { ...current, [field]: value } : current);

  async function uploadCover(file: File) {
    if (!form) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage("The cover image must be 10 MB or smaller.");
      return;
    }
    setBusy(true);
    setMessage("Uploading cover photo…");
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = slugify(form.slug || form.title) || "article";
    const objectPath = `${userId}/tech-wire/${safeName}-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("part-images").upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) {
      setMessage("The cover photo could not be uploaded. Please try again.");
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("part-images").getPublicUrl(objectPath);
    setField("imageUrl", data.publicUrl);
    setMessage("Cover photo uploaded. Publish or save the article to keep it.");
    setBusy(false);
  }

  async function save(status: "draft" | "published") {
    if (!form) return;
    const previousSlug = form.id ? articles.find((article) => article.id === form.id)?.slug : undefined;
    const slug = slugify(form.slug || form.title);
    if (!form.title.trim() || !form.category.trim() || !form.summary.trim() || !slug || !form.content.trim()) { setMessage("Add a title, category, summary and article content."); return; }
    setBusy(true); setMessage("");
    const sections: { heading: string; body: string; bullets?: string[] }[] = form.content.split(/\n\n+/).map((part, index) => { const [first, ...rest] = part.trim().split("\n"); return { heading: rest.length ? first : index ? `More to know ${index + 1}` : "What you need to know", body: rest.length ? rest.join("\n") : first }; });
    const pros = lines(form.pros); const cons = lines(form.cons);
    if (pros.length) sections.push({ heading: "The advantages", body: "Consider these potential benefits.", bullets: pros });
    if (cons.length) sections.push({ heading: "The tradeoffs", body: "Consider these potential limitations.", bullets: cons });
    const sources = form.sourceLabel.trim() && form.sourceUrl.trim() ? [{ label: form.sourceLabel.trim(), url: form.sourceUrl.trim() }] : [];
    const values = { slug, image_url: form.imageUrl.trim() || null, category: form.category.trim(), title: form.title.trim(), summary: form.summary.trim(), read_time: form.readTime.trim() || "5 min read", sections, sources, status, published_at: status === "published" ? new Date().toISOString() : null, updated_at: new Date().toISOString() };
    const result = form.id ? await supabase.from("tech_articles").update(values).eq("id", form.id).select().single() : await supabase.from("tech_articles").insert({ ...values, created_by: userId }).select().single();
    if (result.error) { setMessage(result.error.message.includes("unique") ? "That web address is already used. Change the article slug." : "The article could not be saved."); setBusy(false); return; }
    const saved = result.data as DatabaseTechArticle;
    await fetch("/api/admin/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, previousSlug }) }).catch(() => undefined);
    setArticles((current) => [saved, ...current.filter((article) => article.id !== saved.id)]);
    setForm(toForm(saved)); setMessage(status === "published" ? "Published. It is now live on APG Tech Wire." : "Draft saved."); setBusy(false);
  }

  async function remove(article: DatabaseTechArticle) {
    if (!window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return;
    setBusy(true); const { error } = await supabase.from("tech_articles").delete().eq("id", article.id); setBusy(false);
    if (error) { setMessage("The article could not be deleted."); return; }
    await fetch("/api/admin/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ previousSlug: article.slug }) }).catch(() => undefined);
    setArticles((current) => current.filter((item) => item.id !== article.id)); if (form?.id === article.id) setForm(null);
  }

  return <section className="admin-editor-section">
    <div className="admin-editor-heading"><div><span className="kicker">No-code publishing</span><h2><Newspaper /> APG Tech Wire Editor</h2><p>Create, edit and publish articles without GitHub or Vercel.</p></div><button className="button button-small" onClick={() => { setForm({ ...emptyForm }); setMessage(""); }}><Plus size={16} /> New article</button></div>
    <div className="admin-editor-grid">
      <div className="admin-article-list">{articles.map((article) => <article key={article.id} className="admin-article-row"><div><span className={`article-status ${article.status}`}>{article.status}</span><strong>{article.title}</strong><small>{article.category} · {article.read_time}</small></div><div className="admin-article-actions">{article.status === "published" && <Link href={`/tech-wire/${article.slug}`} target="_blank" aria-label="View article"><ExternalLink size={17} /></Link>}<button onClick={() => { setForm(toForm(article)); setMessage(""); }} aria-label="Edit article"><FilePenLine size={17} /></button><button onClick={() => void remove(article)} disabled={busy} aria-label="Delete article"><Trash2 size={17} /></button></div></article>)}{!articles.length && <div className="empty-state"><p>No articles yet.</p></div>}</div>
      {form ? <div className="admin-article-form"><div className="admin-form-title"><strong>{form.id ? "Edit article" : "New article"}</strong><button onClick={() => setForm(null)} aria-label="Close editor"><X size={19} /></button></div>
        <label>Title<input value={form.title} onChange={(event) => { const title = event.target.value; setForm((current) => current ? { ...current, title, slug: current.id ? current.slug : slugify(title) } : current); }} placeholder="Example: New cordless tools worth watching" /></label>
        <div className="form-grid"><label>Category<input value={form.category} onChange={(event) => setField("category", event.target.value)} placeholder="New tool watch" /></label><label>Reading time<input value={form.readTime} onChange={(event) => setField("readTime", event.target.value)} /></label></div>
        <label>Web address<input value={form.slug} onChange={(event) => setField("slug", slugify(event.target.value))} placeholder="new-cordless-tools" /><small>Created automatically from the title.</small></label>
        <label>Article cover link — optional<input type="url" value={form.imageUrl} onChange={(event) => setField("imageUrl", event.target.value)} placeholder="https://…" /><small>Paste an image link or upload a cover from your phone. Leave blank to use the automatic APG cover.</small></label>
        <div className="flex flex-wrap gap-2">
          <label className="button button-small cursor-pointer"><ImageUp size={16} /> {busy ? "Uploading…" : "Upload cover photo"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadCover(file); event.currentTarget.value = ""; }} /></label>
          {form.imageUrl && <button type="button" className="button button-small button-ghost-dark" disabled={busy} onClick={() => { setField("imageUrl", ""); setMessage("Custom cover removed. The automatic APG cover will be used."); }}><Trash2 size={16} /> Remove cover</button>}
        </div>
        <div className="admin-image-preview"><img src={form.imageUrl || `/tech-wire/${slugify(form.slug || form.title) || "preview"}/opengraph-image`} alt="Article cover preview" /></div>
        <label>Short summary<textarea value={form.summary} onChange={(event) => setField("summary", event.target.value)} rows={3} placeholder="A short introduction shown on the Tech Wire page." /></label>
        <label>Article content<textarea value={form.content} onChange={(event) => setField("content", event.target.value)} rows={12} placeholder={"Main heading\nWrite the article here.\n\nSecond heading\nContinue the article here."} /><small>Start each section with its heading. Leave a blank line before the next section.</small></label>
        <div className="form-grid"><label>Advantages — one per line<textarea value={form.pros} onChange={(event) => setField("pros", event.target.value)} rows={5} /></label><label>Tradeoffs — one per line<textarea value={form.cons} onChange={(event) => setField("cons", event.target.value)} rows={5} /></label></div>
        <div className="form-grid"><label>Official source name<input value={form.sourceLabel} onChange={(event) => setField("sourceLabel", event.target.value)} placeholder="Manufacturer product page" /></label><label>Official source link<input type="url" value={form.sourceUrl} onChange={(event) => setField("sourceUrl", event.target.value)} placeholder="https://…" /></label></div>
        {message && <p className="editor-message" role="status">{message}</p>}
        <div className="admin-form-actions"><button className="button button-ghost-dark" disabled={busy} onClick={() => void save("draft")}><Save size={16} /> Save draft</button><button className="button" disabled={busy} onClick={() => void save("published")}><Newspaper size={16} /> {busy ? "Saving…" : "Publish article"}</button></div>
      </div> : <div className="admin-editor-placeholder"><Newspaper size={34} /><strong>Select an article or create a new one</strong><p>Your changes stay private until you press Publish article.</p></div>}
    </div>
  </section>;
}
