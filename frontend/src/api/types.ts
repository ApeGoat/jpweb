export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
  altText: string;
}

export interface Publication {
  id: number;
  title: string;
  description: string;
  type: string;
  date?: string;
  publishedDate?: string;
  url?: string;
  linkUrl?: string;
  videoUrl?: string;
  conferenceUrl?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  inquiryType: string;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type PublicationFormData = Omit<Publication, "id">;

export interface GalleryUpdateData {
  caption: string;
  altText: string;
}
