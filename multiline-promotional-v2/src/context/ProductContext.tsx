import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, QuoteRequest, ContactMessage } from "../types";
import { apiRequest } from "../config/api";

interface ProductContextType {
  products: Product[];
  categories: Category[];
  quotes: QuoteRequest[];
  messages: ContactMessage[];

  // Products CRUD
  addProduct: (product: Omit<Product, "id">) => Promise<Product | undefined>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | undefined>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Categories CRUD
  addCategory: (category: Omit<Category, "id">) => Promise<Category | undefined>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<Category | undefined>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Quotes CRUD / Methods
  addQuote: (quote: Omit<QuoteRequest, "id" | "date" | "status">) => Promise<QuoteRequest | undefined>;
  updateQuoteStatus: (id: string, status: QuoteRequest["status"]) => Promise<QuoteRequest | undefined>;
  deleteQuote: (id: string) => Promise<boolean>;

  // Messages CRUD / Methods
  addMessage: (msg: Omit<ContactMessage, "id" | "date" | "status">) => Promise<ContactMessage | undefined>;
  updateMessageStatus: (id: string, status: ContactMessage["status"]) => Promise<ContactMessage | undefined>;
  deleteMessage: (id: string) => Promise<boolean>;

  // Global resets
  resetAllCatalogs: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// requestJson now delegates to the single, centralized fetch helper in
// src/config/api.ts so the base URL only has to be configured in one place.
const requestJson = apiRequest;

const normalizeProduct = (row: any): Product => ({
  ...row,
  id: row.id,
  title: row.title,
  slug: row.slug || row.id,
  category: row.category || row.category_id || "",
  description: row.description || "",
  longDescription: row.longDescription ?? row.long_description ?? "",
  image: row.image || row.id,
  images: Array.isArray(row.images) ? row.images : (typeof row.images === "string" ? JSON.parse(row.images) : []),
  isFeatured: Boolean(row.isFeatured ?? row.is_featured),
  status: row.status || "Active",
  minOrder: Number(row.minOrder ?? row.min_order ?? 1),
  specs: Array.isArray(row.specs) ? row.specs : (typeof row.specs === "string" ? JSON.parse(row.specs) : []),
  priceInquiryNote: row.priceInquiryNote ?? row.price_inquiry_note ?? undefined,
  seoTitle: row.seoTitle ?? row.seo_title ?? undefined,
  seoDescription: row.seoDescription ?? row.seo_description ?? undefined,
  createdDate: row.createdDate ?? row.created_date ?? undefined,
  updatedDate: row.updatedDate ?? row.updated_date ?? undefined,
});

const normalizeCategory = (row: any): Category => ({
  ...row,
  id: row.id,
  title: row.title,
  slug: row.slug || row.id,
  tagline: row.tagline || undefined,
  description: row.description || "",
  bannerImage: row.bannerImage ?? row.banner_image ?? undefined,
  featuredImage: row.featuredImage ?? row.featured_image ?? undefined,
  iconName: row.iconName ?? row.icon_name ?? undefined,
  status: row.status || "Active",
  featuredOnHomepage: row.featuredOnHomepage ?? row.featured_on_homepage ?? true,
  sortOrder: row.sortOrder ?? row.sort_order ?? 1,
});

const normalizeQuote = (row: any): QuoteRequest => ({
  ...row,
  id: row.id,
  date: row.date || row.quote_date || "",
  name: row.name || "",
  phone: row.phone || "",
  email: row.email || "",
  org: row.org || undefined,
  dateNeeded: row.dateNeeded || row.date_needed || undefined,
  city: row.city || undefined,
  commPref: row.commPref || row.comm_pref || "Email",
  extraDetails: row.extraDetails || row.extra_details || undefined,
  status: row.status || "Pending",
  items: Array.isArray(row.items) ? row.items : [],
});

const normalizeMessage = (row: any): ContactMessage => ({
  ...row,
  id: row.id,
  date: row.date || row.message_date || "",
  name: row.name || "",
  email: row.email || "",
  subject: row.subject || undefined,
  message: row.message || "",
  status: row.status || "Unread",
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [productsData, categoriesData, quotesData, messagesData] = await Promise.all([
          requestJson<any[]>("/products"),
          requestJson<any[]>("/categories"),
          requestJson<any[]>("/quotes"),
          requestJson<any[]>("/messages")
        ]);

        if (!isMounted) return;

        setProducts(productsData.map(normalizeProduct));
        setCategories(categoriesData.map(normalizeCategory));
        setQuotes(quotesData.map(normalizeQuote));
        setMessages(messagesData.map(normalizeMessage));
      } catch (error) {
        console.error("Failed to load catalog data from backend", error);
        if (isMounted) {
          setProducts([]);
          setCategories([]);
          setQuotes([]);
          setMessages([]);
        }
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const addProduct = async (newProductData: Omit<Product, "id">) => {
    const payload = {
      ...newProductData,
      id: `prod-${Date.now()}`,
      slug: newProductData.slug || newProductData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      status: newProductData.status || "Active",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0]
    };

    try {
      const created = await requestJson<any>("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeProduct(created);
      setProducts((prev) => [normalized, ...prev]);
      return normalized;
    } catch (error) {
      console.error("Failed to add product", error);
      return undefined;
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const existing = products.find((prod) => prod.id === id);
    if (!existing) return undefined;

    const payload = {
      ...existing,
      ...updatedFields,
      updatedDate: new Date().toISOString().split("T")[0],
    };

    try {
      const updated = await requestJson<any>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeProduct(updated);
      setProducts((prev) => prev.map((prod) => (prod.id === id ? normalized : prod)));
      return normalized;
    } catch (error) {
      console.error("Failed to update product", error);
      return undefined;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await requestJson<{ success: boolean }>(`/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete product", error);
      return false;
    }
  };

  const addCategory = async (newCat: Omit<Category, "id">) => {
    const payload = {
      ...newCat,
      id: newCat.title,
      slug: newCat.slug || newCat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      status: newCat.status || "Active",
      featuredOnHomepage: newCat.featuredOnHomepage !== undefined ? newCat.featuredOnHomepage : true,
      sortOrder: newCat.sortOrder || categories.length + 1,
    };

    try {
      const created = await requestJson<any>("/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeCategory(created);
      setCategories((prev) => [...prev, normalized].sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)));
      return normalized;
    } catch (error) {
      console.error("Failed to add category", error);
      return undefined;
    }
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    const existing = categories.find((cat) => cat.id === id);
    if (!existing) return undefined;

    const payload = {
      ...existing,
      ...updatedFields,
    };

    try {
      const updated = await requestJson<any>(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeCategory(updated);
      setCategories((prev) => prev.map((cat) => (cat.id === id ? normalized : cat)));
      return normalized;
    } catch (error) {
      console.error("Failed to update category", error);
      return undefined;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await requestJson<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete category", error);
      return false;
    }
  };

  const addQuote = async (quoteData: Omit<QuoteRequest, "id" | "date" | "status">) => {
    const payload = {
      ...quoteData,
      id: `QT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "Pending" as const,
    };

    try {
      const created = await requestJson<any>("/quotes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeQuote(created);
      setQuotes((prev) => [normalized, ...prev]);
      return normalized;
    } catch (error) {
      console.error("Failed to add quote", error);
      return undefined;
    }
  };

  const updateQuoteStatus = async (id: string, status: QuoteRequest["status"]) => {
    const existing = quotes.find((quote) => quote.id === id);
    if (!existing) return undefined;

    const payload = {
      ...existing,
      status,
    };

    try {
      const updated = await requestJson<any>(`/quotes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeQuote(updated);
      setQuotes((prev) => prev.map((quote) => (quote.id === id ? normalized : quote)));
      return normalized;
    } catch (error) {
      console.error("Failed to update quote status", error);
      return undefined;
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      await requestJson<{ success: boolean }>(`/quotes/${id}`, { method: "DELETE" });
      setQuotes((prev) => prev.filter((quote) => quote.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete quote", error);
      return false;
    }
  };

  const addMessage = async (msgData: Omit<ContactMessage, "id" | "date" | "status">) => {
    const payload = {
      ...msgData,
      id: `MSG-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "Unread" as const,
    };

    try {
      const created = await requestJson<any>("/messages", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeMessage(created);
      setMessages((prev) => [normalized, ...prev]);
      return normalized;
    } catch (error) {
      console.error("Failed to add message", error);
      return undefined;
    }
  };

  const updateMessageStatus = async (id: string, status: ContactMessage["status"]) => {
    const existing = messages.find((message) => message.id === id);
    if (!existing) return undefined;

    const payload = {
      ...existing,
      status,
    };

    try {
      const updated = await requestJson<any>(`/messages/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeMessage(updated);
      setMessages((prev) => prev.map((message) => (message.id === id ? normalized : message)));
      return normalized;
    } catch (error) {
      console.error("Failed to update message status", error);
      return undefined;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await requestJson<{ success: boolean }>(`/messages/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((message) => message.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete message", error);
      return false;
    }
  };

  // Previously this only cleared local React state, giving the admin a false
  // impression that the MySQL database had been wiped. It now actually
  // deletes every row via the existing REST endpoints, then refetches.
  const resetAllCatalogs = async () => {
    try {
      await Promise.all(quotes.map((q) => requestJson(`/quotes/${q.id}`, { method: "DELETE" })));
      await Promise.all(messages.map((m) => requestJson(`/messages/${m.id}`, { method: "DELETE" })));
      await Promise.all(products.map((p) => requestJson(`/products/${p.id}`, { method: "DELETE" })));
      await Promise.all(categories.map((c) => requestJson(`/categories/${c.id}`, { method: "DELETE" })));

      setProducts([]);
      setCategories([]);
      setQuotes([]);
      setMessages([]);
    } catch (error) {
      console.error("Failed to reset catalogs", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        quotes,
        messages,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addQuote,
        updateQuoteStatus,
        deleteQuote,
        addMessage,
        updateMessageStatus,
        deleteMessage,
        resetAllCatalogs,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
