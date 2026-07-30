import React, { useState, useEffect } from "react";
import { useQuoteList } from "../context/QuoteListContext";
import { Menu, X, ShoppingBag, ArrowRight } from "lucide-react";
import { CONTACT_INFO } from "../data/contact";
import { MultilineLogo } from "./MultilineLogo";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { items } = useQuoteList();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItemsCount = items.length;

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "Catalog" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact" },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner Bar for Contact Detail */}
      <div className="bg-navy-dark text-gray-300 text-xs py-2 px-4 md:px-8 border-b border-navy-light flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse"></span>
            Manufacturer & Corporate Products Supplier
          </span>
          <span className="hidden md:inline text-gray-500">|</span>
          <span className="hidden md:inline text-orange-light font-semibold">★ 5.0 Rated Corporate Partner</span>
        </div>
        <div className="flex items-center gap-4">
          <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-orange transition-colors">{CONTACT_INFO.email}</a>
          <span>•</span>
          <a href={`https://wa.me/${CONTACT_INFO.phones[0].value.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-whatsapp transition-colors font-medium text-whatsapp">WhatsApp Support</a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-navy-dark/95 backdrop-blur-md shadow-lg py-3 border-b border-navy-light"
            : "bg-navy py-4 border-b border-navy-light/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => handleLinkClick("home")}
          >
            {/* Custom SVG Heart/Infinite Ribbon Logo (Replicating the uploaded custom logo) */}
            <div className="relative w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-orange/30 shadow-md group-hover:border-orange/60 transition-all duration-300 p-1.5 overflow-hidden">
              <MultilineLogo size={18} />
            </div>
            
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-base md:text-lg tracking-wider font-sans group-hover:text-orange-light transition-colors">
                MULTILINE PROMOTIONAL
              </span>
              <span className="text-orange text-[9px] md:text-[10px] font-bold tracking-widest uppercase">
                Corporate & Promotional Giveaways
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative font-sans text-[15px] font-medium tracking-wide transition-colors py-1.5 cursor-pointer ${
                    isActive
                      ? "text-orange font-semibold"
                      : "text-white/90 hover:text-orange"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls (Quote Counter + CTA Button) */}
          <div className="hidden md:flex items-center gap-5">
            {/* Quote inquiry list counter */}
            <button
              onClick={() => handleLinkClick("quote-list")}
              className={`relative p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
                currentPage === "quote-list"
                  ? "bg-orange text-navy border-orange"
                  : "bg-navy-light text-white border-navy-light hover:border-orange hover:text-orange"
              }`}
              title="View Quote Request List"
            >
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange text-navy text-xs font-black rounded-full w-5 h-5 flex items-center justify-center border border-navy-dark shadow animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Principal CTA button */}
            <button
              onClick={() => handleLinkClick("quote-request")}
              className="bg-orange hover:bg-orange-dark text-navy font-bold text-[14px] px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-orange/20 border border-orange cursor-pointer"
            >
              Get a Quote
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex md:hidden items-center gap-3">
            {/* Basket counter */}
            <button
              onClick={() => handleLinkClick("quote-list")}
              className="relative p-2 bg-navy-light text-white rounded-full border border-navy-light"
            >
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange text-navy text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-navy shadow">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Main menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-orange transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col bg-navy">
          <div className="h-[73px]"></div> {/* spacer for header height */}
          <div className="flex-1 px-6 py-8 flex flex-col justify-between overflow-y-auto">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`text-left text-lg font-bold tracking-wide py-2 border-b border-navy-light/40 ${
                      isActive ? "text-orange" : "text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              
              <button
                onClick={() => handleLinkClick("quote-list")}
                className="flex items-center justify-between text-white text-lg font-bold tracking-wide py-2 border-b border-navy-light/40"
              >
                <span>My Quote List</span>
                <span className="bg-orange text-navy px-2.5 py-0.5 rounded-full text-sm font-extrabold">
                  {items.length} items
                </span>
              </button>
            </nav>

            <div className="flex flex-col gap-4 mt-8 pb-12">
              <button
                onClick={() => handleLinkClick("quote-request")}
                className="w-full bg-orange text-navy font-extrabold text-base py-3.5 rounded-xl text-center shadow-md flex items-center justify-center gap-2"
              >
                Get a Quote Now
                <ArrowRight size={18} />
              </button>
              
              <div className="text-center text-xs text-gray-400 mt-4">
                © {new Date().getFullYear()} Multiline Promotional. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
