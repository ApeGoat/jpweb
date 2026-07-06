import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { getLanguageFromPath } from "../utils/language";
import biographyFr from "../data/fr/biography";
import biographyEn from "../data/en/biography";

type SectionProps = {
    body: string;
    centered?: boolean;
    bold?: boolean;
};

function BiographySection({
                              body,
                              centered = false,
                              bold = false,
                          }: SectionProps) {
    return (
        <section
            style={{
                marginBottom: "28px",
            }}
        >
            <p
                style={{
                    fontSize: "1.22rem",
                    lineHeight: 1.8,
                    fontWeight: bold ? 500 : 300,
                    margin: 0,
                    textAlign: centered ? "center" : "left",
                }}
            >
                {body}
            </p>
        </section>
    );
}

export default function Biography() {
    const location = useLocation();
    const language = getLanguageFromPath(location.pathname) as "fr" | "en";
    const content = language === "fr" ? biographyFr : biographyEn;

    return (
        <main
            style={{
                position: "absolute",
                inset: 0,
                overflowY: "auto",
                overflowX: "hidden",
                color: "white",
                zIndex: 1,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollSnapType: "y mandatory",
                scrollBehavior: "smooth",
            }}
        >
            <style>
                {`
                    main::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>

            <section
                style={{
                    minHeight: "88vh",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "0 80px 110px 80px",
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                }}
            >
                <div style={{ maxWidth: "900px" }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        style={{
                            fontSize: "3.6rem",
                            fontWeight: 300,
                            margin: 0,
                            marginBottom: "20px",
                        }}
                    >
                        {content.title}
                    </motion.h1>
                </div>
            </section>

            <section
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    padding: "50px 80px",
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                    position: "relative",
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.65 }}
                    viewport={{ once: false, amount: 0.35 }}
                    transition={{ duration: 0.7 }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "black",
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        width: "100%",
                        maxWidth: "950px",
                        margin: "0 auto",
                        padding: "42px 52px",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <BiographySection body={content.sections[0]} />
                    <BiographySection body={content.sections[1]} />
                    <BiographySection body={content.sections[2]} />
                    <BiographySection body={content.sections[3]} />
                </motion.div>
            </section>
        </main>
    );
}