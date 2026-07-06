import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import conferencesEn from "../data/en/conferences";
import conferencesFr from "../data/fr/conferences";
import { getLanguageFromPath } from "../utils/language";

function dateFromOffset(offset: number) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
}

export default function Conferences() {
    const language = getLanguageFromPath(useLocation().pathname);
    const content = language === "fr" ? conferencesFr : conferencesEn;
    const today = dateFromOffset(0);
    const endDate = dateFromOffset(7);
    const upcomingEvents = content.events
        .map((event) => ({ ...event, date: dateFromOffset(event.dayOffset) }))
        .filter((event) => event.date >= today && event.date <= endDate)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    const dateFormatter = new Intl.DateTimeFormat(language === "fr" ? "fr-CA" : "en-CA", {
        weekday: "short", month: "short", day: "numeric",
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
                            {upcomingEvents.length === 0 ? <p className="page-message">{content.empty}</p> : upcomingEvents.map((event) => (
                                <article className="event-card" key={`${event.dayOffset}-${event.title}`}>
                                    <time dateTime={event.date.toISOString().slice(0, 10)}>{dateFormatter.format(event.date)}</time>
                                    <div>
                                        <h3>{event.title}</h3>
                                        {event.description && <p>{event.description}</p>}
                                        {event.location && <span>{event.location}</span>}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </div>
        </main>
    );
}
