import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, type Conference } from "../api/client";
import ConferenceCard, { parseConferenceDate } from "../components/ConferenceCard";
import { getLanguageFromPath } from "../utils/language";
const copy = { en: { title: "CONFERENCES", events: "Events", empty: "No events are available.", loading: "Loading events…", error: "Events could not be loaded." }, fr: { title: "CONFÉRENCES", events: "Événements", empty: "Aucun événement n’est disponible.", loading: "Chargement des événements…", error: "Impossible de charger les événements." } };
export default function Conferences() {
 const language = getLanguageFromPath(useLocation().pathname); const content = copy[language]; const [items, setItems] = useState<Conference[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
 useEffect(() => { let active = true; api.getConferences().then(v => { if (active) setItems(v); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
 const events = useMemo(() => items.map(event => ({ event, date: parseConferenceDate(event.eventDate) })).filter((entry): entry is { event: Conference; date: Date } => Boolean(entry.date && entry.event.visible !== false)).sort((a,b) => a.date.getTime()-b.date.getTime()), [items]);
 return <main className="content-page"><div className="content-panel"><h1>{content.title}</h1><section className="events-calendar full-events"><h2>{content.events}</h2><div className="events-list">{loading ? <p className="page-message">{content.loading}</p> : error ? <p className="page-message" role="alert">{content.error}</p> : !events.length ? <p className="page-message">{content.empty}</p> : events.map(({event,date}) => <ConferenceCard key={event.id} event={event} date={date} language={language} />)}</div></section></div></main>;
}
