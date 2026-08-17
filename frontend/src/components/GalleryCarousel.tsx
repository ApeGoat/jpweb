import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { GalleryItem } from "../api/client";
import type { Language } from "../utils/language";

function clamp(min: number, max: number, value: number) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, amount: number) {
    return start + (end - start) * amount;
}

export default function GalleryCarousel({ items, language }: { items: GalleryItem[]; language: Language }) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [selected, setSelected] = useState<GalleryItem | null>(null);
    const scroll = useRef({ current: 0, target: 0, ease: 0.07, limit: 0 });

    const updateScrollLimit = useCallback(() => {
        if (!wrapperRef.current || !trackRef.current) return;
        scroll.current.limit = Math.max(0, trackRef.current.scrollWidth - wrapperRef.current.clientWidth);
        scroll.current.target = clamp(0, scroll.current.limit, scroll.current.target);
        scroll.current.current = clamp(0, scroll.current.limit, scroll.current.current);
    }, []);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const track = trackRef.current;
        if (!wrapper || !track) return;
        let animationFrame = 0;

        const onWheel = (event: WheelEvent) => {
            const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            const nextTarget = clamp(0, scroll.current.limit, scroll.current.target + delta);
            const canMove = nextTarget !== scroll.current.target;
            if (canMove) {
                event.preventDefault();
                scroll.current.target = nextTarget;
            }
        };
        const render = () => {
            scroll.current.current = lerp(scroll.current.current, scroll.current.target, scroll.current.ease);
            track.style.transform = `translate3d(${-scroll.current.current}px, 0, 0)`;
            animationFrame = requestAnimationFrame(render);
        };

        updateScrollLimit();
        wrapper.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("resize", updateScrollLimit);
        animationFrame = requestAnimationFrame(render);
        return () => {
            wrapper.removeEventListener("wheel", onWheel);
            window.removeEventListener("resize", updateScrollLimit);
            cancelAnimationFrame(animationFrame);
        };
    }, [items, updateScrollLimit]);

    if (!items.length) return null;
    return <>
        <div ref={wrapperRef} className="gallery-carousel" aria-roledescription="carousel" tabIndex={0}>
            <div ref={trackRef} className="gallery-carousel-track">
                {items.map((item) => <button key={item.id} className="carousel-image" onClick={() => setSelected(item)}>
                    <img src={item.imageUrl} alt={item.altText} draggable={false} onLoad={updateScrollLimit} />
                    {item.caption && <span>{item.caption}</span>}
                </button>)}
            </div>
        </div>
        <AnimatePresence>{selected && <motion.div className="gallery-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <div onClick={(event) => event.stopPropagation()}><img src={selected.imageUrl} alt={selected.altText} />{selected.caption && <p>{selected.caption}</p>}<button onClick={() => setSelected(null)}>{language === "fr" ? "Fermer" : "Close"}</button></div>
        </motion.div>}</AnimatePresence>
    </>;
}
