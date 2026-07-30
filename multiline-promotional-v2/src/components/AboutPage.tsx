import React from "react";
import { Award, ShieldCheck, HeartHandshake, Briefcase, Users, Flame } from "lucide-react";
import ceoImage from "../assets/ui/ceo.jpg";

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <ShieldCheck size={24} className="text-orange" />,
      title: "Quality Crafts",
      desc: "We use museum-grade hardwoods, scratch-proof optical crystals, pure sterling silver electroplating, and medical-grade soft PVC.",
    },
    {
      icon: <Flame size={24} className="text-orange" />,
      title: "Absolute Customization",
      desc: "Leveraging state-of-the-art laser engraving, 3D relief mold casting, high-density puff embroidery, and diamond-drag etching.",
    },
    {
      icon: <HeartHandshake size={24} className="text-orange" />,
      title: "Precision Timelines",
      desc: "Meeting strict defense, governmental, and corporate schedules with secure presentation boxes and nationwide express shipping.",
    },
  ];

  return (
    <div className="bg-background-muted min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header section (Replicating Image 3) */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange block">
            GET TO KNOW US
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy font-sans">
            Empowering Your Corporate Image
          </h1>
          <div className="w-16 h-1 bg-orange mx-auto rounded-full" />
        </div>

        {/* Two-Column Story and Values Grid (Perfect replica of Image 3 layouts) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column - Our Story */}
          <div className="md:col-span-7 bg-white border border-border-subtle p-8 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-2xl font-extrabold text-navy font-sans relative pl-4 border-l-4 border-orange leading-none">
              Our Story
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              Multiline Promotional is dedicated to empowering brands and honoring outstanding milestones with high-impact promotional merchandise, customized apparel, and premium awards. 
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              Led by our CEO, <strong className="text-navy font-bold">Malik Kamran Ahmad</strong>, we bring decades of hands-on technical manufacturing expertise to government delegations, academic convocations, and corporate retreats nationwide.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              Whether casting heavy gold winner medals, embroidering national stars on caps, or assembling presentation gift sets in cherrywood boxes, our team enforces rigorous ISO 9001 quality inspections. We understand that a promotional gift is the physical embodiment of your brand’s reputation.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle/50 text-center">
              <div>
                <span className="block text-2xl font-black text-orange font-mono">25+</span>
                <span className="text-[10px] text-text-muted uppercase font-bold">Years Experience</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-orange font-mono">1M+</span>
                <span className="text-[10px] text-text-muted uppercase font-bold">Custom Items</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-orange font-mono">500+</span>
                <span className="text-[10px] text-text-muted uppercase font-bold">Happy Brands</span>
              </div>
            </div>
          </div>

          {/* Right Column - Our Core Values */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-navy text-white p-8 rounded-3xl border border-navy-light shadow-md space-y-6">
              <h2 className="text-xl font-extrabold text-white font-sans relative pl-3 border-l-2 border-orange leading-none">
                Our Core Values
              </h2>
              
              <div className="space-y-6">
                {values.map((v, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl bg-navy-light border border-navy-light/60 shrink-0 text-orange">
                      {v.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[14px] font-bold text-orange-light leading-tight">{v.title}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* CEO Profile message with bespoke graphic representation */}
        <div className="bg-white border border-border-subtle p-8 sm:p-12 rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Stylized Avatar Placeholder/Vector frame representing Malik Kamran Ahmad */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-br from-navy to-navy-dark border-2 border-orange p-1 flex items-center justify-center overflow-hidden group shadow-lg">
              <div className="absolute inset-0 hero-dot-grid-dark opacity-10" />
              <img
                src={ceoImage}
                alt="Malik Kamran Ahmad, CEO of Multiline Promotional"
                className="w-full h-full object-cover rounded-[14px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-orange/95 py-1.5 text-center text-navy font-bold text-[10px] uppercase tracking-wider">
                CHIEF EXECUTIVE
              </div>
            </div>
          </div>

          {/* CEO Message Text */}
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-black text-orange uppercase tracking-widest block">MESSAGE FROM OUR LEADERSHIP</span>
            <h3 className="text-xl sm:text-2xl font-black text-navy leading-tight">
              "We manufacture symbols of achievement and trust."
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic">
              "Every medal we strike, every wooden block we engrave, and every shirt we embroider represents a human milestone. When military commanders, academic deans, and company executives entrust us with their legacy, we respond with absolute quality. We do not compromise on materials or delivery schedules because we know that reputation is a brand's single most valuable asset."
            </p>
            <div>
              <strong className="text-sm font-extrabold text-navy block">Malik Kamran Ahmad</strong>
              <span className="text-xs text-text-muted">Founder & CEO, Multiline Promotional Group</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
