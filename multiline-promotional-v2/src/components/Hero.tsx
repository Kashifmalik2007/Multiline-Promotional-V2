import React from "react";
import { ArrowRight, Star, ShieldCheck, Award, Users, Clock } from "lucide-react";
import heroUiImage from "../assets/ui/prdct img.png";

interface HeroProps {
  onNavigate: (page: string) => void;
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <section className="relative overflow-hidden bg-navy-dark text-white pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-navy-light/40">
      {/* Decorative dot grids and radial flares (Aesthetic CSS matching Final Specification) */}
      <div className="absolute inset-0 hero-dot-grid-dark pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-navy-light/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Credibility Badge (Replicating Image 7 perfectly) */}
            <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full bg-navy-light/80 border border-orange/30 shadow-md max-w-max mx-auto lg:mx-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange"></span>
              </span>
              <span className="text-xs font-bold tracking-wide text-orange-light font-sans">
                Manufacturer | Corporate & Promotional Products Supplier
              </span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-xs font-bold text-white font-mono">
                <Star size={12} fill="#F5821F" className="text-orange" />
                5.0 Rating
              </span>
            </div>

            {/* Bold Headline */}
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
                Our Brand Identity
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Premium Giveaways & <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-light">
                  Promotional Solutions
                </span>
              </h1>
            </div>

            {/* Supporting Paragraph */}
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              High-quality promotional products designed for corporate excellence. We craft masterfully finished trophies, metal shields, custom-embroidered team wear, and executive gift caskets with streamlined bulk ordering, reliable delivery, and meticulous customization.
            </p>

            {/* CTA Button Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto bg-orange hover:bg-orange-dark text-navy font-black text-[15px] tracking-wide px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange/20 border border-orange cursor-pointer hover:-translate-y-0.5"
              >
                Request Consultation
                <ArrowRight size={18} />
              </button>
              
              <button
                onClick={() => onNavigate("catalog")}
                className="w-full sm:w-auto bg-navy-light hover:bg-navy-light/80 text-white font-bold text-[15px] tracking-wide px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-navy-light hover:border-orange/40 cursor-pointer hover:-translate-y-0.5"
              >
                Browse Catalog
              </button>
            </div>

            {/* Trust row (Replicating Image 7 perfectly) */}
            <div className="pt-8 border-t border-navy-light/40 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-left">
                <div className="p-2 rounded-lg bg-navy-light border border-navy-light/60">
                  <ShieldCheck size={18} className="text-orange" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white leading-tight">Trusted Quality</h4>
                  <span className="text-[10px] text-gray-400">Premium Standards</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-left">
                <div className="p-2 rounded-lg bg-navy-light border border-navy-light/60">
                  <Users size={18} className="text-orange" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white leading-tight">Happy Clients</h4>
                  <span className="text-[10px] text-gray-400">Nationwide Trust</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-left">
                <div className="p-2 rounded-lg bg-navy-light border border-navy-light/60">
                  <Clock size={18} className="text-orange" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white leading-tight">On-Time</h4>
                  <span className="text-[10px] text-gray-400">Reliable & Fast</span>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Column - Showcases Featured Mockups in a Stunning Visual Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft glowing ambient circle backplate */}
            <div className="absolute w-72 h-72 rounded-full bg-orange/10 blur-[80px]" />
            
            {/* Visual Glassmorphic Frame with Featured Products previews */}
            <div className="relative w-full max-w-md bg-navy-light/30 backdrop-blur-sm border border-navy-light/60 rounded-3xl p-6 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange to-orange-light" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-navy-light/50">
                  <span className="text-[11px] font-bold tracking-widest text-orange uppercase font-mono">FEATURED PREVIEW</span>
                  <span className="text-[10px] bg-orange-light/20 text-orange-light px-2.5 py-0.5 rounded-full font-bold">In-Stock</span>
                </div>

                {/* Hero showcase using the shared UI product asset */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-navy-dark border border-navy-light/80 flex items-center justify-center shadow-inner group-hover:border-orange/20 transition-colors duration-500">
                  <div className="absolute inset-0 hero-dot-grid opacity-10" />
                  <img
                    src={heroUiImage}
                    alt="Premium promotional products showcase"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-navy-dark/90 backdrop-blur-md border border-navy-light p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-[12px] font-black text-white">Custom Corporate Merchandising</h4>
                      <span className="text-[10px] text-gray-400">Awards, caps, clocks & executive gifts</span>
                    </div>
                    <span className="text-orange text-xs font-black font-mono">Premium</span>
                  </div>
                </div>

                {/* Micro credibility indicator below the box */}
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>Custom Laser Engraved</span>
                  <span>Silk Casket Box Pack</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
