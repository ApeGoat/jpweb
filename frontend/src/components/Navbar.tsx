import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getLanguageFromPath } from "../utils/language";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
 const location = useLocation(); const language = getLanguageFromPath(location.pathname); const home = language === "fr" ? "/" : "/en";
 const navbarRef = useRef<HTMLElement | null>(null);
 const [activeSection, setActiveSection] = useState("home");
 const links = language === "fr" ? [{name:"ACCUEIL",id:"home"},{name:"BIOGRAPHIE",id:"biography"},{name:"PUBLICATIONS",id:"publications"},{name:"GALLERIE",id:"gallery"},{name:"CONFÉRENCES",id:"conferences"},{name:"CONTACT",id:"contact"}] : [{name:"HOME",id:"home"},{name:"BIOGRAPHY",id:"biography"},{name:"PUBLICATIONS",id:"publications"},{name:"GALLERY",id:"gallery"},{name:"CONFERENCES",id:"conferences"},{name:"CONTACT",id:"contact"}];
 const onHome = location.pathname === home || (language === "fr" && location.pathname === "/jpweb/");
 useEffect(() => {
  if (!onHome) {
   const routeSection: Record<string, string> = {
    "/publications": "publications", "/en/publications": "publications",
    "/gallerie": "gallery", "/en/gallery": "gallery",
    "/conferences": "conferences", "/en/conferences": "conferences",
   };
   setActiveSection(routeSection[location.pathname] || "home");
   return;
  }
  const ratios = new Map<string, number>();
  const sections = links.map(({ id }) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
  const observer = new IntersectionObserver((entries) => {
   entries.forEach((entry) => ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
   const visible = Array.from(ratios.entries()).sort((a, b) => b[1] - a[1])[0];
   if (visible && visible[1] > 0) setActiveSection(visible[0]);
  }, { rootMargin: "-76px 0px -45% 0px", threshold: [0, 0.15, 0.3, 0.5, 0.75] });
  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
 }, [location.pathname, onHome]);
 useEffect(() => {
  const navbar = navbarRef.current;
  if (!navbar) return;
  let animationFrame = 0;
  const updateBackground = () => {
   animationFrame = 0;
   const opacity = onHome ? Math.min(window.scrollY / 100, 1) : 1;
   navbar.style.setProperty("--navbar-opacity", opacity.toFixed(3));
  };
  const onScroll = () => {
   if (!animationFrame) animationFrame = window.requestAnimationFrame(updateBackground);
  };
  updateBackground();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
   window.removeEventListener("scroll", onScroll);
   if (animationFrame) window.cancelAnimationFrame(animationFrame);
  };
 }, [onHome]);
 return <nav ref={navbarRef} className={`public-navbar${onHome ? "" : " public-navbar--solid"}`}><LanguageSelector/><div className="navbar-links">{links.map(link => <Link className={`nav-item${activeSection === link.id ? " active" : ""}`} key={link.id} to={`${home}#${link.id}`} onClick={(event) => { setActiveSection(link.id); if(onHome){ event.preventDefault(); window.history.replaceState(null,"",`${home}#${link.id}`); document.getElementById(link.id)?.scrollIntoView({behavior:"smooth"}); } }}>{link.name}</Link>)}</div></nav>;
}
