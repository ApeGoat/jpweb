export type Language = "fr" | "en";

export function getLanguageFromPath(pathname: string): Language {
    return pathname.startsWith("/en") ? "en" : "fr";
}

export function getAlternateLanguagePath(pathname: string): string {
    const pathMap: Record<string, string> = {
        "/": "/en",
        "/biographie": "/en/biography",
        "/conferences": "/en/conferences",
        "/photos": "/en/gallery",
        "/en": "/",
        "/en/biography": "/biographie",
        "/en/conferences": "/conferences",
        "/en/gallery": "/photos",
    };

    return pathMap[pathname] || "/";
}