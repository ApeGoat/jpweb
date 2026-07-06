import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

import { api, type GalleryItem } from "../api/client";
import backgroundImage from "../assets/back.jpg";
import { getLanguageFromPath } from "../utils/language";

import galleryEn from "../data/en/gallery";
import galleryFr from "../data/fr/gallery";

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

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

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
        let isActive = true;

        const loadGallery = async () => {
            try {
                const items = await api.getGallery();
                if (isActive) setGalleryItems(items);
            } catch {
                if (isActive) setHasError(true);
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        void loadGallery();

        return () => {
            isActive = false;
        };
    }, []);

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
    }, [galleryItems]);

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
                {(isLoading || hasError || galleryItems.length === 0) && (
                    <p
                        role={hasError ? "alert" : "status"}
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            margin: 0,
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "1rem",
                            fontWeight: 300,
                            textAlign: "center",
                        }}
                    >
                        {isLoading
                            ? content.loading
                            : hasError
                              ? content.error
                              : content.empty}
                    </p>
                )}
                <div
                    ref={containerRef}
                    style={{
                        display: "flex",
                        gap: "16px",
                        padding: "0 48px",
                        willChange: "transform",
                    }}
                >
                    {galleryItems.map((image) => (
                        <button
                            key={image.id}
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
                                position: "relative",
                            }}
                        >
                            <img
                                src={image.imageUrl}
                                alt={image.altText}
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
                            <span
                                style={{
                                    position: "absolute",
                                    inset: "auto 0 0",
                                    padding: "48px 16px 16px",
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                    color: "white",
                                    fontSize: "0.95rem",
                                    fontWeight: 300,
                                    textAlign: "left",
                                }}
                            >
                                {/*{image.caption}*/}
                            </span>
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
                                src={selectedImage.imageUrl}
                                alt={selectedImage.altText}
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
