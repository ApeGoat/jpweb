import { useLocation } from "react-router-dom";
import biographyFr from "../data/fr/biography";
import biographyEn from "../data/en/biography";
import { getLanguageFromPath, type Language } from "../utils/language";

export default function Biography({ language: suppliedLanguage }: { language?: Language }) {
    const location = useLocation(); const language = suppliedLanguage || getLanguageFromPath(location.pathname); const content = language === "fr" ? biographyFr : biographyEn;
    return <div className="biography-content"><h2>{content.title}</h2><div className="biography-copy">{content.sections.map((body, index) => <p key={index}>{body}</p>)}</div></div>;
}
