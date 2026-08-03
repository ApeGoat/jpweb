export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
  altText: string;
  displayOrder: number;
  visible: boolean;
}

export type PublicationType = "ARTICLE" | "LINK" | "VIDEO" | "CONFERENCE" | "OTHER";
export type PublicationStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export interface Publication {
  id: number;
  title: string;
  description: string;
  type: PublicationType;
  publishedDate: string | null;
  url?: string;
  thumbnailUrl?: string;
  featured: boolean;
  status: PublicationStatus;
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
  displayOrder: number;
  visible: boolean;
}
