import React from "react";
import { Award, Trees, Shirt, Gift, ShieldAlert, BadgeCheck, Zap, Scissors, Star, ArrowRight } from "lucide-react";
import { CLIENT_REVIEWS } from "../data/products";
import { useProducts } from "../context/ProductContext";

interface HomeSectionsProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenConsultation: () => void;
}

// 1. TrustedByStrip / OUR CLIENTS Component (Matches Image 1 and Image 3)
export const TrustedByStrip: React.FC = () => {
  const clients = [
    { name: "Pakistan Army", label: "GHQ Pakistan" },
    { name: "Pakistan Air Force", label: "PAF Base" },
    { name: "Pakistan Senate", label: "Parliament House" },
    { name: "Rotary International", label: "District 3272" },
    { name: "LUMS", label: "Lahore" },
    { name: "Punjab University", label: "PU Lahore" },
    { name: "UET", label: "UET Lahore" },
    { name: "NUST", label: "Islamabad" },
    { name: "UMT", label: "UMT Lahore" },
    { name: "FPSC", label: "Federal Commission" },
  ];

  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
            ESTABLISHED CREDIBILITY
          </span>
          <h2 className="text-3xl font-extrabold text-navy font-sans">
            Our Prestigious Clients
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto font-sans">
            We are honored to be trusted by national institutions, armed services, academies, and premium corporate organizations across Pakistan.
          </p>
        </div>

        {/* Clients Grid (Matches the exact bento-badge aesthetic of Image 1 and 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="bg-background-muted hover:bg-white border border-border-subtle hover:border-orange/30 p-5 rounded-xl text-center transition-all duration-300 hover:shadow-md group cursor-default"
            >
              <h4 className="text-navy font-extrabold text-[14px] tracking-wide mb-1 group-hover:text-orange transition-colors">
                {client.name}
              </h4>
              <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">
                {client.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 2. FeaturedCategoriesGrid / OUR SERVICE Component (Matches Image 1)
export const FeaturedCategoriesGrid: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { categories } = useProducts();
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award size={32} className="text-orange" />;
      case "Trees":
        return <Trees size={32} className="text-orange" />;
      case "Shirt":
        return <Shirt size={32} className="text-orange" />;
      case "Gift":
        return <Gift size={32} className="text-orange" />;
      default:
        return <Award size={32} className="text-orange" />;
    }
  };

  return (
    <section className="bg-background-muted py-20 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matches SectionHeadingBlock structure in Specification) */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
            OUR SERVICE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight font-sans">
            Crafting Your Brand's Story
          </h2>
          <div className="w-16 h-1 bg-orange mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto font-sans leading-relaxed">
            We offer a comprehensive range of custom corporate and promotional products designed to meet diverse branding needs. From elegant awards to practical giveaways, our services are tailored to enhance your corporate identity and leave an irreproachable mark on your audience.
          </p>
        </div>

        {/* 4 Core Category Cards (Perfect replica of Image 1 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange/30 transition-all duration-300 flex flex-col justify-between group h-full"
            >
              <div className="space-y-4">
                {/* Icon Wrapper Circle */}
                <div className="w-14 h-14 rounded-xl bg-orange-light/20 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-all duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(category.iconName)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-navy font-bold text-lg leading-tight group-hover:text-orange transition-colors">
                    {category.title}
                  </h3>
                  <span className="text-orange text-xs font-semibold tracking-wide block">
                    {category.tagline}
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed pt-1">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border-subtle/50 mt-6 flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-bold font-sans uppercase">For prices and details, please contact us on WhatsApp or Email.</span>
                <button
                  onClick={() => onNavigate("catalog", { categoryFilter: category.id })}
                  className="p-2 rounded-lg bg-navy hover:bg-orange hover:text-navy text-white transition-all duration-300 shrink-0 cursor-pointer flex items-center justify-center"
                  title="View Products in Category"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// 3. WhyChooseUsSection (Matches Image 1 and specification)
export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      num: "1",
      title: "Uncompromising Quality",
      desc: "Only the best materials and craftsmanship are used in every product.",
    },
    {
      num: "2",
      title: "Timely Delivery",
      desc: "We ensure your orders arrive on schedule, every time.",
    },
    {
      num: "3",
      title: "Affordable Pricing",
      desc: "Premium products without the premium price tag. Quality accessible to all.",
    },
    {
      num: "4",
      title: "Extensive Customization",
      desc: "Tailor every detail to perfectly match your brand's aesthetic.",
    },
  ];

  return (
    <section className="bg-white py-20 border-b border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / List Column */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
                WHY WORK WITH US
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight font-sans">
                Our Corporate Commitment
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans max-w-xl">
                For over 25 years, Multiline Promotional has stood for absolute precision in custom corporate merchandising. We have refined our manufacturing to ensure stunning output.
              </p>
            </div>

            {/* List block */}
            <div className="space-y-6">
              {points.map((pt) => (
                <div key={pt.num} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-navy text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow border border-navy-light">
                    {pt.num}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[15px] font-bold text-navy leading-tight">{pt.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Highlight Solid Card Column */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-orange/5 rounded-3xl blur-2xl transform rotate-2 pointer-events-none" />
            
            {/* Beautiful Solid Deep Blue Card displaying key slogan */}
            <div className="relative bg-navy-light text-white p-8 sm:p-12 rounded-2xl border border-navy-light/80 shadow-2xl overflow-hidden min-h-[300px] flex flex-col justify-between">
              {/* Soft diagonal highlight */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange/10 rounded-full blur-[40px]" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange/20 rounded-tl-full" />
              
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 bg-orange-light/20 rounded-xl flex items-center justify-center">
                  <Award size={24} className="text-orange" />
                </div>
                <blockquote className="text-lg sm:text-xl font-medium leading-relaxed font-sans italic text-orange-light">
                  "Partner with Multiline Promotional for branding solutions that combine decades of experience with modern innovation."
                </blockquote>
              </div>

              <div className="pt-6 border-t border-navy/40 flex items-center justify-between text-xs text-gray-300 relative z-10 mt-8">
                <div>
                  <span className="block font-black text-white text-sm">Malik Kamran Ahmad</span>
                  <span className="text-[10px] text-orange uppercase font-bold tracking-wider">Chief Executive Officer</span>
                </div>
                <div className="flex gap-0.5 text-orange">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={10} fill="#F5821F" stroke="#F5821F" />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// 4. Testimonials Section
export const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
            CLIENT TESTIMONIALS
          </span>
          <h2 className="text-3xl font-extrabold text-navy font-sans">
            What Our Partners Say
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto font-sans">
            Real feedback from procurement officers, deans, and brand managers who rely on Multiline Promotional for high-stakes recognition projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CLIENT_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-background-muted border border-border-subtle p-8 rounded-2xl flex flex-col justify-between hover:border-orange/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#F5821F" stroke="#F5821F" />
                  ))}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-sans italic">
                  "{review.review}"
                </p>
              </div>

              <div className="pt-6 border-t border-border-subtle/50 mt-6">
                <h4 className="text-[14px] font-bold text-navy leading-tight">{review.name}</h4>
                <span className="text-[11px] text-text-muted">{review.role}</span>
                <span className="text-[11px] font-bold text-orange block">{review.company}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// 5. High-Impact CTA Banner (Matches Image 1)
export const CTABanner: React.FC<{ onOpenConsultation: () => void }> = ({ onOpenConsultation }) => {
  return (
    <section className="bg-navy-dark text-white py-16 border-b border-navy-light/40 relative overflow-hidden">
      {/* Decorative dot background pattern overlay */}
      <div className="absolute inset-0 hero-dot-grid-dark opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
          Ready to make an impression?
        </h2>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans max-w-2xl mx-auto">
          Get a custom quote for your bulk order today. Our expert team will guide you through options, materials, and custom modeling to choose the perfect products for your brand identity.
        </p>

        <div className="flex justify-center">
          <button
            onClick={onOpenConsultation}
            className="bg-orange hover:bg-orange-dark text-navy font-black text-sm tracking-wide px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange/30 border border-orange cursor-pointer"
          >
            Contact Us for Quote
          </button>
        </div>
      </div>
    </section>
  );
};
