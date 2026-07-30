import React from "react";
import { Phone, Mail, MapPin, Globe, Star, ShieldCheck } from "lucide-react";
import { CONTACT_INFO } from "../data/contact";
import { MultilineLogo } from "./MultilineLogo";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-gray-300 pt-16 pb-8 border-t border-navy-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onNavigate("home")}>
            <div className="relative w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-orange/30 shadow-md p-1.5 overflow-hidden">
              <MultilineLogo size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-base tracking-wider font-sans">
                MULTILINE PROMOTIONAL
              </span>
              <span className="text-orange text-[9px] font-bold tracking-widest uppercase">
                Corporate & Promotional Giveaways
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Your partner for premium promotional products. We help you make a lasting impression with masterfully crafted custom merchandise, awards, and teamwear.
          </p>

          <div className="flex items-center gap-2 text-xs bg-navy-light/50 p-3 rounded-lg border border-navy-light max-w-max">
            <ShieldCheck size={18} className="text-orange" />
            <span className="font-semibold text-gray-200">Official ISO 9001 Compliant Quality</span>
          </div>
        </div>

        {/* Company Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 relative pl-3 border-l-2 border-orange">
            Company
          </h4>
          <ul className="space-y-3.5 text-sm font-medium">
            <li>
              <button onClick={() => onNavigate("home")} className="hover:text-orange transition-colors cursor-pointer text-left">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("catalog")} className="hover:text-orange transition-colors cursor-pointer text-left">
                Catalog / Products
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("about")} className="hover:text-orange transition-colors cursor-pointer text-left">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("contact")} className="hover:text-orange transition-colors cursor-pointer text-left">
                Contact & Support
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("admin")} className="text-orange hover:text-orange-dark transition-colors cursor-pointer text-left font-bold">
                Admin Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 relative pl-3 border-l-2 border-orange">
            Categories
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li>
              <button onClick={() => onNavigate("catalog")} className="hover:text-orange transition-colors text-left">
                Awards & Metal Crafts
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("catalog")} className="hover:text-orange transition-colors text-left">
                Handcrafted Wooden Creatives
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("catalog")} className="hover:text-orange transition-colors text-left">
                Custom Apparel & Caps
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("catalog")} className="hover:text-orange transition-colors text-left">
                Luxury Executive Corporate Gifts
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 relative pl-3 border-l-2 border-orange">
            Contact Us
          </h4>
          <ul className="space-y-4 text-xs font-sans">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-orange mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5 text-[13px]">Address:</strong>
                <span className="text-gray-400">{CONTACT_INFO.address}</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={16} className="text-orange mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5 text-[13px]">Phones:</strong>
                {CONTACT_INFO.phones.map((phone, i) => (
                  <a key={i} href={`tel:${phone.value}`} className="text-gray-400 hover:text-orange transition-colors block">
                    {phone.display}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="text-orange mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5 text-[13px]">Email:</strong>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-400 hover:text-orange transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Globe size={16} className="text-orange mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block mb-0.5 text-[13px]">Web:</strong>
                <a href={`http://${CONTACT_INFO.web}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-orange transition-colors">
                  {CONTACT_INFO.web}
                </a>
              </div>
            </li>
          </ul>

          <div className="pt-4 border-t border-navy-light/40 flex items-center gap-2">
            <span className="text-[13px] font-bold text-white uppercase">Rating:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill="#F5821F" stroke="#F5821F" />
              ))}
            </div>
            <span className="text-xs text-orange font-bold font-mono">{CONTACT_INFO.rating.score.toFixed(1)}</span>
            <span className="text-[11px] text-gray-400">{CONTACT_INFO.rating.label.replace("⭐ 5.0 ", "")}</span>
          </div>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-navy-light/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-sans">
        <div>
          © {currentYear} Multiline Promotionals. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-orange transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-orange transition-colors">Terms of Service</a>
          <span className="text-gray-700">|</span>
          <span className="text-gray-400">Crafted in High-Precision Vector UI</span>
        </div>
      </div>
    </footer>
  );
};
