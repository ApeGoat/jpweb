import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
    return <AdminLayout title="Dashboard"><div className="admin-dashboard">
        <Link to="/admin/publications"><h2>Publications</h2><p>Add, edit, publish, or remove publications.</p></Link>
        <Link to="/admin/gallery"><h2>Gallery</h2><p>Upload images and manage captions and alt text.</p></Link>
    </div></AdminLayout>;
}
