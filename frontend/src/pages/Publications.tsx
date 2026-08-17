import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, type Publication } from "../api/client";
import PublicationCard, { sortPublications } from "../components/PublicationCard";
import { getLanguageFromPath } from "../utils/language";
const copy = { en: { title: "PUBLICATIONS", loading: "Loading publications…", error: "The publications could not be loaded.", empty: "No publications are available yet." }, fr: { title: "PUBLICATIONS", loading: "Chargement des publications…", error: "Impossible de charger les publications.", empty: "Aucune publication n’est disponible pour le moment." } };
export default function Publications() {
 const language = getLanguageFromPath(useLocation().pathname); const content = copy[language]; const [items, setItems] = useState<Publication[]>([]); const [state, setState] = useState<"loading" | "ready" | "error">("loading");
 useEffect(() => { let active = true; api.getPublications().then(v => { if (active) { setItems(sortPublications(v)); setState("ready"); } }).catch(() => { if (active) setState("error"); }); return () => { active = false; }; }, []);
 return <main className="content-page"><div className="content-panel"><h1>{content.title}</h1>{state !== "ready" || !items.length ? <p role={state === "error" ? "alert" : "status"} className="page-message">{state === "loading" ? content.loading : state === "error" ? content.error : content.empty}</p> : <div className="publication-list">{items.map(item => <PublicationCard key={item.id} item={item} language={language} />)}</div>}</div></main>;
}
