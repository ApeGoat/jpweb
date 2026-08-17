import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, type Publication, type PublicationFormData } from "../../api/client";
import type { PublicationStatus, PublicationType } from "../../api/types";
import AdminLayout, { AdminMessage } from "./AdminLayout";

const emptyForm: PublicationFormData = { title: "", description: "", type: "ARTICLE", url: "", thumbnailUrl: "", publishedDate: null, featured: false, status: "DRAFT" };
const publicationTypes: PublicationType[] = ["ARTICLE", "LINK", "VIDEO", "CONFERENCE", "OTHER"];
const statuses: PublicationStatus[] = ["DRAFT", "PUBLISHED", "HIDDEN"];
const typeLabels: Record<PublicationType, string> = { ARTICLE: "Article", LINK: "Lien", VIDEO: "Vidéo", CONFERENCE: "Conférence", OTHER: "Autre" };
const statusLabels: Record<PublicationStatus, string> = { DRAFT: "Brouillon", PUBLISHED: "Publiée", HIDDEN: "Masquée" };
const formatDate = (value: string) => new Intl.DateTimeFormat("fr-CA", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));

export default function AdminPublications() {
    const [items, setItems] = useState<Publication[]>([]);
    const [form, setForm] = useState<PublicationFormData>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => { setLoading(true); setError(""); try { setItems(await api.adminGetPublications()); } catch { setError("Impossible de charger les publications."); } finally { setLoading(false); } }, []);
    useEffect(() => { void load(); }, [load]);

    async function submit(event: FormEvent) {
        event.preventDefault(); if (busy) return; setBusy(true); setError("");
        try { editingId === null ? await api.adminCreatePublication(form) : await api.adminUpdatePublication(editingId, form); setForm(emptyForm); setEditingId(null); await load(); }
        catch { setError("Impossible d’enregistrer la publication."); } finally { setBusy(false); }
    }
    function edit(item: Publication) { setEditingId(item.id); setForm({ title: item.title, description: item.description || "", type: item.type, url: item.url || "", thumbnailUrl: item.thumbnailUrl || "", publishedDate: item.publishedDate, featured: item.featured, status: item.status }); window.scrollTo({ top: 0, behavior: "smooth" }); }
    async function remove(id: number) { if (busy || !window.confirm("Supprimer cette publication ?")) return; setBusy(true); setError(""); try { await api.adminDeletePublication(id); await load(); } catch { setError("Impossible de supprimer la publication."); } finally { setBusy(false); } }

    return <AdminLayout title="Publications">
        <form className="admin-form" onSubmit={submit}>
            <h2>{editingId === null ? "Ajouter une publication" : "Modifier la publication"}</h2>
            <div className="admin-form-grid">
                <label>Titre<input required maxLength={255} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
                <label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PublicationType })}>{publicationTypes.map((v) => <option key={v} value={v}>{typeLabels[v]}</option>)}</select></label>
                <label>Statut<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PublicationStatus })}>{statuses.map((v) => <option key={v} value={v}>{statusLabels[v]}</option>)}</select></label>
                <label>Date de publication<input type="date" value={form.publishedDate || ""} onChange={(e) => setForm({ ...form, publishedDate: e.target.value || null })} /></label>
                <label className="admin-wide">Description<textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                <label className="admin-wide">Lien / URL<input type="url" maxLength={2048} value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
                <label className="admin-wide">URL de la miniature<input type="url" maxLength={2048} value={form.thumbnailUrl || ""} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> En vedette</label>
            </div>
            <div className="admin-actions"><button disabled={busy}>{busy ? "Enregistrement…" : editingId === null ? "Ajouter une publication" : "Enregistrer les modifications"}</button>{editingId !== null && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }} disabled={busy}>Annuler</button>}</div>
        </form>
        {error && <AdminMessage error>{error}</AdminMessage>}
        {loading ? <AdminMessage>Chargement des publications…</AdminMessage> : items.length === 0 ? <AdminMessage>Aucune publication.</AdminMessage> : <div className="admin-list">{items.map((item) => <article key={item.id}><div><h3>{item.title}</h3><p>{typeLabels[item.type]} · {statusLabels[item.status]}{item.publishedDate ? ` · ${formatDate(item.publishedDate)}` : ""}</p></div><div className="admin-actions"><button className="secondary" onClick={() => edit(item)} disabled={busy}>Modifier</button><button className="danger" onClick={() => void remove(item.id)} disabled={busy}>Supprimer</button></div></article>)}</div>}
    </AdminLayout>;
}
