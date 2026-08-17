import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { api, type GalleryItem, type GalleryUpdateData } from "../../api/client";
import AdminLayout, { AdminMessage } from "./AdminLayout";

export default function AdminGallery() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [caption, setCaption] = useState("");
    const [altText, setAltText] = useState("");
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const [editForm, setEditForm] = useState<GalleryUpdateData>({ caption: "", altText: "", displayOrder: 0, visible: true });
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => { setLoading(true); setError(""); try { setItems(await api.adminGetGallery()); } catch { setError("Impossible de charger la galerie."); } finally { setLoading(false); } }, []);
    useEffect(() => { void load(); }, [load]);

    async function upload(event: FormEvent) {
        event.preventDefault(); if (busy) return;
        const file = fileRef.current?.files?.[0]; if (!file) { setError("Choisissez une image à téléverser."); return; }
        setBusy(true); setError("");
        const data = new FormData(); data.append("file", file); data.append("caption", caption); data.append("altText", altText);
        try { await api.adminUploadGalleryImage(data); setCaption(""); setAltText(""); if (fileRef.current) fileRef.current.value = ""; await load(); }
        catch { setError("Impossible de téléverser l’image."); } finally { setBusy(false); }
    }
    function startEdit(item: GalleryItem) { setEditing(item); setEditForm({ caption: item.caption || "", altText: item.altText || "", displayOrder: item.displayOrder, visible: item.visible }); }
    async function save(event: FormEvent) { event.preventDefault(); if (!editing || busy) return; setBusy(true); setError(""); try { await api.adminUpdateGalleryImage(editing.id, editForm); setEditing(null); await load(); } catch { setError("Impossible d’enregistrer les modifications."); } finally { setBusy(false); } }
    async function remove(id: number) { if (busy || !window.confirm("Êtes-vous certain de vouloir supprimer cette image ?")) return; setBusy(true); setError(""); try { await api.adminDeleteGalleryImage(id); await load(); } catch { setError("Impossible de supprimer l’image."); } finally { setBusy(false); } }

    return <AdminLayout title="Galerie">
        <form className="admin-form" onSubmit={upload}><h2>Téléverser une image</h2><div className="admin-form-grid">
            <label className="admin-wide">Image<input ref={fileRef} type="file" accept="image/*" required /></label>
            <label>Légende<input maxLength={500} value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
            <label>Texte alternatif<input maxLength={500} value={altText} onChange={(e) => setAltText(e.target.value)} /></label>
        </div><button disabled={busy}>{busy ? "Téléversement en cours…" : "Téléverser l’image"}</button></form>
        {error && <AdminMessage error>{error}</AdminMessage>}
        {loading ? <AdminMessage>Chargement de la galerie…</AdminMessage> : items.length === 0 ? <AdminMessage>Aucune image.</AdminMessage> : <div className="admin-gallery-grid">{items.map((item) => <article key={item.id}>
            <img src={item.imageUrl} alt={item.altText || ""} />
            {editing?.id === item.id ? <form className="admin-form compact" onSubmit={save}>
                <label>Légende<input maxLength={500} value={editForm.caption} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} /></label>
                <label>Texte alternatif<input maxLength={500} value={editForm.altText} onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })} /></label>
                <label>Ordre d’affichage<input type="number" required value={editForm.displayOrder} onChange={(e) => setEditForm({ ...editForm, displayOrder: Number(e.target.value) })} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={editForm.visible} onChange={(e) => setEditForm({ ...editForm, visible: e.target.checked })} /> Visible publiquement</label>
                <div className="admin-actions"><button disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button><button type="button" className="secondary" onClick={() => setEditing(null)} disabled={busy}>Annuler</button></div>
            </form> : <><div className="admin-gallery-copy"><p>{item.caption || "Aucune légende"}</p><small>{item.altText || "Aucun texte alternatif"}</small></div><div className="admin-actions"><button className="secondary" onClick={() => startEdit(item)} disabled={busy}>Modifier</button><button className="danger" onClick={() => void remove(item.id)} disabled={busy}>Supprimer</button></div></>}
        </article>)}</div>}
    </AdminLayout>;
}
