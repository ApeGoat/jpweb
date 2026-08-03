import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, type Publication, type PublicationFormData } from "../../api/client";
import type { PublicationStatus, PublicationType } from "../../api/types";
import AdminLayout, { AdminMessage } from "./AdminLayout";

const emptyForm: PublicationFormData = { title: "", description: "", type: "ARTICLE", url: "", thumbnailUrl: "", publishedDate: null, featured: false, status: "DRAFT" };
const publicationTypes: PublicationType[] = ["ARTICLE", "LINK", "VIDEO", "CONFERENCE", "OTHER"];
const statuses: PublicationStatus[] = ["DRAFT", "PUBLISHED", "HIDDEN"];

export default function AdminPublications() {
    const [items, setItems] = useState<Publication[]>([]);
    const [form, setForm] = useState<PublicationFormData>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => { setLoading(true); setError(""); try { setItems(await api.adminGetPublications()); } catch (e) { setError(e instanceof Error ? e.message : "Could not load publications."); } finally { setLoading(false); } }, []);
    useEffect(() => { void load(); }, [load]);

    async function submit(event: FormEvent) {
        event.preventDefault(); if (busy) return; setBusy(true); setError("");
        try { editingId === null ? await api.adminCreatePublication(form) : await api.adminUpdatePublication(editingId, form); setForm(emptyForm); setEditingId(null); await load(); }
        catch (e) { setError(e instanceof Error ? e.message : "Could not save publication."); } finally { setBusy(false); }
    }
    function edit(item: Publication) { setEditingId(item.id); setForm({ title: item.title, description: item.description || "", type: item.type, url: item.url || "", thumbnailUrl: item.thumbnailUrl || "", publishedDate: item.publishedDate, featured: item.featured, status: item.status }); window.scrollTo({ top: 0, behavior: "smooth" }); }
    async function remove(id: number) { if (busy || !window.confirm("Delete this publication?")) return; setBusy(true); setError(""); try { await api.adminDeletePublication(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Could not delete publication."); } finally { setBusy(false); } }

    return <AdminLayout title="Publications">
        <form className="admin-form" onSubmit={submit}>
            <h2>{editingId === null ? "Add publication" : "Edit publication"}</h2>
            <div className="admin-form-grid">
                <label>Title<input required maxLength={255} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
                <label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PublicationType })}>{publicationTypes.map((v) => <option key={v}>{v}</option>)}</select></label>
                <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PublicationStatus })}>{statuses.map((v) => <option key={v}>{v}</option>)}</select></label>
                <label>Published date<input type="date" value={form.publishedDate || ""} onChange={(e) => setForm({ ...form, publishedDate: e.target.value || null })} /></label>
                <label className="admin-wide">Description<textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                <label className="admin-wide">URL<input type="url" maxLength={2048} value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
                <label className="admin-wide">Thumbnail URL<input type="url" maxLength={2048} value={form.thumbnailUrl || ""} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            </div>
            <div className="admin-actions"><button disabled={busy}>{busy ? "Saving…" : editingId === null ? "Add publication" : "Save changes"}</button>{editingId !== null && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }} disabled={busy}>Cancel</button>}</div>
        </form>
        {error && <AdminMessage error>{error}</AdminMessage>}
        {loading ? <AdminMessage>Loading publications…</AdminMessage> : items.length === 0 ? <AdminMessage>No publications yet.</AdminMessage> : <div className="admin-list">{items.map((item) => <article key={item.id}><div><h3>{item.title}</h3><p>{item.type} · {item.status}{item.publishedDate ? ` · ${item.publishedDate}` : ""}</p></div><div className="admin-actions"><button className="secondary" onClick={() => edit(item)} disabled={busy}>Edit</button><button className="danger" onClick={() => void remove(item.id)} disabled={busy}>Delete</button></div></article>)}</div>}
    </AdminLayout>;
}
