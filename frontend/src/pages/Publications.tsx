import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { api, type Publication } from "../api/client";
import { getLanguageFromPath } from "../utils/language";

const copy = {
    en: { title: "PUBLICATIONS", loading: "Loading publications…", error: "The publications could not be loaded.", empty: "No publications are available yet.", link: "Open link", video: "Watch video", conference: "Conference" },
    fr: { title: "PUBLICATIONS", loading: "Chargement des publications…", error: "Impossible de charger les publications.", empty: "Aucune publication n’est disponible pour le moment.", link: "Ouvrir le lien", video: "Voir la vidéo", conference: "Conférence" },
};

function formatDate(value: string, language: "fr" | "en") {
    const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
    return new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { dateStyle: "long" }).format(date);
}

export default function Publications() {
    const language = getLanguageFromPath(useLocation().pathname);
    const content = copy[language];
    const [items, setItems] = useState<Publication[]>([]);
    const [state, setState] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        let active = true;
        api.getPublications()
            .then((publications) => { if (active) { setItems(publications); setState("ready"); } })
            .catch(() => { if (active) setState("error"); });
        return () => { active = false; };
    }, []);

    return (
        <main className="content-page">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="content-panel">
                <h1>{content.title}</h1>
                {state !== "ready" || items.length === 0 ? (
                    <p role={state === "error" ? "alert" : "status"} className="page-message">
                        {state === "loading" ? content.loading : state === "error" ? content.error : content.empty}
                    </p>
                ) : (
                    <div className="publication-list">
                        {items.map((item) => {
                            const links = [
                                { url: item.url, label: item.type === "VIDEO" ? content.video : content.link },
                            ].filter((entry): entry is { url: string; label: string } => Boolean(entry.url));
                            const date = item.publishedDate;
                            return (
                                <article key={item.id} className="publication-card">
                                    <div className="publication-meta"><span>{item.type}</span>{date && <time dateTime={date}>{formatDate(date, language)}</time>}</div>
                                    <h2>{item.title}</h2>
                                    <p>{item.description}</p>
                                    {links.length > 0 && <div className="publication-links">{links.map((link) => <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}
                                </article>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </main>
    );
}
