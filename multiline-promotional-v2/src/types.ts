export interface Product {
  id: string;
  title: string;
  slug?: string;
  category: string; // matches Category slug or id
  description: string;
  longDescription?: string;
  image: string; // main thumbnail URL or placeholder key
  images?: string[]; // multiple images array
  isFeatured?: boolean;
  status?: "Active" | "Inactive";
  minOrder: number;
  specs: { label: string; value: string }[];
  priceInquiryNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Category {
  id: string;
  title: string; // Category Name
  slug: string;
  tagline?: string;
  description: string;
  bannerImage?: string;
  featuredImage?: string;
  iconName?: string;
  status?: "Active" | "Inactive";
  featuredOnHomepage?: boolean;
  sortOrder?: number;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
  customizationNotes?: string;
}

export interface QuoteRequest {
  id: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  org?: string;
  dateNeeded?: string;
  city?: string;
  commPref: string;
  extraDetails?: string;
  items: QuoteItem[];
  status: "Pending" | "Reviewed" | "Contacted" | "Completed";
}

export interface ContactMessage {
  id: string;
  date: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "Unread" | "Read" | "Replied";
}

export interface ClientReview {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  rating: number;
}

