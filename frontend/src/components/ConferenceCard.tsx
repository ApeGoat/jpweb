import type { Conference } from "../api/client";
import type { Language } from "../utils/language";

export function parseConferenceDate(value: string) {
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
}

export default function ConferenceCard({ event, date, language }: { event: Conference; date: Date; language: Language }) {
    const title = language === "fr" ? event.titleFr : event.titleEn;
    const description = language === "fr" ? event.descriptionFr : event.descriptionEn;
    const location = language === "fr" ? event.locationFr : event.locationEn;
    const formatter = new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    return <article className="event-card">
        <time dateTime={event.eventDate}>{formatter.format(date)}</time>
        <div><h3>{title}</h3>{description && <p>{description}</p>}{location && <span>{location}</span>}
            {event.url && <a className="event-link" href={event.url} target="_blank" rel="noreferrer">{language === "fr" ? "En savoir plus" : "Learn more"}</a>}
        </div>
    </article>;
}
