import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
    return <AdminLayout title="Tableau de bord"><div className="admin-dashboard">
        <Link to="/admin/publications"><h2>Publications</h2><p>Ajouter, modifier, publier ou supprimer des publications.</p></Link>
        <Link to="/admin/conferences"><h2>Conférences</h2><p>Ajouter, modifier, afficher, masquer ou supprimer des conférences.</p></Link>
        <Link to="/admin/gallery"><h2>Galerie</h2><p>Téléverser des images et gérer leurs légendes et textes alternatifs.</p></Link>
    </div></AdminLayout>;
}
