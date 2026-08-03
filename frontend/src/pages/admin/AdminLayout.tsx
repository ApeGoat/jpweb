import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
    return (
        <main className="admin-shell">
            <header className="admin-header">
                <Link to="/admin" className="admin-brand">JP Admin</Link>
                <nav aria-label="Admin navigation">
                    <NavLink to="/admin/publications">Publications</NavLink>
                    <NavLink to="/admin/gallery">Gallery</NavLink>
                    <Link to="/">View website</Link>
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
