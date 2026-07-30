import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { ProductImageRenderer } from "./ProductImageRenderer";
import { useQuoteList } from "../context/QuoteListContext";
import { ArrowLeft, Star, ShoppingBag, Check, CheckCircle, HelpCircle, Mail } from "lucide-react";
import { CONTACT_INFO } from "../data/contact";

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onNavigate }) => {
  const { addToQuoteList, isItemInQuoteList, items } = useQuoteList();
  
  const [quantity, setQuantity] = useState(product.minOrder);
  const [customNotes, setCustomNotes] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  // Sync state if already in Quote List
  useEffect(() => {
    const existing = items.find((item) => item.product.id === product.id);
    if (existing) {
      setQuantity(existing.quantity);
      setCustomNotes(existing.customizationNotes || "");
    } else {
      setQuantity(product.minOrder);
      setCustomNotes("");
    }
    setIsAdded(isItemInQuoteList(product.id));
  }, [product, items]);

  const handleQuantityChange = (val: number) => {
    setQuantity(Math.max(product.minOrder, val));
  };

  const handleAddToQuote = () => {
    addToQuoteList(product, quantity, customNotes);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  // Generate WhatsApp url for instantaneous quote consultation (Replicating specification)
  const getWhatsAppUrl = () => {
    const phoneNumber = CONTACT_INFO.phones[0].value.replace("+", "");
    const message = `Hello Multiline Promotional! I am interested in inquiring about the "${product.title}" (ID: ${product.id}).
- Requested Quantity: ${quantity} units.
- Special Customization Notes: ${customNotes || "None specified."}
Please provide catalogs, lead time, and pricing quotation. Thank you!`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-background-muted min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs and back navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-navy hover:text-orange transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </button>
          
          <div className="text-xs text-text-muted font-sans flex items-center gap-2">
            <span>Catalog</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-navy font-semibold">{product.title}</span>
          </div>
        </div>

        {/* Main Columns (Replicating Image 6 structure) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Product Image Box */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white border border-border-subtle rounded-3xl aspect-square w-full p-8 flex items-center justify-center shadow-sm relative overflow-hidden group">
              <ProductImageRenderer productId={product.id} className="w-full h-full" />
              <span className="absolute bottom-4 left-4 bg-navy-dark/70 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full border border-navy-light/40">
                Vector Design Render
              </span>
            </div>

            {/* Packaging / Presentation Box Sub-card */}
            <div className="bg-white border border-border-subtle p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-light/10 flex items-center justify-center text-orange shrink-0">
                <Star size={24} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-navy leading-none">Presentation Packaging</h4>
                <p className="text-xs text-text-muted">Includes customized hardboard / silk caskets where applicable.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Product details and controls */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Title Block */}
            <div className="bg-white border border-border-subtle p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 justify-between flex-wrap">
                <span className="text-xs font-bold text-orange uppercase tracking-wider">
                  {product.category}
                </span>
                
                <div className="flex items-center gap-1.5 text-xs text-orange font-bold font-mono">
                  <Star size={14} fill="#F5821F" />
                  <span>★ 5.0 Rated Corporate Choice</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">
                {product.title}
              </h1>

              <p className="text-sm text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Order Configuration Panel */}
            <div className="bg-white border border-border-subtle p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-subtle/50">
                <span className="text-xs font-black text-navy uppercase tracking-widest">ORDER PARAMETERS</span>
                <span className="text-xs font-bold bg-orange-light/30 text-orange-dark px-3 py-1 rounded-full">
                  Min. Order: {product.minOrder} units
                </span>
              </div>

              {/* Quantity Counter Block */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase tracking-wider block">Inquiry Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 50)}
                    disabled={quantity <= product.minOrder}
                    className="w-11 h-11 rounded-xl border border-border-subtle hover:border-orange bg-background-muted flex items-center justify-center font-black text-navy text-lg cursor-pointer disabled:opacity-40"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || product.minOrder)}
                    className="w-24 text-center font-bold text-navy border border-border-subtle py-2.5 rounded-xl text-base focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none bg-background-muted"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 50)}
                    className="w-11 h-11 rounded-xl border border-border-subtle hover:border-orange bg-background-muted flex items-center justify-center font-black text-navy text-lg cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs text-text-muted font-sans">Units (Bulk production)</span>
                </div>
              </div>

              {/* Customization Details Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase tracking-wider block">Customization & Inscription Notes</label>
                <textarea
                  placeholder="E.g., Include institutional logo, specific gold plating finish, or personalized name plate engraving..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm font-sans placeholder-gray-400"
                />
              </div>

              {/* Instant WhatsApp CTA (Replicating Green Button in Image 6) and Add to Quote List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Green WhatsApp Action Button */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-whatsapp hover:bg-opacity-90 text-white font-extrabold text-[14px] py-4 rounded-xl shadow-lg hover:shadow-whatsapp/20 transition-all duration-300 flex items-center justify-center gap-2 border border-whatsapp"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.01-5.05-2.85-6.893-1.84-1.842-4.29-2.856-6.896-2.858-5.437 0-9.863 4.371-9.867 9.743-.001 1.73.457 3.418 1.328 4.937l-.988 3.613 3.712-.96zm11.367-7.614c-.301-.15-1.78-.877-2.056-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.651.075-.301-.15-1.272-.468-2.422-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.018-.462.13-.61.135-.133.301-.35.451-.524.15-.174.2-.3.301-.5.1-.2.05-.375-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.588-.493-.508-.675-.518-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.374-.275.3-.1.775-.1 1.624 0 1.7 1.25 3.342 1.425 3.57.175.225 2.458 3.754 5.954 5.26.832.358 1.48.572 1.986.733.837.266 1.6.228 2.202.139.672-.1 1.78-.727 2.03-1.428.25-.7.25-1.3.175-1.428-.075-.125-.275-.2-.575-.35z" />
                  </svg>
                  Contact on WhatsApp
                </a>

                {/* Add to Quote List Button */}
                <button
                  onClick={handleAddToQuote}
                  className={`w-full font-extrabold text-[14px] py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                    isAdded
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-navy-light text-white border-navy-light hover:border-orange hover:text-orange"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      Added to Quote List
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Add to Quote List
                    </>
                  )}
                </button>
              </div>

              {/* Small notice */}
              <div className="flex gap-2 items-center text-[10px] text-text-muted justify-center">
                <HelpCircle size={12} />
                <span>Our sales department is online 24/7. Average response time is &lt; 5 mins.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Specifications Table (Replicating Image 6 table) */}
        <div className="bg-white border border-border-subtle p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-border-subtle pb-3">
            <h3 className="text-navy font-extrabold text-base uppercase tracking-widest">
              Technical Specifications
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <tbody>
                {product.specs.map((spec, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border-subtle/50 ${
                      index % 2 === 0 ? "bg-background-muted/40" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-navy w-1/3">{spec.label}</td>
                    <td className="py-3 px-4 text-text-secondary">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Long Product Narrative */}
        {product.longDescription && (
          <div className="bg-white border border-border-subtle p-6 sm:p-8 rounded-3xl shadow-sm space-y-4 font-sans">
            <h3 className="text-navy font-extrabold text-base uppercase tracking-widest border-b border-border-subtle pb-3">
              Product Overview & Craftsmanship
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans whitespace-pre-line">
              {product.longDescription}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
