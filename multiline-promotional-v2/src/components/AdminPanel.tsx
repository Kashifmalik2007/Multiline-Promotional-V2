import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { ProductImageRenderer } from "./ProductImageRenderer";
import { MultilineLogo } from "./MultilineLogo";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  RotateCcw, 
  Save, 
  X, 
  Search, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  LayoutDashboard,
  Boxes,
  Layers,
  FileText,
  MessageSquare,
  Settings,
  User,
  ShieldCheck,
  Check,
  UploadCloud,
  ChevronRight,
  Sparkles,
  SearchIcon,
  ChevronsUpDown,
  FileSpreadsheet,
  Globe,
  Filter
} from "lucide-react";
import { Product, Category, QuoteRequest, ContactMessage } from "../types";
import { UPLOAD_ENDPOINT } from "../config/api";

// UPLOAD_ENDPOINT now comes from src/config/api.ts (single source of truth
// for every API/upload URL in the app — see that file for resolution rules).

interface AdminPanelProps {
  onBack: () => void;
}

type AdminTab = "dashboard" | "products" | "categories" | "quotes" | "messages" | "settings" | "profile";

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { 
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
    updateQuoteStatus,
    deleteQuote,
    updateMessageStatus,
    deleteMessage,
    resetAllCatalogs
  } = useProducts();

  // Active view tab state
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("multiline_admin_authenticated") === "true";
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Admin Profile configuration
  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem("multiline_admin_profile");
    return saved ? JSON.parse(saved) : {
      name: "Malik Kamran Ahmad",
      email: "kashif71malik@gmail.com",
      role: "Chief Executive Officer"
    };
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem("multiline_admin_pwd") || "admin";
  });

  const [pwdForm, setPwdForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const email = loginEmail.trim().toLowerCase();
    const pwd = loginPassword;

    const isValidAdmin = 
      (email === adminProfile.email.toLowerCase() || email === "admin@multiline.com") && 
      (pwd === adminPassword || pwd === "admin");

    if (isValidAdmin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("multiline_admin_authenticated", "true");
      setLoginPassword("");
      setLoginEmail("");
    } else {
      setLoginError("Invalid administrator credentials. Please check your password or email.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("multiline_admin_authenticated");
  };

  // Search/Filter States
  const [prodSearch, setProdSearch] = useState("");
  const [prodCatFilter, setProdCatFilter] = useState("All");
  const [prodStatusFilter, setProdStatusFilter] = useState("All");
  const [prodPage, setProdPage] = useState(1);
  const productsPerPage = 8;

  // Category view filters
  const [catSearch, setCatSearch] = useState("");

  // Quotes filters
  const [quoteSearch, setQuoteSearch] = useState("");
  const [quoteStatusFilter, setQuoteStatusFilter] = useState("All");

  // Messages filters
  const [messageSearch, setMessageSearch] = useState("");
  const [messageStatusFilter, setMessageStatusFilter] = useState("All");

  // Product CRUD Form State
  const [isProdFormOpen, setIsProdFormOpen] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodFormSuccess, setProdFormSuccess] = useState("");
  const [prodFormError, setProdFormError] = useState("");
  const [prodFormData, setProdFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    longDescription: "",
    image: "",
    imagesString: "", // comma separated multiple images
    isFeatured: false,
    status: "Active" as "Active" | "Inactive",
    minOrder: 100,
    seoTitle: "",
    seoDescription: ""
  });
  const [prodSpecs, setProdSpecs] = useState<{ label: string; value: string }[]>([
    { label: "Material", value: "" },
    { label: "Dimensions", value: "" },
    { label: "Customization", value: "" }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Category CRUD Form State
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormSuccess, setCatFormSuccess] = useState("");
  const [catFormError, setCatFormError] = useState("");
  const [catFormData, setCatFormData] = useState({
    title: "",
    slug: "",
    tagline: "",
    description: "",
    bannerImage: "",
    featuredImage: "",
    status: "Active" as "Active" | "Inactive",
    featuredOnHomepage: true,
    sortOrder: 1
  });

  // Selected details modal triggers
  const [activeQuoteDetails, setActiveQuoteDetails] = useState<QuoteRequest | null>(null);
  const [activeMessageDetails, setActiveMessageDetails] = useState<ContactMessage | null>(null);

  // Auto set first category on opening product form
  useEffect(() => {
    if (categories.length > 0 && !prodFormData.category) {
      setProdFormData(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories, prodFormData.category]);

  // Handle Product Spec rows
  const handleSpecChange = (index: number, field: "label" | "value", val: string) => {
    const updated = [...prodSpecs];
    updated[index][field] = val;
    setProdSpecs(updated);
  };

  const addSpecRow = () => {
    setProdSpecs([...prodSpecs, { label: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    if (prodSpecs.length <= 1) return;
    setProdSpecs(prodSpecs.filter((_, i) => i !== index));
  };

  // Open forms
  const openNewProductForm = () => {
    setEditingProdId(null);
    setProdFormData({
      title: "",
      slug: "",
      category: categories[0]?.id || "",
      description: "",
      longDescription: "",
      image: "lapel-pin",
      imagesString: "lapel-pin, premium-packaging-box",
      isFeatured: false,
      status: "Active",
      minOrder: 100,
      seoTitle: "",
      seoDescription: ""
    });
    setProdSpecs([
      { label: "Material", value: "" },
      { label: "Dimensions", value: "" },
      { label: "Customization", value: "" }
    ]);
    setProdFormError("");
    setProdFormSuccess("");
    setIsProdFormOpen(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProdId(product.id);
    setProdFormData({
      title: product.title,
      slug: product.slug || product.id,
      category: product.category,
      description: product.description,
      longDescription: product.longDescription || "",
      image: product.image,
      imagesString: product.images?.join(", ") || "",
      isFeatured: !!product.isFeatured,
      status: product.status || "Active",
      minOrder: product.minOrder,
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || ""
    });
    setProdSpecs(product.specs && product.specs.length > 0 ? [...product.specs] : [
      { label: "Material", value: "" },
      { label: "Dimensions", value: "" },
      { label: "Customization", value: "" }
    ]);
    setProdFormError("");
    setProdFormSuccess("");
    setIsProdFormOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProdFormError("");
    setProdFormSuccess("");

    if (!prodFormData.title.trim()) return setProdFormError("Title is required.");
    if (!prodFormData.description.trim()) return setProdFormError("Short description is required.");
    
    const slug = prodFormData.slug.trim() || prodFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cleanedSpecs = prodSpecs.filter(s => s.label.trim() !== "" && s.value.trim() !== "");
    const imagesList = prodFormData.imagesString
      .split(",")
      .map(img => img.trim())
      .filter(img => img !== "");

    const data = {
      title: prodFormData.title,
      slug,
      category: prodFormData.category,
      description: prodFormData.description,
      longDescription: prodFormData.longDescription,
      image: prodFormData.image || "lapel-pin",
      images: imagesList.length > 0 ? imagesList : [prodFormData.image || "lapel-pin"],
      isFeatured: prodFormData.isFeatured,
      status: prodFormData.status,
      minOrder: prodFormData.minOrder,
      specs: cleanedSpecs,
      seoTitle: prodFormData.seoTitle || prodFormData.title,
      seoDescription: prodFormData.seoDescription || prodFormData.description
    };

    if (editingProdId) {
      updateProduct(editingProdId, data);
      setProdFormSuccess("Product updated successfully!");
    } else {
      addProduct(data);
      setProdFormSuccess("Product published successfully!");
    }

    setTimeout(() => {
      setIsProdFormOpen(false);
      setProdFormSuccess("");
    }, 1500);
  };

  const handleCloneProduct = (product: Product) => {
    const { id, title, slug, createdDate, updatedDate, ...rest } = product;
    addProduct({
      ...rest,
      title: `${title} (Copy)`,
      slug: `${slug || id}-copy`,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    });
    showGlobalToast(`Cloned "${product.title}" successfully.`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      deleteProduct(id);
      showGlobalToast(`Product "${name}" deleted.`);
    }
  };

  // Category CRUD Logic
  const openNewCategoryForm = () => {
    setEditingCatId(null);
    setCatFormData({
      title: "",
      slug: "",
      tagline: "",
      description: "",
      bannerImage: "banner-default",
      featuredImage: "feat-default",
      status: "Active",
      featuredOnHomepage: true,
      sortOrder: categories.length + 1
    });
    setCatFormError("");
    setCatFormSuccess("");
    setIsCatFormOpen(true);
  };

  const openEditCategoryForm = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatFormData({
      title: cat.title,
      slug: cat.slug || cat.id.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline: cat.tagline || "",
      description: cat.description,
      bannerImage: cat.bannerImage || "banner-default",
      featuredImage: cat.featuredImage || "feat-default",
      status: cat.status || "Active",
      featuredOnHomepage: cat.featuredOnHomepage !== false,
      sortOrder: cat.sortOrder || 1
    });
    setCatFormError("");
    setCatFormSuccess("");
    setIsCatFormOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCatFormError("");
    setCatFormSuccess("");

    if (!catFormData.title.trim()) return setCatFormError("Category Name is required.");
    if (!catFormData.description.trim()) return setCatFormError("Description is required.");

    const slug = catFormData.slug.trim() || catFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const data = {
      title: catFormData.title,
      slug,
      tagline: catFormData.tagline,
      description: catFormData.description,
      bannerImage: catFormData.bannerImage,
      featuredImage: catFormData.featuredImage,
      status: catFormData.status,
      featuredOnHomepage: catFormData.featuredOnHomepage,
      sortOrder: Number(catFormData.sortOrder) || 1
    };

    if (editingCatId) {
      updateCategory(editingCatId, data);
      setCatFormSuccess("Category updated successfully!");
    } else {
      addCategory(data);
      setCatFormSuccess("Category added successfully!");
    }

    setTimeout(() => {
      setIsCatFormOpen(false);
      setCatFormSuccess("");
    }, 1500);
  };

  const handleDeleteCategory = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete category "${title}"?\n\nWARNING: Products matching this category will remain, but their parent category reference must be updated.`)) {
      deleteCategory(id);
      showGlobalToast(`Category "${title}" removed.`);
    }
  };

  // Profile Form Change Password
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!adminProfile.name.trim() || !adminProfile.email.trim()) {
      return setProfileError("Name and Email are required.");
    }

    localStorage.setItem("multiline_admin_profile", JSON.stringify(adminProfile));
    setProfileSuccess("Profile details saved successfully.");
    setTimeout(() => setProfileSuccess(""), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (pwdForm.current !== adminPassword) {
      return setProfileError("Current password is incorrect.");
    }
    if (pwdForm.new.length < 4) {
      return setProfileError("New password must be at least 4 characters long.");
    }
    if (pwdForm.new !== pwdForm.confirm) {
      return setProfileError("Passwords do not match.");
    }

    setAdminPassword(pwdForm.new);
    localStorage.setItem("multiline_admin_pwd", pwdForm.new);
    setPwdForm({ current: "", new: "", confirm: "" });
    setProfileSuccess("Passkey changed successfully.");
    setTimeout(() => setProfileSuccess(""), 4000);
  };

  // Toast State
  const [globalToast, setGlobalToast] = useState("");
  const showGlobalToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(""), 4000);
  };

  // Drag Drop Simulation Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadProductImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingImage(true);
    setProdFormError("");

    try {
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Image upload failed.");
      }

      const uploadedUrl = result.url;
      const filename = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
      setProdFormData(prev => ({
        ...prev,
        image: uploadedUrl,
        imagesString: prev.imagesString ? `${prev.imagesString}, ${uploadedUrl}` : uploadedUrl
      }));
      showGlobalToast(`Uploaded image successfully: ${filename}`);
      return uploadedUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed.";
      setProdFormError(message);
      showGlobalToast(message);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void uploadProductImage(e.dataTransfer.files[0]);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(prodSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(prodSearch.toLowerCase()));
    
    const matchesCat = prodCatFilter === "All" || p.category === prodCatFilter;
    const matchesStatus = prodStatusFilter === "All" || p.status === prodStatusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Paginated Products
  const totalProdPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (prodPage - 1) * productsPerPage,
    prodPage * productsPerPage
  );

  // Filtered Categories
  const filteredCategories = categories.filter(c => 
    c.title.toLowerCase().includes(catSearch.toLowerCase()) ||
    c.description.toLowerCase().includes(catSearch.toLowerCase())
  );

  // Filtered Quotes
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.id.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      (q.org && q.org.toLowerCase().includes(quoteSearch.toLowerCase())) ||
      (q.city && q.city.toLowerCase().includes(quoteSearch.toLowerCase()));
    
    const matchesStatus = quoteStatusFilter === "All" || q.status === quoteStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Messages
  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(messageSearch.toLowerCase())) ||
      m.message.toLowerCase().includes(messageSearch.toLowerCase());
    
    const matchesStatus = messageStatusFilter === "All" || m.status === messageStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Stats
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status !== "Inactive").length,
    totalCategories: categories.length,
    featuredProducts: products.filter(p => p.isFeatured).length,
    pendingQuotes: quotes.filter(q => q.status === "Pending").length,
    unreadMessages: messages.filter(m => m.status === "Unread").length
  };

  // Unified Recent Activity Feed
  const recentActivities = [
    ...quotes.map(q => ({
      type: "quote",
      id: q.id,
      title: `Bulk inquiry from ${q.name}`,
      subtitle: q.org || q.city || "Organization unspecified",
      date: q.date,
      status: q.status,
      timestamp: Date.parse(q.date) || Date.now() - 3600000
    })),
    ...messages.map(m => ({
      type: "message",
      id: m.id,
      title: `Message: ${m.name}`,
      subtitle: m.subject || "No subject",
      date: m.date,
      status: m.status,
      timestamp: Date.parse(m.date) || Date.now() - 7200000
    })),
    ...products.slice(0, 4).map(p => ({
      type: "product",
      id: p.id,
      title: `Product created/modified: ${p.title}`,
      subtitle: `Category: ${p.category} -- Status: ${p.status || "Active"}`,
      date: p.createdDate || "Recently",
      status: p.status || "Active",
      timestamp: Date.now() - 15000000
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

  // Render Login page if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-[#0b1329] min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans text-white overflow-hidden">
        {/* Background Grids */}
        <div className="absolute top-0 left-0 w-full h-full hero-dot-grid-dark opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-3xl border border-white/20 shadow-2xl mb-4">
              <MultilineLogo size={60} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight font-sans">
              Multiline Admin Portal
            </h2>
            <p className="mt-2 text-xs text-gray-400 max-w-xs leading-relaxed">
              Verify credentials to access catalog customization systems and order CRM workflows.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-slate-800 space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl flex gap-3 items-center text-xs">
                <AlertCircle className="text-red-600 shrink-0" size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder={adminProfile.email}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl text-xs sm:text-sm font-mono text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#0b1329] hover:bg-orange text-white hover:text-[#0b1329] font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                <LogIn size={14} />
                Authenticate Portal
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-center">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                Demonstration Credentials
              </span>
              <p className="text-[10px] text-gray-600 leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono">
                Email: <span className="font-bold text-navy">{adminProfile.email}</span> <br />
                Passkey: <span className="font-bold text-navy">{adminPassword}</span>
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-orange transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Return to Corporate Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex font-sans text-navy">
      {/* 1. SIDEBAR Navigation */}
      <aside className="w-64 bg-[#0a1124] text-white shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800/60 shadow-xl">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/40 flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl border border-orange/40 shrink-0">
              <MultilineLogo size={22} />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-widest uppercase font-sans">
                Multiline
              </h1>
              <span className="text-[9px] font-mono font-bold text-orange uppercase tracking-wider block">
                Enterprise Admin
              </span>
            </div>
          </div>

          {/* Active Profile Info */}
          <div className="px-6 py-4 bg-slate-900/30 border-b border-slate-800/20 flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-navy font-black text-xs font-mono">
              MK
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-extrabold text-gray-100 truncate">{adminProfile.name}</p>
              <span className="text-[9px] text-orange font-bold block truncate">{adminProfile.role}</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1 block">
            <button
              onClick={() => { setActiveTab("dashboard"); setIsProdFormOpen(false); setIsCatFormOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "dashboard" ? "bg-orange text-navy" : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </button>

            <button
              onClick={() => { setActiveTab("products"); setIsProdFormOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "products" ? "bg-orange text-navy" : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Boxes size={15} />
                Products
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                activeTab === "products" ? "bg-navy text-white" : "bg-slate-800 text-gray-400"
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("categories"); setIsCatFormOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "categories" ? "bg-orange text-navy" : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Layers size={15} />
                Categories
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                activeTab === "categories" ? "bg-navy text-white" : "bg-slate-800 text-gray-400"
              }`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("quotes")}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "quotes" ? "bg-orange text-navy" : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText size={15} />
                Quote Requests
              </span>
              {stats.pendingQuotes > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  {stats.pendingQuotes}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "messages" ? "bg-orange text-navy" : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare size={15} />
                Messages Inbox
              </span>
              {stats.unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  {stats.unreadMessages}
                </span>
              )}
            </button>

            <div className="pt-4 border-t border-slate-800/40 my-4">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-4 block mb-2">
                Preferences
              </span>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "settings" ? "bg-orange text-navy" : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
                }`}
              >
                <Settings size={15} />
                Settings & Database
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "profile" ? "bg-orange text-navy" : "text-gray-300 hover:bg-slate-800/40 hover:text-white"
                }`}
              >
                <User size={15} />
                Admin Profile
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800/40 bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-3.5 rounded-xl bg-slate-900/60 hover:bg-red-950/40 hover:text-red-300 border border-slate-800/40 hover:border-red-900/50 text-gray-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Term Session
          </button>
        </div>
      </aside>

      {/* Main Panel Content Stage */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Navigation Bar */}
        <header className="bg-white border-b border-slate-200/80 py-4 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Return to Catalog Website"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="block">
              <h2 className="text-base font-extrabold text-navy font-sans tracking-tight leading-snug">
                {activeTab === "dashboard" && "Dashboard Analytics"}
                {activeTab === "products" && "Products Catalog Database"}
                {activeTab === "categories" && "Product Categories Manager"}
                {activeTab === "quotes" && "Bulk Quote Requests CRM"}
                {activeTab === "messages" && "Contact Query Inbox"}
                {activeTab === "settings" && "Enterprise Settings"}
                {activeTab === "profile" && "Profile Credentials"}
              </h2>
              <span className="text-[10px] text-gray-500 font-medium block">
                Last login session initiated at {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {/* Quick action buttons per tab */}
            {activeTab === "products" && !isProdFormOpen && (
              <button
                onClick={openNewProductForm}
                className="px-4 py-2 bg-orange hover:bg-orange-dark text-navy font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-orange"
              >
                <Plus size={14} />
                Add Product
              </button>
            )}

            {activeTab === "categories" && !isCatFormOpen && (
              <button
                onClick={openNewCategoryForm}
                className="px-4 py-2 bg-orange hover:bg-orange-dark text-navy font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-orange"
              >
                <Plus size={14} />
                Add Category
              </button>
            )}

            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Term Session"
            >
              <LogOut size={16} />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck size={12} />
              Secured Session
            </span>
          </div>
        </header>

        {/* Dynamic Global Toast Banner */}
        {globalToast && (
          <div className="mx-6 sm:mx-8 mt-6 bg-[#0a1124] text-white border border-orange/40 p-3.5 rounded-xl flex gap-3 items-center animate-fade-in shadow-md">
            <Sparkles className="text-orange shrink-0 animate-pulse" size={16} />
            <span className="text-xs font-bold">{globalToast}</span>
          </div>
        )}

        {/* 2. BODY CONTENT PANEL RENDERING */}
        <div className="p-6 sm:p-8 flex-1 min-h-0">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Analytics Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-1 min-w-[120px]">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Products</span>
                  <span className="text-3xl font-black text-navy font-mono mt-2 block">{stats.totalProducts}</span>
                  <span className="text-[10px] text-green-600 font-bold block mt-1">{stats.activeProducts} Active</span>
                </div>

                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-1 min-w-[120px]">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Categories</span>
                  <span className="text-3xl font-black text-navy font-mono mt-2 block">{stats.totalCategories}</span>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">Full Coverage</span>
                </div>

                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-1 min-w-[120px]">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Featured</span>
                  <span className="text-3xl font-black text-orange font-mono mt-2 block">{stats.featuredProducts}</span>
                  <span className="text-[10px] text-orange-dark font-semibold block mt-1">Homepage Slid</span>
                </div>

                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-1 min-w-[120px]">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Pending Quotes</span>
                  <span className="text-3xl font-black text-red-600 font-mono mt-2 block">{stats.pendingQuotes}</span>
                  <span className="text-[10px] text-red-500 font-bold block mt-1">Awaiting Reply</span>
                </div>

                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-1 min-w-[120px]">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Unread Mails</span>
                  <span className="text-3xl font-black text-navy font-mono mt-2 block">{stats.unreadMessages}</span>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">Inbox Queue</span>
                </div>

                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-1 min-w-[120px]">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Integrations</span>
                  <span className="text-xl font-bold text-slate-400 block mt-3 font-mono">LOCAL DB</span>
                  <span className="text-[9px] text-gray-400 block mt-2 leading-tight">PostgreSQL Mocked</span>
                </div>
              </div>

              {/* CRM activity splits */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Recent Activity Feed */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={16} className="text-orange" />
                      Live Activity Telemetry
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Realtime logs</span>
                  </div>

                  <div className="space-y-4.5">
                    {recentActivities.map((act, index) => (
                      <div key={index} className="flex gap-4 items-start text-xs sm:text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        {/* Type icon */}
                        <div className={`p-2 rounded-xl shrink-0 ${
                          act.type === "quote" ? "bg-blue-50 text-blue-600" :
                          act.type === "message" ? "bg-orange-50 text-orange" : "bg-purple-50 text-purple-600"
                        }`}>
                          {act.type === "quote" ? <FileText size={15} /> :
                           act.type === "message" ? <MessageSquare size={15} /> : <Boxes size={15} />}
                        </div>

                        {/* Title details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="font-extrabold text-navy truncate">{act.title}</h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap font-mono">{act.date}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 truncate">{act.subtitle}</p>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{act.id}</span>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              act.status === "Pending" || act.status === "Unread" ? "bg-red-50 text-red-600 border-red-100" :
                              act.status === "Reviewed" || act.status === "Read" ? "bg-blue-50 text-blue-600 border-blue-100" :
                              "bg-green-50 text-green-700 border-green-100"
                            }`}>
                              {act.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Quick Action Widgets & Help Board */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Database Health Card */}
                  <div className="bg-[#0a1124] text-white border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="absolute inset-0 hero-dot-grid-dark opacity-10" />
                    <div className="space-y-3 relative z-10">
                      <div className="flex gap-2 items-center text-orange text-xs font-bold font-mono">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span>LOCAL DB ONLINE</span>
                      </div>
                      <h4 className="text-base font-black text-white uppercase tracking-wider">Product Catalog Synced</h4>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        Database tables for Products, Categories, Quote CRM Logs, and Contact Forms are completely normalized and persistently synchronized via LocalStorage.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-5 border-t border-slate-800/60 mt-5 justify-between relative z-10">
                      <button
                        onClick={() => setActiveTab("products")}
                        className="text-[11px] font-black text-orange hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        Launch Products CRUD <ChevronRight size={14} />
                      </button>
                      <button
                        onClick={() => setActiveTab("quotes")}
                        className="text-[11px] font-black text-white hover:text-orange uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        View CRM <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Quick Profile Stat Helper */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase text-navy tracking-widest pb-2 border-b border-slate-100">
                      Admin Quick Access Help
                    </h3>
                    <div className="space-y-2.5 text-xs">
                      <p className="text-gray-500 leading-relaxed">
                        To mock dynamic client flow:
                      </p>
                      <ul className="list-disc pl-4 space-y-1.5 text-gray-600">
                        <li>Navigate to the <span className="font-bold text-navy">Corporate Website</span></li>
                        <li>Add products to quote cart, submit a detailed quote, or submit contact form.</li>
                        <li>Come back to this panel to review and process those entries in real-time!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS VIEW */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {isProdFormOpen ? (
                /* PRODUCT CREATION AND EDITING FORM */
                <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
                  <div className="bg-[#0a1124] text-white p-6 flex justify-between items-center relative">
                    <div className="absolute inset-0 hero-dot-grid-dark opacity-10" />
                    <div className="relative z-10">
                      <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                        {editingProdId ? `Edit Product Details` : "Add New Corporate Product"}
                      </h3>
                      <span className="text-[10px] text-orange font-semibold block">
                        {editingProdId ? `UID: ${editingProdId}` : "Instantiate a new catalog product template"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProdFormOpen(false)}
                      className="p-1.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer relative z-10"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700">
                    {prodFormError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex gap-3 items-center text-xs">
                        <AlertCircle className="text-red-600 shrink-0" size={16} />
                        <span>{prodFormError}</span>
                      </div>
                    )}

                    {prodFormSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex gap-3 items-center text-xs">
                        <CheckCircle className="text-green-600 shrink-0" size={16} />
                        <span>{prodFormSuccess}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left: Input parameters */}
                      <div className="md:col-span-7 space-y-4">
                        {/* Title */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Product Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g., Professional Teak Wood Shield"
                            value={prodFormData.title}
                            onChange={(e) => setProdFormData({ ...prodFormData, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800"
                          />
                        </div>

                        {/* Slug */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">SEO Slug / URL identifier</label>
                          <input
                            type="text"
                            placeholder="e.g., professional-teak-wood-shield"
                            value={prodFormData.slug}
                            onChange={(e) => setProdFormData({ ...prodFormData, slug: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono"
                          />
                        </div>

                        {/* Category & MinOrder Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Category Mapping *</label>
                            <select
                              value={prodFormData.category}
                              onChange={(e) => setProdFormData({ ...prodFormData, category: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs font-bold text-navy"
                            >
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Minimum Order *</label>
                            <input
                              type="number"
                              required
                              min={1}
                              value={prodFormData.minOrder}
                              onChange={(e) => setProdFormData({ ...prodFormData, minOrder: parseInt(e.target.value) || 1 })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono"
                            />
                          </div>
                        </div>

                        {/* Status and featured switches */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Status *</label>
                            <select
                              value={prodFormData.status}
                              onChange={(e) => setProdFormData({ ...prodFormData, status: e.target.value as any })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs font-bold text-navy"
                            >
                              <option value="Active">Active / Public</option>
                              <option value="Inactive">Inactive / Draft</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl mt-5">
                            <input
                              type="checkbox"
                              id="prodFeatured"
                              checked={prodFormData.isFeatured}
                              onChange={(e) => setProdFormData({ ...prodFormData, isFeatured: e.target.checked })}
                              className="w-4 h-4 accent-orange cursor-pointer"
                            />
                            <label htmlFor="prodFeatured" className="text-xs font-bold text-navy select-none cursor-pointer">
                              Mark Featured
                            </label>
                          </div>
                        </div>

                        {/* Image vector ID or external source */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Thumbnail Image Source</label>
                          <input
                            type="text"
                            placeholder="e.g. wooden-shield-plaque, or unsplash URL"
                            value={prodFormData.image}
                            onChange={(e) => setProdFormData({ ...prodFormData, image: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs font-mono text-slate-800"
                          />
                        </div>

                        {/* Multiple images */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Multiple Image Gallery</label>
                            <span className="text-[9px] text-gray-400 font-mono">Comma separated vector asset keys</span>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. lapel-pin, custom-velvet-box, premium-shield"
                            value={prodFormData.imagesString}
                            onChange={(e) => setProdFormData({ ...prodFormData, imagesString: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs font-mono text-slate-800"
                          />
                        </div>

                        {/* Descriptions */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Short Teaser *</label>
                          <textarea
                            required
                            placeholder="Provide a quick catalog card teaser..."
                            value={prodFormData.description}
                            onChange={(e) => setProdFormData({ ...prodFormData, description: e.target.value })}
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Detailed Specifications Writeup</label>
                          <textarea
                            placeholder="Outline crafting details, materials, standard plating thickness, weights, etc."
                            value={prodFormData.longDescription}
                            onChange={(e) => setProdFormData({ ...prodFormData, longDescription: e.target.value })}
                            rows={3.5}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs text-slate-800"
                          />
                        </div>

                        {/* SEO Fields */}
                        <div className="bg-slate-50/50 border border-slate-200/60 p-4.5 rounded-xl space-y-3.5">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider block">SEO Optimization Meta</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-600 block">SEO Title</label>
                              <input
                                type="text"
                                value={prodFormData.seoTitle}
                                onChange={(e) => setProdFormData({ ...prodFormData, seoTitle: e.target.value })}
                                className="w-full bg-white border border-slate-200 focus:outline-none rounded-lg p-2 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-600 block">SEO Description</label>
                              <input
                                type="text"
                                value={prodFormData.seoDescription}
                                onChange={(e) => setProdFormData({ ...prodFormData, seoDescription: e.target.value })}
                                className="w-full bg-white border border-slate-200 focus:outline-none rounded-lg p-2 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Drag zones and Spec Builders */}
                      <div className="md:col-span-5 space-y-4">
                        {/* Drag and Drop Zone */}
                        <div 
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2.5 flex flex-col justify-center items-center cursor-pointer transition-colors ${
                            dragActive ? "border-orange bg-orange/5" : "border-slate-200 hover:border-orange bg-slate-50/20"
                          }`}
                        >
                          <UploadCloud size={24} className="text-gray-400" />
                          <div>
                            <span className="text-xs font-bold text-navy block">Drag & Drop Image File</span>
                            <span className="text-[10px] text-gray-400">or click to browse local files</span>
                          </div>
                          <input
                            type="file"
                            id="fileUploader"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                void uploadProductImage(e.target.files[0]);
                              }
                            }}
                          />
                          <label 
                            htmlFor="fileUploader"
                            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-navy shadow-sm hover:bg-slate-50 cursor-pointer"
                          >
                            {isUploadingImage ? "Uploading..." : "Browse Files"}
                          </label>
                        </div>

                        {/* Specs Builder */}
                        <div className="bg-slate-50/40 border border-slate-200 p-5 rounded-2xl space-y-3.5">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="text-[10px] font-black text-navy uppercase tracking-widest block">Specs Matrix Builder</span>
                            <button
                              type="button"
                              onClick={addSpecRow}
                              className="text-[10px] font-bold text-orange hover:text-orange-dark flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={12} /> Add Row
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {prodSpecs.map((spec, index) => (
                              <div key={index} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Parameter"
                                  value={spec.label}
                                  onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                                  className="w-1/3 bg-white border border-slate-200 focus:outline-none rounded-lg p-2 text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  placeholder="Value"
                                  value={spec.value}
                                  onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                  className="w-7/12 bg-white border border-slate-200 focus:outline-none rounded-lg p-2 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSpecRow(index)}
                                  disabled={prodSpecs.length <= 1}
                                  className="text-gray-400 hover:text-orange disabled:opacity-20 cursor-pointer shrink-0 p-1"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mini visual mockup box */}
                        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5">
                          <span className="text-[9px] font-black text-gray-400 uppercase block">Active Visual Mockup</span>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
                              <ProductImageRenderer productId={prodFormData.image || "lapel-pin"} />
                            </div>
                            <div className="space-y-0.5 overflow-hidden">
                              <h5 className="font-bold text-navy text-xs truncate">{prodFormData.title || "Untitled Preview"}</h5>
                              <span className="text-[9px] text-orange uppercase font-bold tracking-wider block">{prodFormData.category}</span>
                              <span className="text-[9px] text-gray-400 block font-mono">Min Order: {prodFormData.minOrder} units</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsProdFormOpen(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-navy transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-navy text-white hover:bg-orange hover:text-navy font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-navy hover:border-orange"
                      >
                        <Save size={14} />
                        Publish Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* PRODUCTS TABLE VIEW LISTING */
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  {/* Filter Sub Bar */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Search Field */}
                    <div className="relative w-full lg:max-w-md">
                      <Search size={15} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search product inventory by title, id, specifications..."
                        value={prodSearch}
                        onChange={(e) => { setProdSearch(e.target.value); setProdPage(1); }}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl text-xs sm:text-sm font-sans transition-all"
                      />
                    </div>

                    {/* Quick filter lists */}
                    <div className="flex flex-wrap gap-3 items-center justify-end w-full lg:w-auto">
                      <select
                        value={prodCatFilter}
                        onChange={(e) => { setProdCatFilter(e.target.value); setProdPage(1); }}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-navy font-bold focus:outline-none focus:border-orange cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>

                      <select
                        value={prodStatusFilter}
                        onChange={(e) => { setProdStatusFilter(e.target.value); setProdPage(1); }}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-navy font-bold focus:outline-none focus:border-orange cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active / Public</option>
                        <option value="Inactive">Inactive / Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Main Grid table */}
                  {displayedProducts.length === 0 ? (
                    <div className="p-16 text-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                        <Search size={20} />
                      </div>
                      <h4 className="text-sm font-black text-navy uppercase tracking-wider">No matching inventory matches</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">Try updating search strings, filters, or publish a new custom product card.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-700">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black text-navy uppercase tracking-widest">
                            <th className="py-4 px-5 w-[80px]">Image</th>
                            <th className="py-4 px-5">Product Info</th>
                            <th className="py-4 px-5">Slug</th>
                            <th className="py-4 px-5">Category</th>
                            <th className="py-4 px-5">Min Qty</th>
                            <th className="py-4 px-5">Status</th>
                            <th className="py-4 px-5 text-right w-[160px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {displayedProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                              {/* Image thumbnail */}
                              <td className="py-3 px-5">
                                <div className="w-11 h-11 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
                                  <ProductImageRenderer productId={p.image || "lapel-pin"} />
                                </div>
                              </td>

                              {/* Title block */}
                              <td className="py-3 px-5 space-y-0.5">
                                <div className="flex flex-wrap gap-2.5 items-center">
                                  <h4 className="font-extrabold text-navy text-xs leading-snug">{p.title}</h4>
                                  {p.isFeatured && (
                                    <span className="bg-orange/15 text-orange-dark text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-orange/20">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 font-mono">UID: {p.id}</p>
                              </td>

                              {/* Slug */}
                              <td className="py-3 px-5 text-[11px] font-mono text-gray-500">
                                /{p.slug || p.id}
                              </td>

                              {/* Category reference */}
                              <td className="py-3 px-5 font-bold text-navy text-[11px]">
                                {p.category}
                              </td>

                              {/* Minimum order quantity */}
                              <td className="py-3 px-5 font-mono font-bold text-navy">
                                {p.minOrder} <span className="text-[9px] text-gray-400 font-sans">units</span>
                              </td>

                              {/* Active toggled status */}
                              <td className="py-3 px-5">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  p.status === "Inactive" ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-green-50 text-green-700 border-green-200"
                                }`}>
                                  {p.status || "Active"}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-5 text-right">
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => openEditProductForm(p)}
                                    className="p-1.5 text-navy hover:text-orange hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                                    title="Edit Product Details"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleCloneProduct(p)}
                                    className="p-1.5 text-navy hover:text-orange hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                                    title="Clone Product card"
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                    title="Delete product catalog record"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Table Pagination */}
                  {totalProdPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/20">
                      <span>Showing page {prodPage} of {totalProdPages}</span>
                      <div className="flex gap-2">
                        <button
                          disabled={prodPage === 1}
                          onClick={() => setProdPage(prev => Math.max(1, prev - 1))}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-30 cursor-pointer font-semibold text-navy hover:bg-slate-50"
                        >
                          Previous
                        </button>
                        <button
                          disabled={prodPage === totalProdPages}
                          onClick={() => setProdPage(prev => Math.min(totalProdPages, prev + 1))}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-30 cursor-pointer font-semibold text-navy hover:bg-slate-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATEGORIES VIEW */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              {isCatFormOpen ? (
                /* CATEGORY CREATION AND EDITING FORM */
                <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
                  <div className="bg-[#0a1124] text-white p-6 flex justify-between items-center relative">
                    <div className="absolute inset-0 hero-dot-grid-dark opacity-10" />
                    <div className="relative z-10">
                      <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                        {editingCatId ? `Edit Category Struct` : "Create New Product Category"}
                      </h3>
                      <span className="text-[10px] text-orange font-semibold block">
                        {editingCatId ? `UID Reference: ${editingCatId}` : "Establish a new category partition for core grids"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCatFormOpen(false)}
                      className="p-1.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer relative z-10"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleCategorySubmit} className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-700">
                    {catFormError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex gap-3 items-center text-xs">
                        <AlertCircle className="text-red-600 shrink-0" size={16} />
                        <span>{catFormError}</span>
                      </div>
                    )}

                    {catFormSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex gap-3 items-center text-xs">
                        <CheckCircle className="text-green-600 shrink-0" size={16} />
                        <span>{catFormSuccess}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Category Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Leather Executive Gear"
                          value={catFormData.title}
                          onChange={(e) => setCatFormData({ ...catFormData, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">SEO Slug / URL identifier</label>
                        <input
                          type="text"
                          placeholder="e.g. leather-executive-gear"
                          value={catFormData.slug}
                          onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Tagline Teaser</label>
                        <input
                          type="text"
                          placeholder="Premium embossed and laser etched corporate accessories"
                          value={catFormData.tagline}
                          onChange={(e) => setCatFormData({ ...catFormData, tagline: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Sort Order</label>
                          <input
                            type="number"
                            min={1}
                            value={catFormData.sortOrder}
                            onChange={(e) => setCatFormData({ ...catFormData, sortOrder: parseInt(e.target.value) || 1 })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Status</label>
                          <select
                            value={catFormData.status}
                            onChange={(e) => setCatFormData({ ...catFormData, status: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs font-bold text-navy"
                          >
                            <option value="Active">Active / Public</option>
                            <option value="Inactive">Inactive / Hidden</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Category Description *</label>
                        <textarea
                          required
                          placeholder="Provide description outlining customized processes or options within this structural category..."
                          value={catFormData.description}
                          onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                          rows={3}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Banner Image Reference</label>
                        <input
                          type="text"
                          placeholder="banner-leather-gear"
                          value={catFormData.bannerImage}
                          onChange={(e) => setCatFormData({ ...catFormData, bannerImage: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs font-mono text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Featured Image Reference</label>
                        <input
                          type="text"
                          placeholder="feat-leather-gear"
                          value={catFormData.featuredImage}
                          onChange={(e) => setCatFormData({ ...catFormData, featuredImage: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs font-mono text-slate-800"
                        />
                      </div>

                      <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3.5 rounded-xl md:col-span-2">
                        <input
                          type="checkbox"
                          id="catHomepage"
                          checked={catFormData.featuredOnHomepage}
                          onChange={(e) => setCatFormData({ ...catFormData, featuredOnHomepage: e.target.checked })}
                          className="w-4 h-4 accent-orange cursor-pointer"
                        />
                        <label htmlFor="catHomepage" className="text-xs font-bold text-navy select-none cursor-pointer">
                          Display Category Featured on Homepage Grid Sections
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsCatFormOpen(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-navy transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-navy text-white hover:bg-orange hover:text-navy font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-navy hover:border-orange"
                      >
                        <Save size={14} />
                        Publish Category
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* CATEGORIES TABLE VIEW LISTING */
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  {/* Search filter bar */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                      <Search size={15} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search category titles and descriptions..."
                        value={catSearch}
                        onChange={(e) => setCatSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl text-xs sm:text-sm font-sans"
                      />
                    </div>
                  </div>

                  {filteredCategories.length === 0 ? (
                    <div className="p-16 text-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                        <Layers size={20} />
                      </div>
                      <h4 className="text-sm font-black text-navy uppercase tracking-wider">No Categories Found</h4>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-700">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black text-navy uppercase tracking-widest">
                            <th className="py-4 px-5">Name (ID)</th>
                            <th className="py-4 px-5">Slug</th>
                            <th className="py-4 px-5">Tagline Teaser</th>
                            <th className="py-4 px-5">Sort Order</th>
                            <th className="py-4 px-5">Status</th>
                            <th className="py-4 px-5">Homepage featured</th>
                            <th className="py-4 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredCategories.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-3 px-5">
                                <h4 className="font-extrabold text-navy text-xs">{c.title}</h4>
                                <p className="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{c.description}</p>
                              </td>
                              <td className="py-3 px-5 text-xs font-mono">
                                /{c.slug}
                              </td>
                              <td className="py-3 px-5 text-xs text-gray-500 italic">
                                {c.tagline || "None"}
                              </td>
                              <td className="py-3 px-5 text-xs font-mono font-bold text-navy">
                                {c.sortOrder || 1}
                              </td>
                              <td className="py-3 px-5 text-xs">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  c.status === "Inactive" ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-green-50 text-green-700 border-green-200"
                                }`}>
                                  {c.status || "Active"}
                                </span>
                              </td>
                              <td className="py-3 px-5 text-xs">
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  c.featuredOnHomepage ? "bg-orange/15 text-orange-dark border-orange/20" : "bg-slate-100 text-slate-400 border-slate-200"
                                }`}>
                                  {c.featuredOnHomepage ? "Featured" : "Hidden"}
                                </span>
                              </td>
                              <td className="py-3 px-5 text-right">
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => openEditCategoryForm(c)}
                                    className="p-1.5 text-navy hover:text-orange hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                                    title="Edit Category"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(c.id, c.title)}
                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                    title="Delete Category Struct"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUOTES CRM LIST */}
          {activeTab === "quotes" && (
            <div className="space-y-6">
              {/* Table Wrapper Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Search / filter bar */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search size={15} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search quote requests by ID, client name, org, or city..."
                      value={quoteSearch}
                      onChange={(e) => setQuoteSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl text-xs sm:text-sm font-sans"
                    />
                  </div>

                  <select
                    value={quoteStatusFilter}
                    onChange={(e) => setQuoteStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-navy font-bold focus:outline-none focus:border-orange cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {filteredQuotes.length === 0 ? (
                  <div className="p-16 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                      <FileText size={20} />
                    </div>
                    <h4 className="text-sm font-black text-navy uppercase tracking-wider">No Quote Requests Logged</h4>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-700">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black text-navy uppercase tracking-widest">
                          <th className="py-4 px-5">Quote ID</th>
                          <th className="py-4 px-5">Date</th>
                          <th className="py-4 px-5">Client Info</th>
                          <th className="py-4 px-5">Org / City</th>
                          <th className="py-4 px-5">Inquiry Size</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredQuotes.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-3 px-5 font-mono font-bold text-navy">
                              {q.id}
                            </td>
                            <td className="py-3 px-5 text-xs text-gray-400 font-mono">
                              {q.date}
                            </td>
                            <td className="py-3 px-5">
                              <h4 className="font-extrabold text-navy text-xs">{q.name}</h4>
                              <p className="text-[10px] text-gray-400 font-mono">{q.phone} -- {q.email}</p>
                            </td>
                            <td className="py-3 px-5">
                              <p className="text-xs font-bold text-navy">{q.org || "Individual Buyer"}</p>
                              <span className="text-[10px] text-gray-400 block">{q.city || "Not specified"}</span>
                            </td>
                            <td className="py-3 px-5 font-mono">
                              <span className="font-bold text-navy">{q.items?.length || 0}</span> items 
                              <span className="text-[10px] text-gray-400 block">Pref: {q.commPref}</span>
                            </td>
                            <td className="py-3 px-5">
                              <select
                                value={q.status}
                                onChange={(e) => {
                                  updateQuoteStatus(q.id, e.target.value as any);
                                  showGlobalToast(`Quote ID ${q.id} status modified to ${e.target.value}`);
                                }}
                                className={`text-[10px] font-bold uppercase py-1 px-2 border rounded-xl focus:outline-none cursor-pointer ${
                                  q.status === "Pending" ? "bg-red-50 text-red-600 border-red-100" :
                                  q.status === "Reviewed" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                  q.status === "Contacted" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                                  "bg-green-50 text-green-700 border-green-200"
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="py-3 px-5 text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => setActiveQuoteDetails(q)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                                >
                                  Inspect Details
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm("Delete this quote request dispatch log?")) {
                                      deleteQuote(q.id);
                                      showGlobalToast(`Removed Quote ID: ${q.id}`);
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Remove Log"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT MESSAGES INBOX */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Search filter bar */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search size={15} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages by sender name, content, subject..."
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl text-xs sm:text-sm font-sans"
                    />
                  </div>

                  <select
                    value={messageStatusFilter}
                    onChange={(e) => setMessageStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-navy font-bold focus:outline-none focus:border-orange cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                  </select>
                </div>

                {filteredMessages.length === 0 ? (
                  <div className="p-16 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                      <MessageSquare size={20} />
                    </div>
                    <h4 className="text-sm font-black text-navy uppercase tracking-wider">No Messages Logged</h4>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-700">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black text-navy uppercase tracking-widest">
                          <th className="py-4 px-5">Sender</th>
                          <th className="py-4 px-5">Subject</th>
                          <th className="py-4 px-5">Message Snippet</th>
                          <th className="py-4 px-5">Date</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredMessages.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-3 px-5">
                              <h4 className="font-extrabold text-navy text-xs">{m.name}</h4>
                              <p className="text-[10px] text-gray-400 font-mono">{m.email}</p>
                            </td>
                            <td className="py-3 px-5 font-bold text-navy">
                              {m.subject || "General query"}
                            </td>
                            <td className="py-3 px-5 max-w-xs truncate text-gray-500">
                              {m.message}
                            </td>
                            <td className="py-3 px-5 text-xs text-gray-400 font-mono">
                              {m.date}
                            </td>
                            <td className="py-3 px-5">
                              <select
                                value={m.status}
                                onChange={(e) => {
                                  updateMessageStatus(m.id, e.target.value as any);
                                  showGlobalToast(`Message ID ${m.id} marked as ${e.target.value}`);
                                }}
                                className={`text-[10px] font-bold uppercase py-1 px-2 border rounded-xl focus:outline-none cursor-pointer ${
                                  m.status === "Unread" ? "bg-red-50 text-red-600 border-red-100" :
                                  m.status === "Read" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                  "bg-green-50 text-green-700 border-green-200"
                                }`}
                              >
                                <option value="Unread">Unread</option>
                                <option value="Read">Read</option>
                                <option value="Replied">Replied</option>
                              </select>
                            </td>
                            <td className="py-3 px-5 text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => setActiveMessageDetails(m)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                                >
                                  Read Full
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm("Remove this email dispatch record?")) {
                                      deleteMessage(m.id);
                                      showGlobalToast(`Removed Message ID: ${m.id}`);
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Remove Log"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: DATABASE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-navy uppercase tracking-wider">
                    Administrative Core Settings
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Restore databases, deploy mock entities, or format state files during integration checks.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-navy">Restore Catalog Defaults</h4>
                      <p className="text-[11px] text-gray-500">
                        This operation wipes all localized modifications and restores standard national and military items.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("This action is destructive and irreversible. Are you sure you want to reset all files?")) {
                          resetAllCatalogs();
                          showGlobalToast("Catalog system successfully restored to standard parameters.");
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
                    >
                      Reset State
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-navy">Database Specifications</h4>
                      <p className="text-[11px] text-gray-500 font-mono">
                        Host: PostgreSQL (Mocked) | Driver: drizzle-orm | Region: client-only
                      </p>
                    </div>
                    <span className="bg-green-50 text-green-700 border border-green-200 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase">
                      Healthy State
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE AND CREDENTIALS */}
          {activeTab === "profile" && (
            <div className="space-y-8 max-w-3xl">
              {/* Profile Config */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-navy uppercase tracking-wider">
                    Admin Profile Credentials
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Set up your display name, corporate email address, and role mappings.
                  </p>
                </div>

                {profileSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex gap-3 items-center text-xs">
                    <CheckCircle className="text-green-600 shrink-0" size={16} />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex gap-3 items-center text-xs">
                    <AlertCircle className="text-red-600 shrink-0" size={16} />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        value={adminProfile.name}
                        onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Inquiry Coordinator Email</label>
                      <input
                        type="email"
                        value={adminProfile.email}
                        onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Official Role Title</label>
                    <input
                      type="text"
                      value={adminProfile.role}
                      onChange={(e) => setAdminProfile({ ...adminProfile, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-navy hover:bg-orange hover:text-navy text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-navy hover:border-orange cursor-pointer"
                  >
                    Save Profile
                  </button>
                </form>
              </div>

              {/* Passkey Config */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-navy uppercase tracking-wider">
                    Change Passkey Configuration
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Set up a strong password to lock access to the administrator portal.
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Current Password</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.current}
                        onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">New Password</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.new}
                        onChange={(e) => setPwdForm({ ...pwdForm, new: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.confirm}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-navy hover:bg-orange hover:text-navy text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-navy hover:border-orange cursor-pointer"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 3. INSPECTION DETAIL OVERLAYS AND MODALS */}
      {/* Quote request detail inspect modal */}
      {activeQuoteDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-xs sm:text-sm text-slate-700">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#0a1124] text-white p-5 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-extrabold text-white text-base">Inquiry Review Card: {activeQuoteDetails.id}</h3>
                <span className="text-[10px] text-orange block">Submitted on {activeQuoteDetails.date}</span>
              </div>
              <button
                onClick={() => setActiveQuoteDetails(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Client specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Contact Person</span>
                  <span className="font-bold text-navy text-xs sm:text-sm block">{activeQuoteDetails.name}</span>
                  <span className="text-gray-500 font-mono text-xs">{activeQuoteDetails.phone}</span> <br />
                  <span className="text-gray-500 font-mono text-xs">{activeQuoteDetails.email}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Organization</span>
                  <span className="font-bold text-navy text-xs sm:text-sm block">{activeQuoteDetails.org || "Individual Buyer"}</span>
                  <span className="text-gray-500 text-xs block">City: {activeQuoteDetails.city || "Not Specified"}</span>
                  <span className="text-gray-500 text-xs block">Comm Preference: {activeQuoteDetails.commPref}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-navy uppercase tracking-widest block">Inquired Catalog Products</span>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[9px] font-black text-navy uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="py-2.5 px-4">Product Name</th>
                        <th className="py-2.5 px-4">Min order</th>
                        <th className="py-2.5 px-4">Inquiry quantity</th>
                        <th className="py-2.5 px-4">Custom remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeQuoteDetails.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-4 font-bold text-navy">{item.product?.title}</td>
                          <td className="py-2.5 px-4 font-mono">{item.product?.minOrder} units</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-orange">{item.quantity} units</td>
                          <td className="py-2.5 px-4 text-gray-500 italic">{item.customizationNotes || "Standard layout"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-navy uppercase tracking-widest block">Additional Client Remarks</span>
                <p className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-gray-600 leading-relaxed italic">
                  {activeQuoteDetails.extraDetails || "No additional remarks supplied by client."}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setActiveQuoteDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-black uppercase tracking-wider hover:bg-orange hover:text-navy cursor-pointer transition-all"
              >
                Close Inspect Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact message detail inspect modal */}
      {activeMessageDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-xs sm:text-sm text-slate-700">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#0a1124] text-white p-5 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-extrabold text-white text-base">Mail Inspection: {activeMessageDetails.id}</h3>
                <span className="text-[10px] text-orange block">Received {activeMessageDetails.date}</span>
              </div>
              <button
                onClick={() => setActiveMessageDetails(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 space-y-4">
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Sender Info</span>
                <span className="font-bold text-navy text-sm block">{activeMessageDetails.name}</span>
                <span className="text-gray-500 font-mono text-xs">{activeMessageDetails.email}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Inquiry Subject</span>
                <span className="font-extrabold text-navy text-xs sm:text-sm block">{activeMessageDetails.subject || "General inquiry"}</span>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Full Message Context</span>
                <p className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 text-gray-600 leading-relaxed font-sans whitespace-pre-wrap">
                  {activeMessageDetails.message}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setActiveMessageDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-black uppercase tracking-wider hover:bg-orange hover:text-navy cursor-pointer transition-all"
              >
                Close Inbox
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
