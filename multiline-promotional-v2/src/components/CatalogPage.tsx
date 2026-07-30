import React, { useState, useMemo, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { ProductImageRenderer } from "./ProductImageRenderer";
import { useQuoteList } from "../context/QuoteListContext";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight, CheckCircle2, ShoppingBag, PlusCircle } from "lucide-react";
import { Product } from "../types";

interface CatalogPageProps {
  onSelectProduct: (product: Product) => void;
  initialCategoryFilter?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectProduct, initialCategoryFilter }) => {
  const { products, categories } = useProducts();
  const { addToQuoteList, isItemInQuoteList, items } = useQuoteList();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter || "All");
  const [sortBy, setSortBy] = useState("Featured");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Update category filter if requested externally (e.g., from clicking homepage service cards)
  useEffect(() => {
    if (initialCategoryFilter) {
      setSelectedCategory(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  // Handle filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle sorting
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    if (sortBy === "Featured") {
      return products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    if (sortBy === "MinOrderAsc") {
      return products.sort((a, b) => a.minOrder - b.minOrder);
    }
    if (sortBy === "MinOrderDesc") {
      return products.sort((a, b) => b.minOrder - a.minOrder);
    }
    if (sortBy === "Name") {
      return products.sort((a, b) => a.title.localeCompare(b.title));
    }
    return products;
  }, [filteredProducts, sortBy]);

  return (
    <div className="bg-background-muted min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Title & Header (Replicating Image 2 style) */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
            PREMIUM MANUFACTURER CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy font-sans">
            Our Custom Product Catalog
          </h1>
          <div className="w-16 h-1 bg-orange mx-auto rounded-full" />
          <p className="text-sm text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Browse our wide selection of corporate gifts, customized awards, apparel, and wooden crafts. Click on any item to view specifications and request bulk pricing.
          </p>
        </div>

        {/* Dynamic Controls Bar: Search & Filtering */}
        <div className="bg-white border border-border-subtle p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search products by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background-muted border border-border-subtle hover:border-border-strong focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl text-sm font-sans transition-all duration-300"
              />
            </div>

            {/* Quick Filters toggle for Mobile and Sort */}
            <div className="flex gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="md:hidden flex items-center justify-center gap-2 border border-border-subtle p-3 rounded-xl hover:bg-background-muted text-sm font-bold text-navy transition-colors w-full sm:w-auto cursor-pointer"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              <div className="relative flex items-center gap-2 border border-border-subtle px-3 py-2.5 rounded-xl text-sm text-navy font-sans bg-white w-full sm:w-auto">
                <ArrowUpDown size={16} className="text-text-muted" />
                <span className="hidden sm:inline font-semibold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent pr-8 focus:outline-none cursor-pointer font-bold font-sans text-xs sm:text-sm"
                >
                  <option value="Featured">Featured First</option>
                  <option value="MinOrderAsc">Min Order (Low to High)</option>
                  <option value="MinOrderDesc">Min Order (High to Low)</option>
                  <option value="Name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Categories Filter (Replicating high impact sub-nav) */}
          <div className="hidden md:flex flex-wrap gap-2.5 pt-2 border-t border-border-subtle/50">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-orange text-navy font-black shadow-md shadow-orange/10"
                  : "bg-background-muted hover:bg-border-subtle text-text-secondary"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-orange text-navy font-black shadow-md shadow-orange/10"
                    : "bg-background-muted hover:bg-border-subtle text-text-secondary"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Mobile Categories Filter Drawer */}
          {isFiltersOpen && (
            <div className="md:hidden flex flex-col gap-2 pt-4 border-t border-border-subtle/50">
              <span className="text-xs font-black text-navy uppercase tracking-widest block mb-1">Categories</span>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setIsFiltersOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-bold ${
                  selectedCategory === "All" ? "bg-orange-light/20 text-orange" : "text-text-secondary"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setIsFiltersOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-bold ${
                    selectedCategory === cat.id ? "bg-orange-light/20 text-orange" : "text-text-secondary"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Result summary and clear filter triggers */}
        <div className="flex justify-between items-center px-1 text-sm text-text-secondary font-sans">
          <span>Found <strong className="text-navy">{sortedProducts.length}</strong> high-end custom products</span>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-orange hover:text-orange-dark font-bold text-xs"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white border border-border-subtle rounded-2xl p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-background-muted rounded-full flex items-center justify-center mx-auto text-text-muted">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-navy">No products match your search</h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              We manufacture a wide range of custom items. If you can't find what you are looking for, contact us directly and we'll create it.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => {
              const inQuote = isItemInQuoteList(product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  <div>
                    {/* SVG Vector Graphic Box */}
                    <div
                      className="relative aspect-square w-full bg-slate-50 border-b border-border-subtle flex items-center justify-center cursor-pointer overflow-hidden p-4 group"
                      onClick={() => onSelectProduct(product)}
                    >
                      <ProductImageRenderer productId={product.id} className="group-hover:scale-105 transition-transform duration-500 ease-out" />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-navy-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white text-navy font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-full shadow-md flex items-center gap-1">
                          View Details
                          <ChevronRight size={14} />
                        </span>
                      </div>

                      {/* Featured Star Badge */}
                      {product.isFeatured && (
                        <span className="absolute top-4 left-4 bg-orange text-navy text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow border border-orange">
                          Featured
                        </span>
                      )}

                      {/* Min Order Badge */}
                      <span className="absolute bottom-4 right-4 bg-navy-dark/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-navy-light">
                        Min: {product.minOrder} units
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-bold text-orange uppercase tracking-wider block">
                        {product.category}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-navy font-bold text-base sm:text-lg leading-tight cursor-pointer hover:text-orange transition-colors"
                      >
                        {product.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing / CTA Row */}
                  <div className="p-6 pt-0 mt-auto border-t border-border-subtle/50 flex items-center gap-3 justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block font-sans">Corporate Inquiry</span>
                      <span className="text-xs font-bold text-navy">Bulk pricing only</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToQuoteList(product, product.minOrder)}
                        className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                          inQuote
                            ? "bg-orange text-navy border-orange hover:bg-orange-dark"
                            : "bg-navy-light text-white border-navy-light hover:border-orange hover:text-orange"
                        }`}
                        title={inQuote ? "Update Quote Item" : "Add to Quote List"}
                      >
                        {inQuote ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
                      </button>

                      <button
                        onClick={() => onSelectProduct(product)}
                        className="bg-background-muted hover:bg-orange hover:text-navy text-navy font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 border border-border-subtle hover:border-orange cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
