import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { CONTACT_INFO } from "../data/contact";
import { useProducts } from "../context/ProductContext";

export const ContactPage: React.FC = () => {
  const { addMessage } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Actually save message to shared context so Admin can read/manage it
    addMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || "General Inquiry",
      message: formData.message,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 5000);
  };


  return (
    <div className="bg-background-muted min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header (Replicating Image 4 header layout) */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
            NATIONWIDE COVERAGE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy font-sans">
            Get In Touch
          </h1>
          <div className="w-16 h-1 bg-orange mx-auto rounded-full" />
          <p className="text-sm text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Contact Malik Kamran Ahmad (CEO) and our manufacturing sales division. We process customized orders, provide physical mockups, and deliver nationwide.
          </p>
        </div>

        {/* Form and Contact Detail grid (Replicating Image 4 grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Direct Address cards and helpful info */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Location Card */}
              <div className="bg-white border border-border-subtle p-6 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-orange-light/10 text-orange rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <MapPin size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[14px] font-bold text-navy uppercase tracking-wider">Office Address</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{CONTACT_INFO.address}</p>
                  <p className="text-[10px] text-orange font-bold">Custom bulk shipping nationwide & worldwide</p>
                </div>
              </div>

              {/* CEO Hotline Card */}
              <div className="bg-white border border-border-subtle p-6 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-orange-light/10 text-orange rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Phone size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[14px] font-bold text-navy uppercase tracking-wider">Hotline Contact Numbers</h4>
                  <div className="space-y-1">
                    {CONTACT_INFO.phones.map((p, idx) => (
                      <p key={idx} className="text-xs text-navy font-bold hover:text-orange transition-colors">
                        <a href={`tel:${p.value}`}>{p.display}</a>
                      </p>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted">Available for educational institutions, military and corporate clients.</p>
                </div>
              </div>

              {/* Corporate Email Card */}
              <div className="bg-white border border-border-subtle p-6 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-orange-light/10 text-orange rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Mail size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[14px] font-bold text-navy uppercase tracking-wider">Corporate Inquiry Email</h4>
                  <p className="text-xs text-navy font-bold hover:text-orange transition-colors break-all">
                    <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
                  </p>
                  <p className="text-[10px] text-text-muted">Receive quotations inside 1 business day.</p>
                </div>
              </div>

            </div>

            {/* Custom mock map block (Replicating Image 4 map placeholder with gorgeous high-end layout) */}
            <div className="bg-navy-dark text-white p-6 rounded-3xl border border-navy-light relative overflow-hidden flex-1 min-h-[180px] flex flex-col justify-between mt-6">
              <div className="absolute inset-0 hero-dot-grid-dark opacity-15" />
              <div className="space-y-2 relative z-10">
                <div className="flex gap-2 items-center text-orange text-xs font-bold font-mono">
                  <Clock size={14} />
                  <span>MANUFACTURING CAPACITY</span>
                </div>
                <h4 className="text-base font-bold text-white">Full scale customization</h4>
                <p className="text-[11px] text-gray-300">
                  Our custom molds, precision dye-casting machinery, and high-volume embroidery facilities operate 24 hours daily to fulfill government and educational contracts.
                </p>
              </div>

              <div className="flex gap-2 items-center pt-4 border-t border-navy-light/40 relative z-10">
                <ShieldAlert size={14} className="text-orange" />
                <span className="text-[9px] text-orange-light font-bold uppercase tracking-wider">Fast-track emergency orders available on demand</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Message Dispatcher Form */}
          <div className="md:col-span-7">
            <div className="bg-white border border-border-subtle p-8 rounded-3xl shadow-sm h-full flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-navy font-sans">Send a Message</h3>
                  <p className="text-xs text-text-secondary font-sans">
                    Have a general query, custom idea, or want to partner on a joint bid? Leave us a message.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-4 py-16">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-navy">Message Received!</h4>
                    <p className="text-xs text-text-secondary max-w-sm mx-auto">
                      Thank you for contacting Multiline Promotional, <strong className="text-navy">{formData.name}</strong>. Malik Kamran Ahmad and our coordination division will reach back shortly.
                    </p>
                    <span className="text-[10px] text-text-muted font-mono block pt-2">Ref ID: ML-{Math.floor(Math.random() * 90000 + 10000)}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-navy uppercase tracking-wider block">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g., Brigadier Tariq Mahmood"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-navy uppercase tracking-wider block">Corporate Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="E.g., t.mahmood@organization.pk"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-navy uppercase tracking-wider block">Subject of Inquiry</label>
                      <input
                        type="text"
                        placeholder="E.g., Custom Winner Medals & Wooden Plaques Quotation"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-navy uppercase tracking-wider block">Message Details *</label>
                      <textarea
                        required
                        placeholder="Please write details about your customized order requirements, quantities, and expected delivery date."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full bg-background-muted border border-border-subtle focus:border-orange focus:ring-1 focus:ring-orange focus:outline-none rounded-xl p-3 text-xs sm:text-sm font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange hover:bg-orange-dark text-navy font-black text-xs sm:text-sm tracking-wide uppercase py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-orange shadow-md hover:shadow-orange/20 cursor-pointer"
                    >
                      <Send size={16} />
                      Send Message
                    </button>

                  </form>
                )}
              </div>

              <div className="text-[10px] text-text-muted font-sans pt-4 border-t border-border-subtle/50 mt-6 text-center">
                * Denotes required input fields. Your corporate contact details are kept strictly secure.
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
