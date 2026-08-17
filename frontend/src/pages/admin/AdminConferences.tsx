import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, type Conference, type ConferenceFormData } from "../../api/client";
import AdminLayout, { AdminMessage } from "./AdminLayout";

const emptyForm: ConferenceFormData = {
    titleEn: "", titleFr: "", descriptionEn: "", descriptionFr: "",
    locationEn: "", locationFr: "", eventDate: "", url: "", visible: true,
};

export default function AdminConferences() {
    const [items, setItems] = useState<Conference[]>([]);
    const [form, setForm] = useState<ConferenceFormData>({ ...emptyForm });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true); setError("");
        try { setItems(await api.adminGetConferences()); }
        catch { setError("Impossible de charger les conférences."); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { void load(); }, [load]);

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (busy) return;
        setBusy(true); setError("");
        try {
            if (editingId === null) await api.adminCreateConference(form);
            else await api.adminUpdateConference(editingId, form);
            setForm({ ...emptyForm }); setEditingId(null); await load();
        } catch { setError("Impossible d’enregistrer la conférence."); }
        finally { setBusy(false); }
    }

    function edit(item: Conference) {
        setEditingId(item.id);
        setForm({
            titleEn: item.titleEn, titleFr: item.titleFr,
            descriptionEn: item.descriptionEn || "", descriptionFr: item.descriptionFr || "",
            locationEn: item.locationEn || "", locationFr: item.locationFr || "",
            eventDate: item.eventDate, url: item.url || "", visible: item.visible,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function remove(id: number) {
        if (busy || !window.confirm("Êtes-vous certain de vouloir supprimer cette conférence ?")) return;
        setBusy(true); setError("");
        try { await api.adminDeleteConference(id); await load(); }
        catch { setError("Impossible de supprimer la conférence."); }
        finally { setBusy(false); }
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const formatDate = (value: string) => new Intl.DateTimeFormat("fr-CA", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
    return <AdminLayout title="Conférences">
        <form className="admin-form" onSubmit={submit}>
            <h2>{editingId === null ? "Ajouter une conférence" : "Modifier la conférence"}</h2>
            <div className="admin-form-grid">
                <label>Titre en anglais<input required maxLength={255} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></label>
                <label>Titre en français<input required maxLength={255} value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} /></label>
                <label className="admin-wide">Description en anglais<textarea rows={4} value={form.descriptionEn || ""} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></label>
                <label className="admin-wide">Description en français<textarea rows={4} value={form.descriptionFr || ""} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} /></label>
                <label>Lieu en anglais<input maxLength={255} value={form.locationEn || ""} onChange={(e) => setForm({ ...form, locationEn: e.target.value })} /></label>
                <label>Lieu en français<input maxLength={255} value={form.locationFr || ""} onChange={(e) => setForm({ ...form, locationFr: e.target.value })} /></label>
                <label>Date de l’événement<input required type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></label>
                <label>Lien / URL<input type="url" maxLength={2048} value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Visible</label>
            </div>
            <div className="admin-actions"><button disabled={busy}>{busy ? "Enregistrement…" : editingId === null ? "Ajouter une conférence" : "Enregistrer les modifications"}</button>{editingId !== null && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm({ ...emptyForm }); }} disabled={busy}>Annuler</button>}</div>
        </form>
        {error && <AdminMessage error>{error}</AdminMessage>}
        {loading ? <AdminMessage>Chargement des conférences…</AdminMessage> : items.length === 0 ? <AdminMessage>Aucune conférence.</AdminMessage> : <div className="admin-list">{items.map((item) => <article key={item.id}><div><h3>{item.titleFr || item.titleEn}</h3><p>{item.eventDate < today ? "Passée" : item.eventDate === today ? "Aujourd’hui" : "À venir"} · {item.visible ? "Visible" : "Masquée"} · {formatDate(item.eventDate)}</p></div><div className="admin-actions"><button className="secondary" onClick={() => edit(item)} disabled={busy}>Modifier</button><button className="danger" onClick={() => void remove(item.id)} disabled={busy}>Supprimer</button></div></article>)}</div>}
    </AdminLayout>;
}
