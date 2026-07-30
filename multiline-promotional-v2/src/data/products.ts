import { Product, ClientReview } from "../types";

// NOTE: Category data now lives in MySQL and is served via GET /api/categories
// (consumed through ProductContext -> useProducts().categories). The static
// CATEGORIES array that used to live here was dead code once every component
// switched to the live backend data, so it has been removed. Product rows
// also come exclusively from the database now; PRODUCTS below is kept only
// as an empty placeholder for type-import compatibility.

export const PRODUCTS: Product[] = [];

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: "rev-1",
    name: "Colonel Tariq Mahmood",
    role: "Director of Procurements",
    company: "Pakistan Armed Forces",
    review: "Multiline Promotional has consistently delivered spectacular customized awards and commemorative coin sets on remarkably tight schedules.",
    rating: 5,
  },
  {
    id: "rev-2",
    name: "Ayesha Malik",
    role: "Brand & Events Specialist",
    company: "UET Lahore Alumni Association",
    review: "We ordered 500 custom gold winner medals and embroidered caps for our grand centenary reunion. Excellent service!",
    rating: 5,
  },
  {
    id: "rev-3",
    name: "Dr. Kamran Baig",
    role: "Academic Dean",
    company: "Punjab University",
    review: "The custom premium wooden shield plaques we commissioned for our guest lecturers are gorgeous. Highly recommended.",
    rating: 5,
  },
];
