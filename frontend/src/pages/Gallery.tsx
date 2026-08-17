import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, type GalleryItem } from "../api/client";
import GalleryGrid from "../components/GalleryGrid";
import { getLanguageFromPath } from "../utils/language";
const copy = { fr: { title: "GALLERIE", loading: "Chargement de la galerie…", error: "Impossible de charger la galerie.", empty: "Aucune image n’est disponible." }, en: { title: "GALLERY", loading: "Loading gallery…", error: "The gallery could not be loaded.", empty: "No images are available." } };
export default function Gallery() {
 const language = getLanguageFromPath(useLocation().pathname); const content = copy[language]; const [items, setItems] = useState<GalleryItem[]>([]); const [state, setState] = useState<"loading" | "ready" | "error">("loading");
 useEffect(() => { let active = true; api.getGallery().then(v => { if (active) { setItems(v); setState("ready"); } }).catch(() => { if (active) setState("error"); }); return () => { active = false; }; }, []);
 return <main className="content-page gallery-page"><div className="content-panel gallery-panel"><h1>{content.title}</h1>{state !== "ready" || !items.length ? <p className="page-message" role={state === "error" ? "alert" : "status"}>{state === "loading" ? content.loading : state === "error" ? content.error : content.empty}</p> : <GalleryGrid items={items} />}</div></main>;
}
