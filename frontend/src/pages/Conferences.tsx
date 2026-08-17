import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { api, type Conference } from "../api/client";
import { getLanguageFromPath } from "../utils/language";

const copy = {
    en: { title: "CONFERENCES", upcoming: "Upcoming events", empty: "No upcoming events.", loading: "Loading events…", error: "Events could not be loaded.", link: "Learn more" },
    fr: { title: "CONFÉRENCES", upcoming: "Événements à venir", empty: "Aucun événement à venir.", loading: "Chargement des événements…", error: "Impossible de charger les événements.", link: "En savoir plus" },
};

function parseCalendarDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
}

export default function Conferences() {
    const language = getLanguageFromPath(useLocation().pathname);
    const content = copy[language];
    const [items, setItems] = useState<Conference[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(false);
        api.getConferences()
            .then((values) => { if (active) setItems(Array.isArray(values) ? values : []); })
            .catch(() => { if (active) setError(true); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const upcomingEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return items
            .map((event) => ({ event, date: parseCalendarDate(event.eventDate) }))
            .filter((entry): entry is { event: Conference; date: Date } => Boolean(entry.date && entry.event.visible !== false && entry.date >= today))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [items]);

    const dateFormatter = new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
    });

    return (
        <main className="content-page conferences-page">
            <div className="content-panel conferences-panel">
                <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                    {content.title}
                </motion.h1>
                <div className="calendar-column">
                    <motion.section className="events-calendar" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} aria-labelledby="upcoming-events-title">
                        <h2 id="upcoming-events-title">{content.upcoming}</h2>
                        <div className="events-list">
                            {loading ? <p className="page-message">{content.loading}</p> : error ? <p className="page-message" role="alert">{content.error}</p> : upcomingEvents.length === 0 ? <p className="page-message">{content.empty}</p> : upcomingEvents.map(({ event, date }) => {
                                const title = language === "fr" ? event.titleFr : event.titleEn;
                                const description = language === "fr" ? event.descriptionFr : event.descriptionEn;
                                const location = language === "fr" ? event.locationFr : event.locationEn;
                                return <article className="event-card" key={event.id}>
                                    <time dateTime={event.eventDate}>{dateFormatter.format(date)}</time>
                                    <div>
                                        <h3>{title}</h3>
                                        {description && <p>{description}</p>}
                                        {location && <span>{location}</span>}
                                        {event.url && <a className="event-link" href={event.url} target="_blank" rel="noreferrer">{content.link}</a>}
                                    </div>
                                </article>;
                            })}
                        </div>
                    </motion.section>
                </div>
            </div>
        </main>
    );
}
