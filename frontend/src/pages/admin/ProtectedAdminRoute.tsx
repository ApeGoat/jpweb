import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api, ApiError } from "../../api/client";

type AuthState = "checking" | "authenticated" | "unauthenticated" | "error";

export default function ProtectedAdminRoute() {
    const [authState, setAuthState] = useState<AuthState>("checking");

    useEffect(() => {
        let active = true;

        api.checkAdminSession()
            .then(() => {
                if (active) setAuthState("authenticated");
            })
            .catch((reason) => {
                if (!active) return;
                setAuthState(
                    reason instanceof ApiError &&
                    (reason.status === 401 || reason.status === 403)
                        ? "unauthenticated"
                        : "error"
                );
            });

        return () => {
            active = false;
        };
    }, []);

    if (authState === "unauthenticated") {
        return <Navigate to="/admin/login" replace />;
    }

    if (authState === "error") {
        return <p className="admin-message error" role="alert">Impossible de vérifier la session administrateur.</p>;
    }

    return authState === "authenticated" ? <Outlet /> : null;
}
