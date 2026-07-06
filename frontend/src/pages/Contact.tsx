import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { api, type ContactFormData } from "../api/client";
import { getLanguageFromPath } from "../utils/language";

const copy = {
    en: { title: "CONTACT", name: "Name", email: "Email", company: "Company", inquiry: "Inquiry type", message: "Message", choose: "Select a type", types: ["Speaking engagement", "Media", "Collaboration", "Other"], send: "Send message", sending: "Sending…", success: "Thank you. Your message has been sent.", error: "Your message could not be sent. Please try again.", required: "Please complete all required fields." },
    fr: { title: "CONTACT", name: "Nom", email: "Courriel", company: "Entreprise", inquiry: "Type de demande", message: "Message", choose: "Sélectionnez un type", types: ["Conférence", "Médias", "Collaboration", "Autre"], send: "Envoyer le message", sending: "Envoi…", success: "Merci. Votre message a été envoyé.", error: "Votre message n’a pas pu être envoyé. Veuillez réessayer.", required: "Veuillez remplir tous les champs obligatoires." },
};
const initialForm: ContactFormData = { name: "", email: "", company: "", inquiryType: "", message: "" };

export default function Contact() {
    const content = copy[getLanguageFromPath(useLocation().pathname)];
    const [form, setForm] = useState<ContactFormData>(initialForm);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "invalid">("idle");
    const update = (field: keyof ContactFormData, value: string) => { setForm((current) => ({ ...current, [field]: value })); if (status !== "submitting") setStatus("idle"); };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === "submitting") return;
        if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.inquiryType || !form.message.trim()) { setStatus("invalid"); return; }
        setStatus("submitting");
        try { await api.submitContact(form); setForm(initialForm); setStatus("success"); }
        catch { setStatus("error"); }
    };

    return (
        <main className="content-page">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="content-panel contact-panel">
                <h1>{content.title}</h1>
                <form onSubmit={submit} className="contact-form" noValidate>
                    <label>{content.name} *<input value={form.name} onChange={(e) => update("name", e.target.value)} required maxLength={255} /></label>
                    <label>{content.email} *<input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required maxLength={320} /></label>
                    <label>{content.company}<input value={form.company || ""} onChange={(e) => update("company", e.target.value)} maxLength={255} /></label>
                    <label>{content.inquiry} *<select value={form.inquiryType} onChange={(e) => update("inquiryType", e.target.value)} required><option value="">{content.choose}</option>{content.types.map((type) => <option key={type}>{type}</option>)}</select></label>
                    <label className="full-width">{content.message} *<textarea value={form.message} onChange={(e) => update("message", e.target.value)} required maxLength={10000} rows={5} /></label>
                    <div className="form-footer full-width">
                        <button type="submit" disabled={status === "submitting"}>{status === "submitting" ? content.sending : content.send}</button>
                        {status === "success" && <p role="status" className="form-success">{content.success}</p>}
                        {(status === "error" || status === "invalid") && <p role="alert" className="form-error">{status === "invalid" ? content.required : content.error}</p>}
                    </div>
                </form>
            </motion.div>
        </main>
    );
}
