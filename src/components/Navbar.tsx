import { NavLink, useLocation } from "react-router-dom";
import { getLanguageFromPath } from "../utils/language";
import { motion } from "motion/react";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
    const location = useLocation();
    const language = getLanguageFromPath(location.pathname);

    const links =
        language === "fr"
            ? [
                { name: "ACCUEIL", path: "/" },
                { name: "BIOGRAPHIE", path: "/biographie" },
                { name: "CONFÉRENCES", path: "/conferences" },
                { name: "PHOTOS", path: "/photos" },
            ]
            : [
                { name: "HOME", path: "/en" },
                { name: "BIOGRAPHY", path: "/en/biography" },
                { name: "CONFERENCES", path: "/en/conferences" },
                { name: "GALLERY", path: "/en/gallery" },
            ];

    return (
        <nav
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                padding: "24px 48px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 20,
                boxSizing: "border-box",
            }}
        >
            <LanguageSelector />

            <div style={{ display: "flex", gap: "40px" }}>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        style={{
                            position: "relative",
                            color: "white",
                            textDecoration: "none",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                        }}
                    >
                        {({ isActive }) => (
                            <div style={{ position: "relative", paddingBottom: "6px" }}>
                                {link.name}

                                {isActive && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            bottom: 0,
                                            width: "100%",
                                            height: "2px",
                                            background: "white",
                                        }}
                                        transition={{ duration: 0.25 }}
                                    />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}