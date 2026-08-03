import type {
    ContactFormData,
    GalleryItem,
    GalleryUpdateData,
    LoginRequest,
    Publication,
    PublicationFormData,
} from "./types";

const DEFAULT_API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = (
    process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

type RequestOptions = Omit<RequestInit, "body"> & {
    admin?: boolean;
    body?: BodyInit;
    json?: unknown;
};

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const { admin = false, body, headers, json, ...init } = options;
    const requestHeaders = new Headers(headers);
    const requestBody = json === undefined ? body : JSON.stringify(json);

    if (json !== undefined && !requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
    }

    const fetchOptions: RequestInit = {
        ...init,
        body: requestBody,
        headers: requestHeaders,
    };

    if (admin) {
        fetchOptions.credentials = "include";
    }

    const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

    if (admin && (response.status === 401 || response.status === 403)) {
        window.location.assign("/admin/login");
        throw new ApiError("Unauthorized", response.status);
    }

    if (!response.ok) {
        const responseBody = await response.text();
        throw new ApiError(
            responseBody || `Request failed with status ${response.status}`,
            response.status,
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const api = {
    getGallery: () => request<GalleryItem[]>("/api/gallery"),

    getPublications: () => request<Publication[]>("/api/publications"),

    submitContact: (data: ContactFormData) =>
        request<void>("/api/contact", { method: "POST", json: data }),

    login: (data: LoginRequest) =>
        request<{ username: string; message: string }>("/api/auth/login", {
            method: "POST",
            credentials: "include",
            json: data,
        }),

    adminGetPublications: () =>
        request<Publication[]>("/api/admin/publications", { admin: true }),

    adminCreatePublication: (data: PublicationFormData) =>
        request<Publication>("/api/admin/publications", {
            method: "POST",
            admin: true,
            json: data,
        }),

    adminUpdatePublication: (id: number, data: PublicationFormData) =>
        request<Publication>(`/api/admin/publications/${id}`, {
            method: "PUT",
            admin: true,
            json: data,
        }),

    adminDeletePublication: (id: number) =>
        request<void>(`/api/admin/publications/${id}`, {
            method: "DELETE",
            admin: true,
        }),

    adminGetGallery: () =>
        request<GalleryItem[]>("/api/admin/gallery", { admin: true }),

    adminUploadGalleryImage: (formData: FormData) =>
        request<GalleryItem>("/api/admin/gallery/upload", {
            method: "POST",
            admin: true,
            body: formData,
        }),

    adminUpdateGalleryImage: (id: number, data: GalleryUpdateData) =>
        request<GalleryItem>(`/api/admin/gallery/${id}`, {
            method: "PUT",
            admin: true,
            json: data,
        }),

    adminDeleteGalleryImage: (id: number) =>
        request<void>(`/api/admin/gallery/${id}`, {
            method: "DELETE",
            admin: true,
        }),
};

export type {
    ContactFormData,
    GalleryItem,
    GalleryUpdateData,
    LoginRequest,
    Publication,
    PublicationFormData,
} from "./types";
