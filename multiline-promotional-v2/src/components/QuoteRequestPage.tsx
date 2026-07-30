import React, { useState } from "react";
import { useQuoteList } from "../context/QuoteListContext";
import { ProductImageRenderer } from "./ProductImageRenderer";
import { ArrowLeft, Trash2, Calendar, FileSpreadsheet, CheckCircle2, ShoppingCart, Send, PhoneCall } from "lucide-react";
import { Product } from "../types";
import { CONTACT_INFO } from "../data/contact";
import { useProducts } from "../context/ProductContext";

interface QuoteRequestPageProps {
  onBackToCatalog: () => void;
}

export const QuoteRequestPage: React.FC<QuoteRequestPageProps> = ({ onBackToCatalog }) => {
  const { items, removeFromQuoteList, updateQuoteItem, clearQuoteList } = useQuoteList();
  const { addQuote } = useProducts();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    org: "",
    dateNeeded: "",
    city: "",
    commPref: "WhatsApp",
    extraDetails: "",
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);

  const handleUpdateQty = (productId: string, qty: number, minQty: number) => {
    updateQuoteItem(productId, Math.max(minQty, qty));
  };

  const handleUpdateNotes = (productId: string, notes: string) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      updateQuoteItem(productId, item.quantity, notes);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!formData.name || !formData.phone || !formData.email) return;

    // Actually register the quote request on the administrator's dashboard database
    const savedQuote = addQuote({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      org: formData.org,
      dateNeeded: formData.dateNeeded,
      city: formData.city,
      commPref: formData.commPref,
      extraDetails: formData.extraDetails,
      items: [...items]
    });

    // Capture quotation receipt details for UI rendering
    setQuoteDetails({
      id: savedQuote.id,
      date: savedQuote.date,
      client: { ...formData },
      items: [...items],
    });

    setIsCompleted(true);
  };

  // Compile full pre-formatted text block for immediate CEO WhatsApp dispatch
  const getWhatsAppSubmitUrl = () => {
    if (!quoteDetails) return "#";
    const phoneNumber = CONTACT_INFO.phones[0].value.replace("+", "");
    
    let itemsBlock = "";
    quoteDetails.items.forEach((item: any, idx: number) => {
      itemsBlock += `\n${idx + 1}. [${item.product.title}]
   - Quantity: ${item.quantity} units
   - Custom Note: ${item.customizationNotes || "None"}\n`;
    });

    const text = `*Multiline Promotional - Bulk Inquiry Confirmation*
*Quote ID:* ${quoteDetails.id}
*Date:* ${quoteDetails.date}

*Client Information:*
- Name: ${quoteDetails.client.name}
- Org: ${quoteDetails.client.org || "Not specified"}
- Phone: ${quoteDetails.client.phone}
- Email: ${quoteDetails.client.email}
- City: ${quoteDetails.client.city || "Not specified"}
- Target Delivery Date: ${quoteDetails.client.dateNeeded || "Flexible"}

*Requested Products:*${itemsBlock}
*Additional Remarks:* ${quoteDetails.client.extraDetails || "None"}

Please share pricing catalogs and lead times. Thank you!`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  // Compile mailto link
  const getEmailSubmitUrl = () => {
    if (!quoteDetails) return "#";
    const subject = `Bulk Promotional Inquiry - ${quoteDetails.id}`;
    let itemsBlock = "";
    quoteDetails.items.forEach((item: any, idx: number) => {
      itemsBlock += `${idx + 1}. ${item.product.title} -- Qty: ${item.quantity} units (Customization: ${item.customizationNotes || "Standard"})\n`;
    });

    const body = `Quote ID: ${quoteDetails.id}
Date: ${quoteDetails.date}

Client Contact Details:
- Name: ${quoteDetails.client.name}
- Organization: ${quoteDetails.client.org}
- Phone: ${quoteDetails.client.phone}
- City: ${quoteDetails.client.city}
- Needed By: ${quoteDetails.client.dateNeeded}

Requested Bulk Products:
${itemsBlock}

Additional Comments:
${quoteDetails.client.extraDetails}

-- Submitted via Multiline Promotional Catalog Web Portal`;

    return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleReset = () => {
    clearQuoteList();
    setFormData({
      name: "",
      phone: "",
      email: "",
      org: "",
      dateNeeded: "",
      city: "",
      commPref: "WhatsApp",
      extraDetails: "",
    });
    setIsCompleted(false);
    setQuoteDetails(null);
  };

  return (
    <div className="bg-background-muted min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-2 text-sm font-bold text-navy hover:text-orange transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </button>
          
          <h1 className="text-xl font-extrabold text-navy font-sans flex items-center gap-2">
            <ShoppingCart size={22} className="text-orange" />
            Bulk Quotation Workspace
          </h1>
        </div>

        {isCompleted && quoteDetails ? (
          /* Quotation Summary / Success Receipt Screen */
          <div className="bg-white border border-border-subtle rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto">
            {/* Header branding strip */}
            <div className="bg-navy-dark text-white p-6 relative">
              <div className="absolute inset-0 hero-dot-grid-dark opacity-10" />
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h3 className="text-lg font-black text-orange uppercase tracking-widest">Inquiry Form Submitted</h3>
                  <span className="text-xs text-gray-300">Quote ID: {quoteDetails.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-gray-300">{quoteDetails.date}</span>
                </div>
              </div>
            </div>

            {/* Quotation Details Grid */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Success Notification Alert */}
              <div className="bg-green-50 border border-green-200 text-green-800 p-5 rounded-2xl flex gap-4 items-start">
                <CheckCircle2 size={24} className="text-green-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-navy text-sm sm:text-base">Inquiry Prepared for Manufacturing Sales</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    We have successfully formulated your bulk inquiry specifications. Select your submission method below to dispatch this directly to Malik Kamran Ahmad (CEO).
                  </p>
                </div>
              </div>

              {/* Client Info Summary */}
              <div className="border border-border-subtle p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-navy uppercase tracking-widest">Client Contact Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm">
                  <div><span className="text-text-muted">Contact Person:</span> <strong className="text-navy">{quoteDetails.client.name}</strong></div>
                  <div><span className="text-text-muted">Organization:</span> <strong className="text-navy">{quoteDetails.client.org || "None"}</strong></div>
                  <div><span className="text-text-muted">Phone Number:</span> <strong className="text-navy">{quoteDetails.client.phone}</strong></div>
                  <div><span className="text-text-muted">Corporate Email:</span> <strong className="text-navy">{quoteDetails.client.email}</strong></div>
                  <div><span className="text-text-muted">Shipping Location:</span> <strong className="text-navy">{quoteDetails.client.city || "Pakistan"}</strong></div>
                  <div><span className="text-text-muted">Target Delivery Date:</span> <strong className="text-navy">{quoteDetails.client.dateNeeded || "Flexible"}</strong></div>
                </div>
              </div>

              {/* Products Itemized Table */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-navy uppercase tracking-widest">Itemized Production Request</h4>
                <div className="border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
                  {quoteDetails.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 flex gap-4 items-center justify-between text-xs sm:text-sm">
                      <div className="flex gap-3 items-center">
                        <span className="text-xs font-bold text-text-muted">{idx + 1}.</span>
                        <div className="w-12 h-12 bg-slate-50 border border-border-subtle rounded-lg flex items-center justify-center p-1">
                          <ProductImageRenderer productId={item.product.id} className="w-full h-full" />
                        </div>
                        <div>
                          <h5 className="font-bold text-navy leading-none">{item.product.title}</h5>
                          {item.customizationNotes && (
                            <p className="text-[10px] text-orange font-sans mt-1">Specs: {item.customizationNotes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-navy font-mono">{item.quantity}</span> <span className="text-text-muted text-[10px]">units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Messenger Dispatch Section (Replicating Specification requirement) */}
              <div className="bg-navy-light text-white p-6 rounded-3xl space-y-4 text-center">
                <h4 className="font-extrabold text-white text-base">Select Dispatch Action</h4>
                <p className="text-xs text-gray-300 leading-relaxed max-w-xl mx-auto">
                  For immediate order prioritization and pricing discussions, dispatch your quotation directly on Malik Kamran Ahmad's official CEO WhatsApp channel.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={getWhatsAppSubmitUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-whatsapp hover:bg-opacity-95 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-whatsapp"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.01-5.05-2.85-6.893-1.84-1.842-4.29-2.856-6.896-2.858-5.437 0-9.863 4.371-9.867 9.743-.001 1.73.457 3.418 1.328 4.937l-.988 3.613 3.712-.96zm11.367-7.614c-.301-.15-1.78-.877-2.056-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.651.075-.301-.15-1.272-.468-2.422-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.018-.462.13-.61.135-.133.301-.35.451-.524.15-.174.2-.3.301-.5.1-.2.05-.375-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.588-.493-.508-.675-.518-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.374-.275.3-.1.775-.1 1.624 0 1.7 1.25 3.342 1.425 3.57.175.225 2.458 3.754 5.954 5.26.832.358 1.48.572 1.986.733.837.266 1.6.228 2.202.139.672-.1 1.78-.727 2.03-1.428.25-.7.25-1.3.175-1.428-.075-.125-.275-.2-.575-.35z" />
                    </svg>
                    Submit on WhatsApp
                  </a>

                  <a
                    href={getEmailSubmitUrl()}
                    className="bg-orange hover:bg-orange-dark text-navy font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-orange"
                  >
                    <Send size={16} />
                    Submit on Email
                  </a>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border-subtle/50 text-xs text-text-muted">
                <span>Thank you for choosing Multiline Promotional.</span>
                <button
                  onClick={handleReset}
                  className="text-orange hover:text-orange-dark font-bold font-sans cursor-pointer"
                >
                  Create New Inquiry
                </button>
              </div>

            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Basket State */
          <div className="bg-white border border-border-subtle rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-orange-light/10 text-orange rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-navy">Your Quote Workspace is empty</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Add premium custom items from our catalog to customize your parameters and request a formal quotation.
              </p>
            </div>
            <button
              onClick={onBackToCatalog}
              className="bg-navy hover:bg-orange text-white hover:text-navy font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer border border-navy"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          /* Main Workspace: Left Column Added Items, Right Column Buyer Information Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Added Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-border-subtle p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border-subtle/50">
                  <span className="text-xs font-black text-navy uppercase tracking-widest">ADDED PRODUCTS ({items.length})</span>
                  <button
                    onClick={clearQuoteList}
                    className="text-xs text-orange hover:text-orange-dark font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-border-subtle/60 space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="pt-4 first:pt-0 flex flex-col gap-4">
                      
                      {/* Product identity and removal */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-3 items-center">
                          <div className="w-14 h-14 bg-slate-50 border border-border-subtle rounded-xl flex items-center justify-center shrink-0 p-1.5">
                            <ProductImageRenderer productId={item.product.id} className="w-full h-full" />
                          </div>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-navy leading-none">{item.product.title}</h4>
                            <span className="text-[10px] text-text-muted font-mono">{item.product.category}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromQuoteList(item.product.id)}
                          className="text-text-muted hover:text-orange p-1.5 rounded-lg hover:bg-background-muted transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Config params for item */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-background-muted/40 p-4 rounded-xl border border-border-subtle/40">
                        {/* Qty count */}
                        <div className="sm:col-span-5 space-y-1">
                          <span className="text-[10px] font-black text-navy uppercase tracking-wider block">Quantity</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQty(item.product.id, item.quantity - 50, item.product.minOrder)}
                              disabled={item.quantity <= item.product.minOrder}
                              className="w-8 h-8 rounded-lg border border-border-subtle bg-white flex items-center justify-center font-bold text-navy text-sm cursor-pointer disabled:opacity-40"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQty(item.product.id, parseInt(e.target.value) || item.product.minOrder, item.product.minOrder)}
                              className="w-16 text-center font-bold text-navy border border-border-subtle py-1 rounded-lg text-xs bg-white focus:outline-none"
                            />
                            <button
                              onClick={() => handleUpdateQty(item.product.id, item.quantity + 50, item.product.minOrder)}
                              className="w-8 h-8 rounded-lg border border-border-subtle bg-white flex items-center justify-center font-bold text-navy text-sm cursor-pointer"
                            >
                              +
                            </button>
                            <span className="text-[10px] text-text-muted">Min: {item.product.minOrder}</span>
                          </div>
                        </div>

                        {/* Special Customization request */}
                        <div className="sm:col-span-7 space-y-1">
                          <span className="text-[10px] font-black text-navy uppercase tracking-wider block">Customization note for this product</span>
                          <input
                            type="text"
                            placeholder="E.g., Embossed university gold seal..."
                            value={item.customizationNotes || ""}
                            onChange={(e) => handleUpdateNotes(item.product.id, e.target.value)}
                            className="w-full bg-white border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-lg px-2.5 py-1.5 text-xs font-sans"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border-subtle/50 text-right">
                  <button
                    onClick={onBackToCatalog}
                    className="text-navy hover:text-orange font-bold text-xs cursor-pointer"
                  >
                    + Add More Products
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer Contact Form */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-border-subtle p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-navy font-sans">Corporate Inquiry Details</h3>
                  <p className="text-xs text-text-secondary leading-normal">
                    Complete your contact details so our sales director can formulate pricing tiers and send official PDF quotations.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Representative Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Prof. Dr. Kashif Malik"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="E.g., +92 300 4302849"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="E.g., kashif.m@lums.edu.pk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Organization */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Organization</label>
                      <input
                        type="text"
                        placeholder="E.g., LUMS Lahore"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Delivery City */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Delivery City</label>
                      <input
                        type="text"
                        placeholder="E.g., Islamabad"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expected Date */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Required Date</label>
                      <input
                        type="date"
                        value={formData.dateNeeded}
                        onChange={(e) => setFormData({ ...formData, dateNeeded: e.target.value })}
                        className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Contact Preference */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Contact Via</label>
                      <select
                        value={formData.commPref}
                        onChange={(e) => setFormData({ ...formData, commPref: e.target.value })}
                        className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm font-bold text-navy"
                      >
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                        <option value="Phone Call">Direct Call</option>
                      </select>
                    </div>
                  </div>

                  {/* Extra remarks */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy uppercase tracking-wider block">Additional Requirements</label>
                    <textarea
                      placeholder="E.g., Need urgent production inside 10 days, please prepare physical mockups..."
                      value={formData.extraDetails}
                      onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}
                      rows={2}
                      className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange hover:bg-orange-dark text-navy font-black text-xs sm:text-sm tracking-wide uppercase py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-orange shadow-md hover:shadow-orange/20 cursor-pointer"
                  >
                    <FileSpreadsheet size={16} />
                    Generate Quote Inquiry
                  </button>
                </form>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
