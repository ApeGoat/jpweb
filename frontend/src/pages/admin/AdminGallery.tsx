import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { api, type GalleryItem, type GalleryUpdateData } from "../../api/client";
import AdminLayout, { AdminMessage } from "./AdminLayout";

function SortableCard({ item, disabled, children }: { item: GalleryItem; disabled: boolean; children: ReactNode }) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging, isOver } = useSortable({ id: item.id, disabled });
    return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
        className={`${isDragging ? "gallery-dragging" : ""} ${isOver ? "gallery-drop-target" : ""}`}>
        <button type="button" className="gallery-drag-handle" ref={setActivatorNodeRef} {...attributes} {...listeners}
            disabled={disabled} aria-label={`Déplacer ${item.caption || "l’image"}`}>⠿ Déplacer</button>
        {children}
    </article>;
}

export default function AdminGallery() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [caption, setCaption] = useState("");
    const [altText, setAltText] = useState("");
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const [editForm, setEditForm] = useState<GalleryUpdateData>({ caption: "", altText: "", visible: true });
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [ordering, setOrdering] = useState(false);
    const mutationRef = useRef(false);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const locked = busy || dragging || ordering;
    const [error, setError] = useState("");

    const load = useCallback(async () => { setLoading(true); setError(""); try { setItems(await api.adminGetGallery()); } catch { setError("Impossible de charger la galerie."); } finally { setLoading(false); } }, []);
    useEffect(() => { void load(); }, [load]);

    async function upload(event: FormEvent) {
        event.preventDefault(); if (locked || mutationRef.current) return;
        const file = fileRef.current?.files?.[0]; if (!file) { setError("Choisissez une image à téléverser."); return; }
        setBusy(true); setError("");
        const data = new FormData(); data.append("file", file); data.append("caption", caption); data.append("altText", altText);
        try { await api.adminUploadGalleryImage(data); setCaption(""); setAltText(""); if (fileRef.current) fileRef.current.value = ""; await load(); }
        catch { setError("Impossible de téléverser l’image."); } finally { setBusy(false); }
    }
    function startEdit(item: GalleryItem) { setEditing(item); setEditForm({ caption: item.caption || "", altText: item.altText || "", visible: item.visible }); }
    async function save(event: FormEvent) { event.preventDefault(); if (!editing || locked || mutationRef.current) return; setBusy(true); setError(""); try { await api.adminUpdateGalleryImage(editing.id, editForm); setEditing(null); await load(); } catch { setError("Impossible d’enregistrer les modifications."); } finally { setBusy(false); } }
    async function remove(id: number) { if (locked || mutationRef.current || !window.confirm("Êtes-vous certain de vouloir supprimer cette image ?")) return; setBusy(true); setError(""); try { await api.adminDeleteGalleryImage(id); await load(); } catch { setError("Impossible de supprimer l’image."); } finally { setBusy(false); } }

    async function reorder({ active, over }: DragEndEvent) {
        setDragging(false);
        if (!over || active.id === over.id || busy || mutationRef.current) return;
        const previous = items;
        const from = items.findIndex(item => item.id === active.id);
        const to = items.findIndex(item => item.id === over.id);
        if (from < 0 || to < 0) return;
        const ordered = arrayMove(items, from, to);
        mutationRef.current = true;
        setItems(ordered); setOrdering(true); setError("");
        try { setItems(await api.adminReorderGallery(ordered.map(item => item.id))); }
        catch { setItems(previous); setError("Impossible d’enregistrer l’ordre. L’ordre précédent a été rétabli. Actualisez la page avant de réessayer."); }
        finally { mutationRef.current = false; setOrdering(false); }
    }

    return <AdminLayout title="Galerie">
        <form className="admin-form" onSubmit={upload}><h2>Téléverser une image</h2><div className="admin-form-grid">
            <label className="admin-wide">Image<input ref={fileRef} type="file" accept="image/*" required /></label>
            <label>Légende<input maxLength={500} value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
            <label>Texte alternatif<input maxLength={500} value={altText} onChange={(e) => setAltText(e.target.value)} /></label>
        </div><button disabled={locked}>{busy ? "Téléversement en cours…" : "Téléverser l’image"}</button></form>
        {error && <AdminMessage error>{error}</AdminMessage>}
        <p>Faites glisser la poignée « Déplacer » pour réorganiser les images. Au clavier : espace, flèches, puis espace pour déposer; Échap pour annuler.</p>
        {ordering && <AdminMessage>Enregistrement de l’ordre…</AdminMessage>}
        {loading ? <AdminMessage>Chargement de la galerie…</AdminMessage> : items.length === 0 ? <AdminMessage>Aucune image.</AdminMessage> : <DndContext sensors={sensors} collisionDetection={closestCenter}
            onDragStart={() => setDragging(true)} onDragCancel={() => setDragging(false)} onDragEnd={event => void reorder(event)}>
            <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
            <div className="admin-gallery-grid">{items.map((item) => <SortableCard key={item.id} item={item} disabled={busy || ordering || editing !== null}>
            <img draggable={false} src={item.imageUrl} alt={item.altText || ""} />
            {editing?.id === item.id ? <form className="admin-form compact" onSubmit={save}>
                <label>Légende<input maxLength={500} value={editForm.caption} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} /></label>
                <label>Texte alternatif<input maxLength={500} value={editForm.altText} onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={editForm.visible} onChange={(e) => setEditForm({ ...editForm, visible: e.target.checked })} /> Visible publiquement</label>
                <div className="admin-actions"><button disabled={locked}>{busy ? "Enregistrement…" : "Enregistrer"}</button><button type="button" className="secondary" onClick={() => setEditing(null)} disabled={locked}>Annuler</button></div>
            </form> : <><div className="admin-gallery-copy"><p>{item.caption || "Aucune légende"}</p><small>{item.altText || "Aucun texte alternatif"}</small></div><div className="admin-actions"><button className="secondary" onClick={() => startEdit(item)} disabled={locked}>Modifier</button><button className="danger" onClick={() => void remove(item.id)} disabled={locked}>Supprimer</button></div></>}
        </SortableCard>)}</div></SortableContext></DndContext>}
    </AdminLayout>;
}
