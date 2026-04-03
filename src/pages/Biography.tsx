import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLocation } from "react-router-dom";
import { getLanguageFromPath } from "../utils/language";
import biographyFr from "../data/fr/biography";
import biographyEn from "../data/en/biography";
import spaceImage from "../assets/space.jpg";
import publicImage from "../assets/public.jpg";
import governorImage from "../assets/governor.jpg";



type SectionProps = {
    title: string;
    body: string;
    image: string;
    reverse?: boolean;
    language: "fr" | "en";
};

function BiographySection({
                              title,
                              body,
                              image,
                              reverse = false,
                              language,
                          }: SectionProps) {
    const ref = useRef<HTMLElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const textY = useTransform(scrollYProgress, [0, 1], [25, -25]);

    return (
        <section
            ref={ref}
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                padding: "120px 80px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.7 }}
                    viewport={{ once: false, amount: 0.35 }}
                    transition={{ duration: 0.45 }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "black",
                        zIndex: 0,
                        pointerEvents: "none",
                        width: "100vw",
                        x: "-17.85vw",
                    }}
                />

                <div
                    style={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: reverse ? "1fr 1.15fr" : "1.15fr 1fr",
                        gap: "56px",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1,
                        padding: "56px",
                    }}
                >
                    {!reverse && (
                        <motion.div style={{ y: textY }}>
                            <h2
                                style={{
                                    fontSize: "2.3rem",
                                    fontWeight: 300,
                                    marginTop: 0,
                                    marginBottom: "22px",
                                }}
                            >
                                {title}
                            </h2>

                            <p
                                style={{
                                    fontSize: "1.15rem",
                                    lineHeight: 1.85,
                                    margin: 0,
                                    maxWidth: "700px",
                                }}
                            >
                                {body}
                            </p>
                        </motion.div>
                    )}

                    <motion.div
                        style={{
                            y: imageY,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "black",
                            padding: "40px 0",
                            borderRadius: "20px",
                            minHeight: "460px",
                            overflow: "hidden",
                            marginBottom: "6rem",
                        }}
                    >
                        <img
                            src={image}
                            alt={language === "fr" ? `Section ${title}` : `${title} section`}
                            style={{
                                width: "100%",
                                maxHeight: "380px",
                                objectFit: "contain",
                                objectPosition: "center center",
                                display: "block",
                            }}
                        />
                    </motion.div>

                    {reverse && (
                        <motion.div style={{ y: textY }}>
                            <h2
                                style={{
                                    fontSize: "2.3rem",
                                    fontWeight: 300,
                                    marginTop: 0,
                                    marginBottom: "22px",
                                }}
                            >
                                {title}
                            </h2>

                            <p
                                style={{
                                    fontSize: "1.15rem",
                                    lineHeight: 1.85,
                                    margin: 0,
                                    maxWidth: "700px",
                                }}
                            >
                                {body}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function Biography() {
    const location = useLocation();
    const language = getLanguageFromPath(location.pathname) as "fr" | "en";
    const content = language === "fr" ? biographyFr : biographyEn;

    const governorRef = useRef<HTMLElement | null>(null);
    const { scrollYProgress: governorProgress } = useScroll({
        target: governorRef,
        offset: ["start end", "end start"],
    });

    const governorImageY = useTransform(governorProgress, [0, 1], [50, -50]);
    const governorTextY = useTransform(governorProgress, [0, 1], [20, -20]);
    const governorOpacity = useTransform(governorProgress, [0, 0.15, 0.85, 1], [0.85, 1, 1, 0.85]);

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
            }}
        >
            <style>
                {`
                    main::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>

            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "90px",
                    zIndex: 2,
                    pointerEvents: "none",
                }}
            />

            <section
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "500px 80px 100px 80px",
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

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        style={{
                            fontSize: "1.45rem",
                            lineHeight: 1.45,
                            margin: 0,
                            maxWidth: "780px",
                        }}
                    >
                        {content.intro}
                    </motion.p>
                </div>
            </section>

            <BiographySection
                title={content.spaceTitle}
                body={content.spaceBody}
                image={spaceImage}
                language={language}
            />

            <BiographySection
                title={content.publicTitle}
                body={content.publicBody}
                image={publicImage}
                reverse
                language={language}
            />

            <section
                ref={governorRef}
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    padding: "120px 80px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1100px",
                        margin: "0 auto",
                        position: "relative",
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.7 }}
                        viewport={{ once: false, amount: 0.35 }}
                        transition={{ duration: 0.45 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "black",
                            zIndex: 0,
                            pointerEvents: "none",
                            width: "100vw",
                            x: "-20.5vw",                        }}
                    />

                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            textAlign: "center",
                            padding: "56px",
                        }}
                    >
                        <motion.p
                            style={{
                                y: governorTextY,
                                opacity: governorOpacity,
                                fontSize: "2rem",
                                lineHeight: 1.45,
                                fontWeight: 300,
                                marginBottom: "40px",
                                maxWidth: "900px",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            {content.governorHighlight}
                        </motion.p>

                        <motion.img
                            src={governorImage}
                            alt={
                                language === "fr"
                                    ? "Portrait officiel de Julie Payette"
                                    : "Official portrait of Julie Payette"
                            }
                            style={{
                                y: governorImageY,
                                opacity: governorOpacity,
                                width: "100%",
                                maxWidth: "20rem",
                                display: "block",
                                margin: "0 auto 3rem",
                                borderRadius: "20px",
                            }}
                        />
                    </div>
                </div>
            </section>

            <section
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    padding: "120px 80px 140px 80px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "920px",
                        margin: "0 auto",
                        position: "relative",
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.7 }}
                        viewport={{ once: false, amount: 0.35 }}
                        transition={{ duration: 0.45 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "black",
                            zIndex: 0,
                            pointerEvents: "none",
                            width: "100vw",
                            x: "-25.35vw",
                        }}
                    />

                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            padding: "56px",
                        }}
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7 }}
                            style={{
                                fontSize: "2.3rem",
                                fontWeight: 300,
                                marginTop: 0,
                                marginBottom: "22px",
                            }}
                        >
                            {content.distinctionsTitle}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            style={{
                                fontSize: "1.15rem",
                                lineHeight: 1.85,
                                margin: 0,
                                maxWidth: "820px",
                            }}
                        >
                            {content.distinctionsBody}
                        </motion.p>
                    </div>
                </div>
            </section>
        </main>
    );
}