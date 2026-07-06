import { NavLink, useLocation } from "react-router-dom";
import { getAlternateLanguagePath, getLanguageFromPath } from "../utils/language";

export default function LanguageSelector() {
    const location = useLocation();
    const language = getLanguageFromPath(location.pathname);

    const alternatePath = getAlternateLanguagePath(location.pathname);
    const frPath = language === "fr" ? location.pathname : alternatePath;
    const enPath = language === "en" ? location.pathname : alternatePath;

    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                color: "white",
                fontWeight: 600,
                letterSpacing: "1px",
            }}
        >
            <NavLink
                to={frPath}
                style={{
                    color: language === "fr" ? "white" : "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                }}
            >
                FR
            </NavLink>

            <span style={{ opacity: 0.6 }}>|</span>

            <NavLink
                to={enPath}
                style={{
                    color: language === "en" ? "white" : "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                }}
            >
                EN
            </NavLink>
        </div>
    );
}
