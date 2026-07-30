import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import {
  TrustedByStrip,
  FeaturedCategoriesGrid,
  WhyChooseUsSection,
  TestimonialsSection,
  CTABanner,
} from "./components/HomeSections";
import { CatalogPage } from "./components/CatalogPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { QuoteRequestPage } from "./components/QuoteRequestPage";
import { Footer } from "./components/Footer";
import { FloatingWhatsAppButton } from "./components/FloatingWhatsAppButton";
import { QuoteListProvider } from "./context/QuoteListContext";
import { ProductProvider } from "./context/ProductContext";
import { AdminPanel } from "./components/AdminPanel";
import { Product } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Reset selected product when switching main pages
  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setSelectedProduct(null);
    if (params && params.categoryFilter) {
      setCategoryFilter(params.categoryFilter);
    } else {
      setCategoryFilter("All");
    }
    // Scroll to top on page switches for standard desktop-first feel
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Switch to details mode
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render Page Content conditionally
  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (currentPage) {
      case "home":
        return (
          <>
            <Hero
              onNavigate={handleNavigate}
              onOpenConsultation={() => handleNavigate("quote-request")}
            />
            <TrustedByStrip />
            <FeaturedCategoriesGrid onNavigate={handleNavigate} />
            <WhyChooseUsSection />
            <TestimonialsSection />
            <CTABanner onOpenConsultation={() => handleNavigate("quote-request")} />
          </>
        );
      case "catalog":
        return (
          <CatalogPage
            onSelectProduct={handleSelectProduct}
            initialCategoryFilter={categoryFilter}
          />
        );
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "admin":
        return <AdminPanel onBack={() => handleNavigate("home")} />;
      case "quote-list":
      case "quote-request":
        return (
          <QuoteRequestPage
            onBackToCatalog={() => handleNavigate("catalog")}
          />
        );
      default:
        return (
          <>
            <Hero
              onNavigate={handleNavigate}
              onOpenConsultation={() => handleNavigate("quote-request")}
            />
            <TrustedByStrip />
            <FeaturedCategoriesGrid onNavigate={handleNavigate} />
            <WhyChooseUsSection />
            <TestimonialsSection />
            <CTABanner onOpenConsultation={() => handleNavigate("quote-request")} />
          </>
        );
    }
  };

  return (
    <ProductProvider>
      <QuoteListProvider>
        <div className="flex flex-col min-h-screen bg-background-muted text-navy selection:bg-orange/20 selection:text-orange-dark">
          {/* Navigation Bar */}
          <Navbar currentPage={selectedProduct ? "catalog" : currentPage} onNavigate={handleNavigate} />

          {/* Dynamic Screen Layout Grid / Router */}
          <main className="flex-grow">
            {renderContent()}
          </main>

          {/* Global Footer */}
          <Footer onNavigate={handleNavigate} />

          {/* High impact floaters */}
          <FloatingWhatsAppButton />
        </div>
      </QuoteListProvider>
    </ProductProvider>
  );
}
