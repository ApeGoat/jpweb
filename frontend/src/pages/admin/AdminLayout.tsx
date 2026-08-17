import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
    return (
        <main className="admin-shell">
            <header className="admin-header">
                <Link to="/admin" className="admin-brand">Administration JP</Link>
                <nav aria-label="Navigation de l’administration">
                    <NavLink to="/admin/publications">Publications</NavLink>
                    <NavLink to="/admin/conferences">Conférences</NavLink>
                    <NavLink to="/admin/gallery">Galerie</NavLink>
                    <Link to="/">Voir le site Web</Link>
                </nav>
            </header>
            <section className="admin-content">
                <h1>{title}</h1>
                {children}
            </section>
        </main>
    );
}

export function AdminMessage({ error, children }: { error?: boolean; children: ReactNode }) {
    return <p className={`admin-message${error ? " error" : ""}`} role={error ? "alert" : "status"}>{children}</p>;
}
