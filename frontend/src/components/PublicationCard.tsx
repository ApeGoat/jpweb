import type { Publication } from "../api/client";
import type { Language } from "../utils/language";

const labels = {
    fr: { link: "Ouvrir le lien", video: "Voir la vidéo" },
    en: { link: "Open link", video: "Watch video" },
};

export function publicationTime(value: string | null) {
    if (!value) return Number.NEGATIVE_INFINITY;
    const time = new Date(value.includes("T") ? value : `${value}T00:00:00`).getTime();
    return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

export function sortPublications(items: Publication[]) {
    return [...items].sort((a, b) => publicationTime(b.publishedDate) - publicationTime(a.publishedDate));
}

export default function PublicationCard({ item, language }: { item: Publication; language: Language }) {
    const date = item.publishedDate;
    const formattedDate = date && new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { dateStyle: "long" })
        .format(new Date(date.includes("T") ? date : `${date}T00:00:00`));

    return <article className="publication-card">
        <div className="publication-meta"><span>{item.type}</span>{date && <time dateTime={date}>{formattedDate}</time>}</div>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        {item.url && <div className="publication-links"><a href={item.url} target="_blank" rel="noreferrer">{item.type === "VIDEO" ? labels[language].video : labels[language].link} ↗</a></div>}
    </article>;
}
