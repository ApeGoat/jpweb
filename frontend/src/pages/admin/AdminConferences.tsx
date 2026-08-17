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
        catch (e) { setError(e instanceof Error ? e.message : "Could not load conferences."); }
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
        } catch (e) { setError(e instanceof Error ? e.message : "Could not save conference."); }
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
        if (busy || !window.confirm("Delete this conference?")) return;
        setBusy(true); setError("");
        try { await api.adminDeleteConference(id); await load(); }
        catch (e) { setError(e instanceof Error ? e.message : "Could not delete conference."); }
        finally { setBusy(false); }
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    return <AdminLayout title="Conferences">
        <form className="admin-form" onSubmit={submit}>
            <h2>{editingId === null ? "Add conference" : "Edit conference"}</h2>
            <div className="admin-form-grid">
                <label>English title<input required maxLength={255} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></label>
                <label>French title<input required maxLength={255} value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} /></label>
                <label className="admin-wide">English description<textarea rows={4} value={form.descriptionEn || ""} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></label>
                <label className="admin-wide">French description<textarea rows={4} value={form.descriptionFr || ""} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} /></label>
                <label>English location<input maxLength={255} value={form.locationEn || ""} onChange={(e) => setForm({ ...form, locationEn: e.target.value })} /></label>
                <label>French location<input maxLength={255} value={form.locationFr || ""} onChange={(e) => setForm({ ...form, locationFr: e.target.value })} /></label>
                <label>Event date<input required type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></label>
                <label>URL<input type="url" maxLength={2048} value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
                <label className="admin-checkbox"><input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Visible</label>
            </div>
            <div className="admin-actions"><button disabled={busy}>{busy ? "Saving…" : editingId === null ? "Add conference" : "Save changes"}</button>{editingId !== null && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm({ ...emptyForm }); }} disabled={busy}>Cancel</button>}</div>
        </form>
        {error && <AdminMessage error>{error}</AdminMessage>}
        {loading ? <AdminMessage>Loading conferences…</AdminMessage> : items.length === 0 ? <AdminMessage>No conferences yet.</AdminMessage> : <div className="admin-list">{items.map((item) => <article key={item.id}><div><h3>{item.titleEn}</h3><p>{item.eventDate < today ? "Past" : "Upcoming"} · {item.visible ? "Visible" : "Hidden"} · {item.eventDate}</p></div><div className="admin-actions"><button className="secondary" onClick={() => edit(item)} disabled={busy}>Edit</button><button className="danger" onClick={() => void remove(item.id)} disabled={busy}>Delete</button></div></article>)}</div>}
    </AdminLayout>;
}
