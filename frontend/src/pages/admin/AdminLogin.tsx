import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState("");

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (state === "loading") return;
        setState("loading");
        setError("");
        try {
            await api.login({ username, password });
            setState("success");
            navigate("/admin", { replace: true });
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Login failed.");
            setState("error");
        }
    }

    return (
        <main className="admin-login">
            <form className="admin-form admin-login-card" onSubmit={submit}>
                <h1>Admin login</h1>
                <label>Username<input autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} /></label>
                <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                {state === "error" && <p className="admin-message error" role="alert">{error}</p>}
                {state === "success" && <p className="admin-message" role="status">Login successful. Redirecting…</p>}
                <button type="submit" disabled={state === "loading" || state === "success"}>{state === "loading" ? "Signing in…" : "Sign in"}</button>
            </form>
        </main>
    );
}
