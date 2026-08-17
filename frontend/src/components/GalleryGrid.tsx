import type { GalleryItem } from "../api/client";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
    return <div className="gallery-grid">{items.map((item) => <figure key={item.id}>
        <img src={item.imageUrl} alt={item.altText} loading="lazy" />{item.caption && <figcaption>{item.caption}</figcaption>}
    </figure>)}</div>;
}
