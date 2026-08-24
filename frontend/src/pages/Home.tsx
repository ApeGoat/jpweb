import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api, type Conference, type GalleryItem, type Publication } from "../api/client";
import ConferenceCard, { parseConferenceDate } from "../components/ConferenceCard";
import GalleryCarousel from "../components/GalleryCarousel";
import PublicationCard, { sortPublications } from "../components/PublicationCard";
import Biography from "./Biography";
import Contact from "./Contact";
import { getLanguageFromPath } from "../utils/language";
import homeFr from "../data/fr/home";
import homeEn from "../data/en/home";

const copy = {
 fr: { bio: "BIOGRAPHIE", publications: "PUBLICATIONS", gallery: "GALLERIE", conferences: "CONFÉRENCES", latest: "Dernière publication", upcoming: "Prochaines conférences", allPublications: "Voir toutes les publications", allGallery: "Voir toute la galerie", allConferences: "Voir toutes les conférences", loading: "Chargement…", pubError: "Impossible de charger les publications.", galleryError: "Impossible de charger la galerie.", conferenceError: "Impossible de charger les conférences.", pubEmpty: "Aucune publication n’est disponible.", galleryEmpty: "Aucune image n’est disponible.", conferenceEmpty: "Aucune conférence à venir." },
 en: { bio: "BIOGRAPHY", publications: "PUBLICATIONS", gallery: "GALLERY", conferences: "CONFERENCES", latest: "Latest publication", upcoming: "Upcoming conferences", allPublications: "View all publications", allGallery: "View full gallery", allConferences: "View all conferences", loading: "Loading…", pubError: "The publications could not be loaded.", galleryError: "The gallery could not be loaded.", conferenceError: "Conferences could not be loaded.", pubEmpty: "No publications are available.", galleryEmpty: "No images are available.", conferenceEmpty: "No upcoming conferences." }
};
type LoadState = "loading" | "ready" | "error";
export default function Home() {
 const location = useLocation(); const language = getLanguageFromPath(location.pathname); const hero = language === "fr" ? homeFr : homeEn; const text = copy[language];
 const [publications, setPublications] = useState<Publication[]>([]); const [gallery, setGallery] = useState<GalleryItem[]>([]); const [conferences, setConferences] = useState<Conference[]>([]);
 const [states, setStates] = useState<Record<"publications"|"gallery"|"conferences", LoadState>>({ publications:"loading", gallery:"loading", conferences:"loading" });
 useEffect(() => { let active = true; const load = <T,>(key: keyof typeof states, request: Promise<T[]>, setter: (v:T[])=>void) => request.then(v => { if(active){ setter(v); setStates(s=>({...s,[key]:"ready"})); }}).catch(()=>{if(active)setStates(s=>({...s,[key]:"error"}));}); load("publications",api.getPublications(),setPublications); load("gallery",api.getGallery(),setGallery); load("conferences",api.getConferences(),setConferences); return()=>{active=false;}; }, []);
 useEffect(() => { if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" })); }, [location.hash]);
 const latest = sortPublications(publications)[0];
 const upcoming = useMemo(() => { const today = new Date(); today.setHours(0,0,0,0); return conferences.map(event=>({event,date:parseConferenceDate(event.eventDate)})).filter((x): x is {event:Conference;date:Date}=>Boolean(x.date && x.event.visible !== false && x.date >= today)).sort((a,b)=>a.date.getTime()-b.date.getTime()).slice(0,2); },[conferences]);
 const message = (state:LoadState,error:string,empty:string,hasItems:boolean) => state === "loading" ? text.loading : state === "error" ? error : !hasItems ? empty : null;
 return <main className="home-page">
  <section id="home" className="hero-section"><img className="hero-workmark" src={`${process.env.PUBLIC_URL}/jp-workmark${language === "en" ? "-en" : ""}.svg`} alt="" aria-hidden="true"/><h1 className="sr-only">{hero.name} — {hero.title}. {hero.motto}</h1></section>
  <section id="biography" className="landing-section biography-section"><Biography language={language}/></section>
  <section id="publications" className="landing-section"><div className="section-heading"><p>{text.latest}</p><h2>{text.publications}</h2></div>{latest ? <PublicationCard item={latest} language={language}/> : <p className="page-message">{message(states.publications,text.pubError,text.pubEmpty,false)}</p>}<Link className="view-all" to={language === "fr" ? "/publications" : "/en/publications"}>{text.allPublications} →</Link></section>
  <section id="gallery" className="landing-section gallery-preview"><div className="section-heading"><h2>{text.gallery}</h2></div>{gallery.length ? <GalleryCarousel items={gallery} language={language}/> : <p className="page-message">{message(states.gallery,text.galleryError,text.galleryEmpty,false)}</p>}<Link className="view-all" to={language === "fr" ? "/gallerie" : "/en/gallery"}>{text.allGallery} →</Link></section>
  <section id="conferences" className="landing-section"><div className="section-heading"><p>{text.upcoming}</p><h2>{text.conferences}</h2></div>{upcoming.length ? <div className="preview-events">{upcoming.map(x=><ConferenceCard key={x.event.id} event={x.event} date={x.date} language={language}/>)}</div> : <p className="page-message">{message(states.conferences,text.conferenceError,text.conferenceEmpty,false)}</p>}<Link className="view-all" to={language === "fr" ? "/conferences" : "/en/conferences"}>{text.allConferences} →</Link></section>
  <section id="contact" className="landing-section contact-section"><Contact embedded /></section>
 </main>;
}
