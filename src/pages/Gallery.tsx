import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

import backgroundImage from "../assets/back.jpg";
import { getLanguageFromPath } from "../utils/language";

import galleryEn from "../data/en/gallery";
import galleryFr from "../data/fr/gallery";

import { galleryImages as galleryImagesEn } from "../data/en/galleryImages";
import { galleryImages as galleryImagesFr } from "../data/fr/galleryImages";

type GalleryImage = {
    src: string;
    caption: string;
};

function clamp(min: number, max: number, value: number) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, amount: number) {
    return start + (end - start) * amount;
}

export default function Gallery() {
    const location = useLocation();
    const language = getLanguageFromPath(location.pathname) as "fr" | "en";

    const content = language === "fr" ? galleryFr : galleryEn;
    const galleryImages =
        language === "fr" ? galleryImagesFr : galleryImagesEn;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
        null
    );

    const scroll = useRef({
        current: 0,
        target: 0,
        ease: 0.07,
        limit: 0,
    });

    const updateScrollLimit = () => {
        if (!wrapperRef.current || !containerRef.current) return;

        scroll.current.limit = Math.max(
            0,
            containerRef.current.scrollWidth - wrapperRef.current.clientWidth
        );
    };

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const container = containerRef.current;

        if (!wrapper || !container) return;

        let animationFrame = 0;

        const onWheel = (e: WheelEvent) => {
            scroll.current.target += e.deltaY;
        };

        const render = () => {
            scroll.current.target = clamp(
                0,
                scroll.current.limit,
                scroll.current.target
            );

            scroll.current.current = lerp(
                scroll.current.current,
                scroll.current.target,
                scroll.current.ease
            );

            container.style.transform = `translate3d(${-scroll.current.current}px, 0, 0)`;

            animationFrame = requestAnimationFrame(render);
        };

        updateScrollLimit();

        window.addEventListener("resize", updateScrollLimit);
        window.addEventListener("wheel", onWheel, { passive: true });

        animationFrame = requestAnimationFrame(render);

        return () => {
            window.removeEventListener("resize", updateScrollLimit);
            window.removeEventListener("wheel", onWheel);
            cancelAnimationFrame(animationFrame);
        };
    }, [galleryImages]);

    return (
        <main
            style={{
                width: "100%",
                height: "100vh",
                color: "white",
                position: "relative",
                overflow: "hidden",
                userSelect: "none",
                WebkitUserSelect: "none",
                backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                    position: "absolute",
                    left: "80px",
                    bottom: "80px",
                    zIndex: 1,
                    fontSize: "3.5rem",
                    fontWeight: 300,
                    margin: 0,
                }}
            >
                {content.title}
            </motion.h1>

            <div
                ref={wrapperRef}
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 0,
                }}
            >
                <div
                    ref={containerRef}
                    style={{
                        display: "flex",
                        gap: "16px",
                        padding: "0 48px",
                        willChange: "transform",
                    }}
                >
                    {galleryImages.map((image, index) => (
                        <button
                            key={`${image.src}-${index}`}
                            onClick={() => setSelectedImage(image)}
                            style={{
                                height: "520px",
                                width: "auto",
                                flexShrink: 0,
                                padding: 0,
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={image.src}
                                alt={image.caption}
                                draggable={false}
                                onLoad={updateScrollLimit}
                                style={{
                                    height: "100%",
                                    width: "auto",
                                    display: "block",
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    pointerEvents: "none",
                                }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 50,
                            background: "rgba(0,0,0,0.85)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "24px",
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: "fit-content",
                                maxWidth: "96vw",
                                maxHeight: "94vh",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "16px",
                            }}
                        >
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.caption}
                                draggable={false}
                                style={{
                                    width: "92vw",
                                    height: "84vh",
                                    objectFit: "contain",
                                    display: "block",
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                }}
                            />

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "1rem",
                                    fontWeight: 300,
                                    textAlign: "center",
                                    color: "rgba(255,255,255,0.85)",
                                }}
                            >
                                {selectedImage.caption}
                            </p>

                            <button
                                onClick={() => setSelectedImage(null)}
                                style={{
                                    marginTop: "4px",
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.5)",
                                    color: "white",
                                    padding: "8px 18px",
                                    cursor: "pointer",
                                    fontSize: "0.85rem",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                {content.close}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "220px",
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0))",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />
        </main>
    );
}