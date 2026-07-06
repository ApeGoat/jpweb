import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { getLanguageFromPath } from "../utils/language";
import homeFr from "../data/fr/home";
import homeEn from "../data/en/home";

export default function Home() {
    const location = useLocation();
    const language = getLanguageFromPath(location.pathname);

    const content = language === "fr" ? homeFr : homeEn;

    return (
        <main
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                color: "white",
            }}
        >
            <div
                style={{
                    padding: "0 0 80px 80px",
                    maxWidth: "1200px",
                }}
            >
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        fontSize: "1.5rem",
                        marginBottom: "16px",
                    }}
                >
                    🇨🇦 <em>{content.motto}</em>
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{
                        fontSize: "3.5rem",
                        fontWeight: 300,
                        lineHeight: 1.1,
                        margin: 0,
                    }}
                >
                    {content.name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    style={{
                        fontSize: "1.5rem",
                        lineHeight: 1.3,
                        marginTop: "16px",
                        maxWidth: "900px",
                    }}
                >
                    {content.title}
                </motion.p>
            </div>
        </main>
    );
}