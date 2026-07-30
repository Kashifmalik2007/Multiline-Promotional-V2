import React from "react";
import { useProducts } from "../context/ProductContext";

const productImageMap: Record<string, string> = {
  "wooden-shield-plaque": new URL("../assets/products/wooden-plaque.jpg", import.meta.url).href,
  "pvc-rubber-keychain": new URL("../assets/products/rubber-keychain.jpg", import.meta.url).href,
  "tactical-multi-tool-keychain": new URL("../assets/products/multi-tool.jpg", import.meta.url).href,
  "blue-white-trucker-cap": new URL("../assets/products/mesh-cap.jpg", import.meta.url).href,
  "wooden-shadowbox-medal-frame": new URL("../assets/products/medal-frame.jpg", import.meta.url).href,
  "silver-markhor-statue": new URL("../assets/products/markhor-statue.jpg", import.meta.url).href,
  "pakistan-star-green-cap": new URL("../assets/products/green-cap.jpg", import.meta.url).href,
  "embossed-gold-medal": new URL("../assets/products/gold-medal.jpg", import.meta.url).href,
  "dual-column-glass-award": new URL("../assets/products/glass-award.jpg", import.meta.url).href,
  "executive-wristwatch": new URL("../assets/products/executive-watch.jpg", import.meta.url).href,
  "led-wooden-clock": new URL("../assets/products/digital-clock.jpg", import.meta.url).href,
  "wooden-desk-clock-award": new URL("../assets/products/desk-clock.jpg", import.meta.url).href,
  "years-of-service-crystal": new URL("../assets/products/crystal-award.jpg", import.meta.url).href,
  "commemorative-coin-set": new URL("../assets/products/coin-set.jpg", import.meta.url).href,
  "butterfly-gold-tray": new URL("../assets/products/butterfly-tray.jpg.jpg", import.meta.url).href,
  "custom-signature-pen": new URL("../assets/products/signature-pen.jpg", import.meta.url).href,
  "luxury-coin-set": new URL("../assets/products/coin-set.jpg", import.meta.url).href,
  "premium-usb-gift-card": new URL("../assets/products/usb-card.jpg", import.meta.url).href,
  "premium-trophy-cup": new URL("../assets/products/trophy-cup.jpg", import.meta.url).href,
  "sniper-award": new URL("../assets/products/sniper-award.jpg", import.meta.url).href,
  "security-coin": new URL("../assets/products/security-coin.jpg", import.meta.url).href,
  "silver-honor-bowl": new URL("../assets/products/silver-bowl.jpg", import.meta.url).href,
};

interface ProductImageProps {
  productId: string;
  className?: string;
}

export const ProductImageRenderer: React.FC<ProductImageProps> = ({ productId, className = "" }) => {
  let productList: ReturnType<typeof useProducts>["products"] = [];
  try {
    const context = useProducts();
    productList = context.products;
  } catch (e) {
    // Graceful fallback if context is not yet loaded or missing
  }

  const product = productList.find((p) => p.id === productId);
  const imageSource = product ? product.image : productId;
  const mappedImage = productImageMap[productId];

  const isUploadedImage = !!imageSource && (imageSource.startsWith("/uploads/") || imageSource.startsWith("http://") || imageSource.startsWith("https://") || imageSource.startsWith("data:"));
  const isAssetKey = !isUploadedImage && typeof imageSource === "string" && !imageSource.includes("/") && !imageSource.includes(".");

  if (isUploadedImage) {
    return (
      <img
        src={imageSource}
        alt={product ? product.title : "Product Image"}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover rounded-xl ${className}`}
      />
    );
  }

  if (mappedImage && isAssetKey) {
    return (
      <img
        src={mappedImage}
        alt={product ? product.title : "Product Image"}
        className={`w-full h-full object-cover rounded-xl ${className}`}
      />
    );
  }

  if (isAssetKey) {
    return (
      <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label={product ? product.title : "Product Image"}>
        <rect x="0" y="0" width="400" height="400" fill="#f8fafc" />
        <circle cx="200" cy="160" r="90" fill="#f59e0b" opacity="0.18" />
        <path d="M120 300c20-70 140-90 160-20 16 56-52 90-80 90-34 0-74-22-80-70Z" fill="#0f172a" opacity="0.12" />
      </svg>
    );
  }

  if (imageSource) {
    return (
      <img 
        src={imageSource} 
        alt={product ? product.title : "Product Image"} 
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover rounded-xl ${className}`}
      />
    );
  }

  switch (productId) {
    case "wooden-shield-plaque":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Premium Wooden Shield Presentation Plaque">
          <defs>
            <radialGradient id="wood-grad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#8A4A21" />
              <stop offset="70%" stopColor="#5E2C0D" />
              <stop offset="100%" stopColor="#3B1803" />
            </radialGradient>
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE893" />
              <stop offset="35%" stopColor="#F9C846" />
              <stop offset="70%" stopColor="#B38B1B" />
              <stop offset="100%" stopColor="#82610A" />
            </linearGradient>
            <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#D2D7DF" />
              <stop offset="100%" stopColor="#808996" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0B1B3D" floodOpacity="0.15" />
            </filter>
          </defs>
          
          {/* Wooden Shield Base */}
          <g filter="url(#shadow)">
            <path d="M 200 40 Q 310 40 330 150 Q 330 260 200 340 Q 70 260 70 150 Q 90 40 200 40 Z" fill="url(#wood-grad)" stroke="#3B1803" strokeWidth="4" />
            <path d="M 200 55 Q 295 55 312 150 Q 312 245 200 320 Q 88 245 88 150 Q 105 55 200 55 Z" fill="none" stroke="#A65F32" strokeWidth="2" opacity="0.6" />
          </g>

          {/* Golden Centerpiece Medal */}
          <g filter="url(#shadow)" transform="translate(0, -10)">
            <circle cx="200" cy="180" r="70" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="2" />
            <circle cx="200" cy="180" r="62" fill="none" stroke="#FFF5D1" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="200" cy="180" r="50" fill="url(#gold-grad)" opacity="0.9" />
            
            {/* Intricate Crest Detailing */}
            <path d="M 175 180 L 200 150 L 225 180 L 200 210 Z" fill="none" stroke="#604604" strokeWidth="2" />
            <line x1="200" y1="150" x2="200" y2="210" stroke="#604604" strokeWidth="1.5" />
            <line x1="175" y1="180" x2="225" y2="180" stroke="#604604" strokeWidth="1.5" />
            <circle cx="200" cy="180" r="15" fill="url(#gold-grad)" stroke="#604604" strokeWidth="1.5" />
            <circle cx="200" cy="180" r="6" fill="#604604" />
            
            {/* Laurel Leaves around crest */}
            <path d="M 150 180 Q 155 140 185 140" fill="none" stroke="#604604" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 250 180 Q 245 140 215 140" fill="none" stroke="#604604" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Engraving Plate at Bottom */}
          <g filter="url(#shadow)">
            <rect x="130" y="275" width="140" height="40" rx="4" fill="url(#gold-grad)" stroke="#604604" strokeWidth="1.5" />
            <rect x="134" y="279" width="132" height="32" rx="2" fill="none" stroke="#82610A" strokeWidth="1" />
            {/* Engraved Line Details representing text */}
            <line x1="145" y1="290" x2="255" y2="290" stroke="#3B1803" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="160" y1="300" x2="240" y2="300" stroke="#3B1803" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </g>
        </svg>
      );

    case "pvc-rubber-keychain":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Custom Molded 3D PVC Rubber Keychains">
          <defs>
            <filter id="keychain-drop">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0B1B3D" floodOpacity="0.2" />
            </filter>
            <linearGradient id="metal-shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#BDC3C7" />
              <stop offset="70%" stopColor="#7F8C8D" />
              <stop offset="100%" stopColor="#95A5A6" />
            </linearGradient>
          </defs>
          
          {/* Metal Ring and Chain */}
          <circle cx="200" cy="70" r="32" fill="none" stroke="url(#metal-shine)" strokeWidth="8" filter="url(#keychain-drop)" />
          <circle cx="200" cy="70" r="32" fill="none" stroke="#7F8C8D" strokeWidth="1" opacity="0.3" />
          
          {/* Chain links */}
          <rect x="194" y="100" width="12" height="22" rx="6" fill="none" stroke="url(#metal-shine)" strokeWidth="4" />
          <rect x="194" y="118" width="12" height="22" rx="6" fill="none" stroke="url(#metal-shine)" strokeWidth="4" />

          {/* Rubber Body */}
          <g filter="url(#keychain-drop)">
            {/* Soft Black PVC Base Border */}
            <rect x="100" y="140" width="200" height="200" rx="30" fill="#152B57" stroke="#0B1B3D" strokeWidth="3" />
            <rect x="106" y="146" width="188" height="188" rx="24" fill="#0B1B3D" />

            {/* Inner Raised Logo Artwork - Orange Heart Loop (Matches Logo of Multiline Promotional) */}
            <path 
              d="M 200 180 
                 C 150 130, 110 190, 150 230 
                 C 180 260, 220 260, 250 230
                 C 290 190, 250 130, 200 180 Z" 
              fill="none" 
              stroke="#F5821F" 
              strokeWidth="14" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Inner dynamic ribbon overlay */}
            <path 
              d="M 160 210 Q 200 290 240 210" 
              fill="none" 
              stroke="#FCD9B2" 
              strokeWidth="6" 
              strokeLinecap="round" 
            />
            {/* Branded Title block */}
            <rect x="130" y="295" width="140" height="20" rx="4" fill="#F5821F" />
            <line x1="145" y1="305" x2="255" y2="305" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "tactical-multi-tool-keychain":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Tactical Multi-Tool Keychain with Bottle Opener">
          <defs>
            <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A525A" />
              <stop offset="50%" stopColor="#2E3338" />
              <stop offset="100%" stopColor="#1B1E21" />
            </linearGradient>
            <linearGradient id="silver-edge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#95A5A6" />
              <stop offset="100%" stopColor="#7F8C8D" />
            </linearGradient>
          </defs>
          
          {/* Metal ring */}
          <circle cx="200" cy="70" r="28" fill="none" stroke="url(#silver-edge)" strokeWidth="6" />
          <circle cx="200" cy="98" r="4" fill="url(#silver-edge)" />

          {/* Multi tool body */}
          <g filter="url(#shadow)">
            {/* Base Plate */}
            <path d="M 160 110 L 240 110 L 250 140 L 250 320 Q 250 340 230 350 L 170 350 Q 150 340 150 320 L 150 140 Z" fill="url(#titanium)" stroke="#1B1E21" strokeWidth="2" />
            
            {/* Chamfered edge lines */}
            <path d="M 158 115 L 242 115 L 245 140 L 245 320" fill="none" stroke="#7F8C8D" strokeWidth="1" opacity="0.4" />
            
            {/* Key hole hook cutout */}
            <circle cx="200" cy="140" r="16" fill="#F8F9FB" stroke="#1B1E21" strokeWidth="2" />
            
            {/* Hex wrench cutouts */}
            <polygon points="200,175 212,182 212,196 200,203 188,196 188,182" fill="#F8F9FB" stroke="#1B1E21" strokeWidth="2" />
            <polygon points="200,215 209,220 209,230 200,235 191,230 191,220" fill="#F8F9FB" stroke="#1B1E21" strokeWidth="1.5" />
            <polygon points="200,245 207,249 207,257 200,261 193,257 193,249" fill="#F8F9FB" stroke="#1B1E21" strokeWidth="1" />

            {/* Bottle Opener cut out on side */}
            <path d="M 251 240 C 220 240 220 280 251 280 L 251 270 C 235 270 235 250 251 250 Z" fill="#F8F9FB" stroke="#1B1E21" strokeWidth="2" />
            
            {/* Ruler etch marks */}
            <line x1="150" y1="160" x2="162" y2="160" stroke="#7F8C8D" strokeWidth="1.5" />
            <line x1="150" y1="180" x2="157" y2="180" stroke="#7F8C8D" strokeWidth="1" />
            <line x1="150" y1="200" x2="162" y2="200" stroke="#7F8C8D" strokeWidth="1.5" />
            <line x1="150" y1="220" x2="157" y2="220" stroke="#7F8C8D" strokeWidth="1" />
            <line x1="150" y1="240" x2="162" y2="240" stroke="#7F8C8D" strokeWidth="1.5" />
            
            {/* Brand engraving */}
            <text x="200" y="315" fill="#F5821F" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">MULTILINE</text>
            
            {/* Flat screwdriver tip at bottom */}
            <polygon points="180,350 220,350 215,360 185,360" fill="url(#silver-edge)" stroke="#1B1E21" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case "blue-white-trucker-cap":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Blue & White Trucker Cap">
          <defs>
            <linearGradient id="cap-blue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2E5BFF" />
              <stop offset="100%" stopColor="#0B2B9F" />
            </linearGradient>
            <linearGradient id="cap-white" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E4E6EB" />
            </linearGradient>
          </defs>
          
          {/* Background Shadow */}
          <ellipse cx="200" cy="320" rx="140" ry="25" fill="#0B1B3D" opacity="0.12" />

          {/* Cap dome */}
          <g>
            {/* Mesh Back Royal Blue */}
            <path d="M 110 240 C 90 180 130 110 200 110 C 270 110 310 180 290 240 Z" fill="url(#cap-blue)" stroke="#0B2B9F" strokeWidth="2" />
            {/* Mesh netting details */}
            <path d="M 130 240 Q 150 140 200 110 Q 250 140 270 240" fill="none" stroke="#2543B3" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 150 240 Q 170 160 200 110 Q 230 160 250 240" fill="none" stroke="#2543B3" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Front Panel Structured (White Foam) */}
            <path d="M 140 240 C 130 180 160 120 200 120 C 240 120 270 180 260 240 Z" fill="url(#cap-white)" stroke="#CBD0DA" strokeWidth="1.5" />
            
            {/* Top Button */}
            <ellipse cx="200" cy="112" rx="12" ry="6" fill="url(#cap-blue)" stroke="#0B2B9F" strokeWidth="1" />
            
            {/* Embroidered custom patch on front */}
            <circle cx="200" cy="175" r="24" fill="#F5821F" stroke="#FFE893" strokeWidth="2" />
            <path d="M 200 160 L 207 172 L 221 174 L 211 184 L 213 198 L 200 191 L 187 198 L 189 184 L 179 174 L 193 172 Z" fill="#FFFFFF" />
            
            {/* Visor Brim (Royal Blue) */}
            <path d="M 130 240 Q 70 260 60 280 Q 90 305 200 305 Q 310 305 340 280 Q 330 260 270 240 Q 200 265 130 240 Z" fill="url(#cap-blue)" stroke="#0B2B9F" strokeWidth="2" />
            {/* Visor stitches */}
            <path d="M 115 245 Q 75 265 75 277 Q 105 295 200 295 Q 295 295 325 277 Q 325 265 285 245" fill="none" stroke="#2E5BFF" strokeWidth="1.5" />
            <path d="M 125 242 Q 85 260 85 272 Q 110 288 200 288 Q 290 288 315 272 Q 315 260 275 242" fill="none" stroke="#2E5BFF" strokeWidth="1" />
          </g>
        </svg>
      );

    case "wooden-shadowbox-medal-frame":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Deluxe Wooden Shadowbox Medal Display Frame">
          <defs>
            <radialGradient id="frame-wood" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#5C2D13" />
              <stop offset="100%" stopColor="#2E1405" />
            </radialGradient>
            <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B5E20" />
              <stop offset="35%" stopColor="#1B5E20" />
              <stop offset="35%" stopColor="#F5821F" />
              <stop offset="65%" stopColor="#F5821F" />
              <stop offset="65%" stopColor="#1B5E20" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
          </defs>
          
          <g filter="url(#shadow)">
            {/* Wooden Frame */}
            <rect x="70" y="50" width="260" height="300" rx="8" fill="url(#frame-wood)" stroke="#170A02" strokeWidth="6" />
            
            {/* Inner Shadow Shadowbox depth */}
            <rect x="86" y="66" width="228" height="268" rx="4" fill="#071022" stroke="#000000" strokeWidth="3" />
            
            {/* Velvet texture pattern representation */}
            <rect x="90" y="70" width="220" height="260" rx="2" fill="#0B1B3D" opacity="0.95" />
          </g>

          {/* Golden Hanging Hanger */}
          <rect x="185" y="44" width="30" height="6" rx="2" fill="url(#gold-grad)" />

          {/* Interior Displayed Medal */}
          <g transform="translate(0, 20)">
            {/* Medal Ribbon */}
            <polygon points="180,90 220,90 230,170 170,170" fill="url(#ribbon-grad)" stroke="#113613" strokeWidth="1" />
            <rect x="175" y="85" width="50" height="8" fill="url(#gold-grad)" rx="2" />
            
            {/* Ribbon fold shadow */}
            <polygon points="170,170 230,170 200,190" fill="#E5A93C" opacity="0.3" />
            
            {/* Heavy Gold Medal Crest */}
            <circle cx="200" cy="210" r="38" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="2.5" filter="url(#shadow)" />
            <circle cx="200" cy="210" r="32" fill="none" stroke="#FFF5D1" strokeWidth="1.5" />
            
            {/* Embossed Star */}
            <polygon points="200,185 209,203 229,206 215,220 218,239 200,230 182,239 185,220 171,206 191,203" fill="url(#gold-grad)" stroke="#523B04" strokeWidth="1" />
            <circle cx="200" cy="210" r="6" fill="#FFF5D1" />
          </g>

          {/* Inscription plate under medal */}
          <rect x="120" y="290" width="160" height="28" rx="2" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
          <line x1="135" y1="300" x2="265" y2="300" stroke="#3B1803" strokeWidth="1.5" />
          <line x1="150" y1="308" x2="250" y2="308" stroke="#3B1803" strokeWidth="1" />
        </svg>
      );

    case "silver-markhor-statue":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Majestic Silver Markhor Souvenir Statue">
          <defs>
            <linearGradient id="velvet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E5E3A" />
              <stop offset="100%" stopColor="#0E3520" />
            </linearGradient>
            <linearGradient id="pedestal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E2F13" />
              <stop offset="100%" stopColor="#301305" />
            </linearGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="200" cy="355" rx="120" ry="18" fill="#0B1B3D" opacity="0.15" />

          {/* Rosewood Pedestal */}
          <g filter="url(#shadow)">
            <polygon points="90,340 310,340 320,360 80,360" fill="url(#pedestal)" stroke="#220D03" strokeWidth="2" />
            <rect x="100" y="300" width="200" height="40" fill="url(#pedestal)" stroke="#220D03" strokeWidth="2" />
            <rect x="104" y="304" width="192" height="6" fill="#A8572D" opacity="0.4" />
          </g>
          
          {/* Green Velvet Drape */}
          <rect x="115" y="275" width="170" height="25" rx="3" fill="url(#velvet)" stroke="#0E3520" strokeWidth="1.5" />
          <path d="M 115 290 Q 140 305 170 295 Q 200 305 230 295 Q 260 305 285 290" fill="none" stroke="#0E3520" strokeWidth="1" />

          {/* Silver Markhor Figurine */}
          <g filter="url(#shadow)" transform="translate(130, 45)">
            {/* Spiraled Horns (Markhor Signature) */}
            <path d="M 64 90 C 60 40, 80 10, 85 5 Q 81 25, 71 55 Q 67 75, 68 90" fill="url(#silver-grad)" stroke="#5A626E" strokeWidth="1.5" />
            <path d="M 76 90 C 85 40, 95 15, 105 10 Q 94 30, 84 60 Q 78 75, 78 90" fill="url(#silver-grad)" stroke="#5A626E" strokeWidth="1.5" />
            
            {/* Horn Ridges */}
            <path d="M 72 25 Q 77 22, 79 26 M 68 45 Q 74 42, 76 46 M 70 65 Q 75 62, 77 66" stroke="#4B515A" strokeWidth="1.5" fill="none" />
            <path d="M 94 32 Q 98 29, 101 33 M 87 50 Q 92 47, 95 51 M 80 70 Q 84 67, 87 71" stroke="#4B515A" strokeWidth="1.5" fill="none" />

            {/* Markhor Head & Beard */}
            <path d="M 50 110 Q 70 95 78 90 L 78 115 Q 74 135 70 145 Q 64 155 64 165 Q 54 135 50 110 Z" fill="url(#silver-grad)" stroke="#5A626E" strokeWidth="2" />
            {/* Long white/silver beard */}
            <path d="M 62 140 Q 55 185 40 215 Q 62 200 70 160 Z" fill="#FFFFFF" stroke="#BAC1CC" strokeWidth="1" opacity="0.9" />

            {/* Strong Muscular Body */}
            <path d="M 70 110 Q 115 110 135 140 Q 140 160 140 180 Q 130 200 110 230 L 105 230 Q 95 180 80 160 Q 65 145 70 110" fill="url(#silver-grad)" stroke="#5A626E" strokeWidth="2" />
            
            {/* Legs */}
            {/* Front leg */}
            <path d="M 80 160 L 78 235 L 86 235 L 92 185 Z" fill="url(#silver-grad)" stroke="#5A626E" strokeWidth="1.5" />
            {/* Back leg */}
            <path d="M 125 180 L 120 235 L 128 235 L 132 195 Z" fill="url(#silver-grad)" stroke="#5A626E" strokeWidth="1.5" />
            
            {/* Hooves */}
            <rect x="76" y="232" width="11" height="4" fill="#3A3F47" rx="1" />
            <rect x="118" y="232" width="11" height="4" fill="#3A3F47" rx="1" />
          </g>

          {/* Gilded inscription plaque on base */}
          <rect x="150" y="312" width="100" height="18" rx="2" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
          <line x1="162" y1="321" x2="238" y2="321" stroke="#3B1803" strokeWidth="1.5" />
        </svg>
      );

    case "pakistan-star-green-cap":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Premium Pakistan Star Embroidered Green Cap">
          <defs>
            <linearGradient id="cap-green" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#115E33" />
              <stop offset="100%" stopColor="#0B3E21" />
            </linearGradient>
          </defs>
          
          <ellipse cx="200" cy="320" rx="140" ry="25" fill="#0B1B3D" opacity="0.12" />

          {/* Cap dome */}
          <g>
            {/* Main Cap Crown */}
            <path d="M 110 240 C 90 170 130 100 200 100 C 270 100 310 170 290 240 Z" fill="url(#cap-green)" stroke="#062614" strokeWidth="2.5" />
            
            {/* Panel seam lines representing 6-panel build */}
            <path d="M 200 100 L 200 240" fill="none" stroke="#0A4222" strokeWidth="2" />
            <path d="M 200 100 Q 150 145 110 240" fill="none" stroke="#0A4222" strokeWidth="1.5" />
            <path d="M 200 100 Q 250 145 290 240" fill="none" stroke="#0A4222" strokeWidth="1.5" />
            
            {/* Air Vent Eyelets */}
            <circle cx="155" cy="150" r="3" fill="#0A4222" />
            <circle cx="245" cy="150" r="3" fill="#0A4222" />
            <circle cx="200" cy="130" r="3" fill="#0A4222" />

            {/* Top Fabric Button */}
            <ellipse cx="200" cy="101" rx="10" ry="5" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />

            {/* Beautiful golden star and crescent embroidery */}
            <g transform="translate(0, -10)">
              {/* Crescent */}
              <path d="M 214 165 C 196 165, 185 180, 185 195 C 185 212, 201 223, 217 221 C 205 221, 194 212, 194 196 C 194 182, 204 170, 214 165 Z" fill="url(#gold-grad)" filter="url(#shadow)" />
              {/* Star */}
              <polygon points="214,175 218,183 227,184 220,191 222,200 214,195 206,200 208,191 201,184 210,183" fill="url(#gold-grad)" filter="url(#shadow)" />
            </g>

            {/* Rigid Green Brim Visor */}
            <path d="M 130 240 Q 70 258 55 278 Q 85 305 200 305 Q 315 305 345 278 Q 330 258 270 240 Q 200 265 130 240 Z" fill="url(#cap-green)" stroke="#062614" strokeWidth="2.5" />
            {/* Visor stitch details */}
            <path d="M 118 245 Q 78 263 78 275 Q 105 295 200 295 Q 295 295 322 275 Q 322 263 282 245" fill="none" stroke="#167941" strokeWidth="1.5" />
            <path d="M 128 242 Q 88 258 88 270 Q 110 286 200 286 Q 290 286 312 270 Q 312 258 272 242" fill="none" stroke="#167941" strokeWidth="1" />
          </g>
        </svg>
      );

    case "embossed-gold-medal":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Ceremonial Embossed Gold Winner Medal">
          <defs>
            <linearGradient id="stripe-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B1B3D" />
              <stop offset="25%" stopColor="#0B1B3D" />
              <stop offset="25%" stopColor="#F5821F" />
              <stop offset="50%" stopColor="#F5821F" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F5821F" />
              <stop offset="75%" stopColor="#F5821F" />
              <stop offset="75%" stopColor="#0B1B3D" />
              <stop offset="100%" stopColor="#0B1B3D" />
            </linearGradient>
          </defs>
          
          {/* Ribbon */}
          <polygon points="160,20 240,20 255,200 145,200" fill="url(#stripe-ribbon)" stroke="#0B1B3D" strokeWidth="1.5" filter="url(#shadow)" />
          {/* Ribbon metal loop */}
          <rect x="180" y="195" width="40" height="8" rx="2" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
          <circle cx="200" cy="200" r="6" fill="none" stroke="url(#gold-grad)" strokeWidth="3" />

          {/* Heavy Embossed Gold Medal */}
          <g filter="url(#shadow)">
            <circle cx="200" cy="255" r="70" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="3" />
            <circle cx="200" cy="255" r="62" fill="none" stroke="#FFF5D1" strokeWidth="1" strokeDasharray="3 1" />
            <circle cx="200" cy="255" r="54" fill="url(#gold-grad)" stroke="#A0790B" strokeWidth="1.5" />
            
            {/* Laurel wreath embossed along edge */}
            <path d="M 152 255 A 48 48 0 0 0 248 255" fill="none" stroke="#82610A" strokeWidth="4" strokeDasharray="6 8" strokeLinecap="round" opacity="0.6" />
            
            {/* Star with "1st" inside representing Winner Medal */}
            <polygon points="200,215 208,233 227,236 213,249 217,268 200,259 183,268 187,249 173,236 192,233" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1.5" />
            <text x="200" y="285" fill="#523B04" fontSize="20" fontWeight="800" textAnchor="middle" letterSpacing="0.5">1</text>
            <text x="210" y="275" fill="#523B04" fontSize="10" fontWeight="800" textAnchor="middle">st</text>
          </g>
        </svg>
      );

    case "dual-column-glass-award":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Elegant Dual Column Faceted Glass Award">
          <defs>
            <linearGradient id="glass-reflect" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="30%" stopColor="rgba(200,230,255,0.4)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(150,200,255,0.5)" />
            </linearGradient>
            <linearGradient id="glass-tint" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(230,245,255,0.6)" />
              <stop offset="100%" stopColor="rgba(140,200,240,0.8)" />
            </linearGradient>
          </defs>
          
          {/* Base */}
          <g filter="url(#shadow)">
            {/* Black pedestal base */}
            <polygon points="100,320 300,320 310,350 90,350" fill="#071022" stroke="#000" strokeWidth="1.5" />
            <rect x="110" y="295" width="180" height="25" fill="#0B1B3D" stroke="#071022" strokeWidth="1.5" />
            {/* Silver accent liner on base */}
            <line x1="110" y1="300" x2="290" y2="300" stroke="#CBD0DA" strokeWidth="1.5" />
          </g>

          {/* Dual Glass Columns */}
          <g filter="url(#shadow)">
            {/* Left/Shorter Column */}
            <polygon points="135,130 185,100 200,295 150,295" fill="url(#glass-tint)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
            <polygon points="135,130 155,140 165,295 150,295" fill="url(#glass-reflect)" />
            
            {/* Right/Taller Column */}
            <polygon points="200,80 255,110 240,295 185,295" fill="url(#glass-tint)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
            <polygon points="200,80 215,100 210,295 185,295" fill="url(#glass-reflect)" />

            {/* Faceted side cut accents */}
            <line x1="185" y1="100" x2="200" y2="295" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
            <line x1="200" y1="80" x2="185" y2="295" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
            
            {/* Laser etched design of logo inside crystal */}
            <path d="M 185 190 Q 200 215 215 190 Q 200 175 185 190" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeDasharray="2 2" />
            
            {/* Star symbols laser etched */}
            <polygon points="215,140 217,144 222,144 218,147 219,152 215,149 211,152 212,147 208,144 213,144" fill="rgba(255,255,255,0.9)" />
            <polygon points="160,170 162,173 166,173 163,176 164,180 160,178 156,180 157,176 154,173 158,173" fill="rgba(255,255,255,0.9)" />
          </g>

          {/* Inscription label on base */}
          <rect x="145" y="304" width="110" height="12" rx="1" fill="url(#gold-grad)" />
          <line x1="155" y1="310" x2="245" y2="310" stroke="#523B04" strokeWidth="1" />
        </svg>
      );

    case "executive-wristwatch":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Commando 2-Corps Custom Executive Wristwatch">
          <defs>
            <linearGradient id="leather" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A2E33" />
              <stop offset="50%" stopColor="#111315" />
              <stop offset="100%" stopColor="#050607" />
            </linearGradient>
          </defs>
          
          <ellipse cx="200" cy="310" rx="90" ry="15" fill="#0B1B3D" opacity="0.1" />

          {/* Leather Straps */}
          <g filter="url(#shadow)">
            {/* Top Strap */}
            <path d="M 175 160 L 180 50 L 220 50 L 225 160 Z" fill="url(#leather)" stroke="#050607" strokeWidth="1" />
            <path d="M 183 50 L 183 140 M 217 50 L 217 140" fill="none" stroke="#3A3F45" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Bottom Strap */}
            <path d="M 175 240 L 182 350 L 218 350 L 225 240 Z" fill="url(#leather)" stroke="#050607" strokeWidth="1" />
            <path d="M 185 260 L 185 340 M 215 260 L 215 340" fill="none" stroke="#3A3F45" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* Polished Case & Lug Brackets */}
          <g filter="url(#shadow)">
            {/* Steel casing lugs */}
            <path d="M 170 145 L 180 165 L 165 210 L 165 235 L 178 255 M 230 145 L 220 165 L 235 210 L 235 235 L 222 255" fill="none" stroke="url(#silver-grad)" strokeWidth="6" strokeLinecap="round" />
            
            {/* Case Ring */}
            <circle cx="200" cy="200" r="50" fill="url(#silver-grad)" stroke="#808996" strokeWidth="1" />
            <circle cx="200" cy="200" r="44" fill="#0B1B3D" stroke="#071022" strokeWidth="2" />
            
            {/* Outer scale markings */}
            <circle cx="200" cy="200" r="40" fill="none" stroke="#152B57" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="38" fill="none" stroke="#FFF5D1" strokeWidth="1" strokeDasharray="1 10" />

            {/* Dial Details (Custom Printed Logo of Commando 2-Corps) */}
            {/* Orange wing pattern emblem inside */}
            <path d="M 190 190 Q 200 178 210 190 Q 200 210 190 190 Z" fill="#F5821F" opacity="0.8" />
            <polygon points="200,180 203,188 211,188 205,193 207,201 200,196 193,201 195,193 189,188 197,188" fill="#FFF5D1" />
            
            {/* Hour ticks */}
            <rect x="198" y="164" width="4" height="8" fill="#FFE893" />
            <rect x="198" y="228" width="4" height="8" fill="#FFE893" />
            <rect x="164" y="198" width="8" height="4" fill="#FFE893" />
            <rect x="228" y="198" width="8" height="4" fill="#FFE893" />

            {/* Watch Hands */}
            {/* Hour hand */}
            <line x1="200" y1="200" x2="200" y2="182" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            {/* Minute hand */}
            <line x1="200" y1="200" x2="224" y2="192" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            {/* Seconds hand (Orange) */}
            <line x1="200" y1="200" x2="182" y2="218" stroke="#F5821F" strokeWidth="1" />
            <circle cx="200" cy="200" r="3.5" fill="#F5821F" stroke="#FFFFFF" strokeWidth="1" />

            {/* Adjustment crown button on side */}
            <rect x="248" y="192" width="6" height="16" rx="1.5" fill="url(#silver-grad)" stroke="#808996" strokeWidth="1" />
          </g>
        </svg>
      );

    case "led-wooden-clock":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Modern LED-Wooden Digital Table Clock">
          <defs>
            <linearGradient id="ash-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFD2C4" />
              <stop offset="50%" stopColor="#CBBBAA" />
              <stop offset="100%" stopColor="#B5A492" />
            </linearGradient>
            <filter id="led-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <ellipse cx="200" cy="290" rx="130" ry="20" fill="#0B1B3D" opacity="0.1" />

          {/* Triangular Prism Wood Block */}
          <g filter="url(#shadow)">
            {/* Side perspective panel */}
            <polygon points="90,160 120,130 120,250 90,280" fill="#9F8E7D" stroke="#7E6D5D" strokeWidth="1" />
            {/* Front Panel */}
            <polygon points="120,130 310,130 280,250 90,280" fill="url(#ash-wood)" stroke="#9F8E7D" strokeWidth="1.5" />
            
            {/* Fine wood grain lines */}
            <path d="M 125 140 Q 220 135 305 140" fill="none" stroke="#B0A090" strokeWidth="1.5" opacity="0.4" />
            <path d="M 115 170 Q 200 162 295 170" fill="none" stroke="#B0A090" strokeWidth="1" opacity="0.4" />
            <path d="M 100 215 Q 185 208 285 215" fill="none" stroke="#B0A090" strokeWidth="1.2" opacity="0.4" />
            <path d="M 95 255 Q 180 250 282 255" fill="none" stroke="#B0A090" strokeWidth="1.5" opacity="0.4" />
          </g>

          {/* Seamless LED digital time readout (12:00 & 25°C) */}
          <g filter="url(#led-glow)">
            {/* Time: 12:00 */}
            <text x="185" y="210" fill="#FFFFFF" fontSize="48" fontFamily="monospace" fontWeight="bold" letterSpacing="2" textAnchor="middle">12:00</text>
            {/* Temperature: 25°C */}
            <text x="185" y="248" fill="#FCD9B2" fontSize="20" fontFamily="monospace" fontWeight="bold" letterSpacing="1" textAnchor="middle">25°C</text>
          </g>
          
          {/* Engraved corporate logo watermark representation */}
          <text x="250" y="152" fill="#807060" fontSize="8" fontWeight="bold" opacity="0.6">MULTILINE</text>
        </svg>
      );

    case "wooden-desk-clock-award":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Classic Wooden Desk Clock Presentation Award">
          <defs>
            <linearGradient id="piano-walnut" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A1E05" />
              <stop offset="40%" stopColor="#2E1101" />
              <stop offset="100%" stopColor="#150500" />
            </linearGradient>
          </defs>
          
          <ellipse cx="200" cy="340" rx="110" ry="14" fill="#0B1B3D" opacity="0.15" />

          {/* Wooden Body Block */}
          <g filter="url(#shadow)">
            {/* Main wooden board */}
            <rect x="110" y="80" width="180" height="240" rx="10" fill="url(#piano-walnut)" stroke="#150500" strokeWidth="2.5" />
            <rect x="115" y="85" width="170" height="230" rx="6" fill="none" stroke="#7A3912" strokeWidth="1.5" opacity="0.4" />
            
            {/* Side polished metal columns decoration */}
            <rect x="100" y="90" width="10" height="220" rx="2" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
            <rect x="290" y="90" width="10" height="220" rx="2" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
          </g>

          {/* Polished Gold Bezel Clock */}
          <g filter="url(#shadow)">
            <circle cx="200" cy="160" r="44" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="2" />
            <circle cx="200" cy="160" r="38" fill="#FFFFFF" stroke="#82610A" strokeWidth="1" />
            
            {/* Clock hands */}
            <line x1="200" y1="160" x2="200" y2="135" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="200" y1="160" x2="218" y2="160" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            {/* Roman Hour numerals indications */}
            <text x="200" y="132" fill="#111" fontSize="8" fontWeight="bold" textAnchor="middle">XII</text>
            <text x="232" y="163" fill="#111" fontSize="8" fontWeight="bold" textAnchor="middle">III</text>
            <text x="200" y="193" fill="#111" fontSize="8" fontWeight="bold" textAnchor="middle">VI</text>
            <text x="168" y="163" fill="#111" fontSize="8" fontWeight="bold" textAnchor="middle">IX</text>
          </g>

          {/* Inscription Brass Plate below */}
          <g filter="url(#shadow)">
            <rect x="125" y="235" width="150" height="65" rx="3" fill="url(#gold-grad)" stroke="#604604" strokeWidth="1.5" />
            <rect x="129" y="239" width="142" height="57" rx="1.5" fill="none" stroke="#82610A" strokeWidth="0.8" />
            {/* Engraved Line Details */}
            <line x1="140" y1="252" x2="260" y2="252" stroke="#3B1803" strokeWidth="2" strokeLinecap="round" />
            <line x1="150" y1="264" x2="250" y2="264" stroke="#3B1803" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="165" y1="276" x2="235" y2="276" stroke="#3B1803" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "years-of-service-crystal":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Geometric Years of Service Crystal Award">
          <defs>
            <linearGradient id="cobalt-blue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E3C72" />
              <stop offset="100%" stopColor="#0B1B3D" />
            </linearGradient>
          </defs>
          
          <ellipse cx="200" cy="335" rx="100" ry="12" fill="#0B1B3D" opacity="0.1" />

          {/* Blue Crystal Base */}
          <g filter="url(#shadow)">
            <polygon points="120,300 280,300 290,330 110,330" fill="url(#cobalt-blue)" stroke="#0B1B3D" strokeWidth="1.5" />
            <polygon points="120,300 110,330 115,330 125,300" fill="rgba(255,255,255,0.4)" />
          </g>

          {/* Ascending Angular Crystal Columns */}
          <g filter="url(#shadow)">
            {/* Faceted geometric trophy */}
            <polygon points="150,290 135,160 200,60 265,160 250,290" fill="url(#glass-tint)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            
            {/* Front diamond facet planes */}
            <polygon points="150,290 200,200 200,60 135,160" fill="url(#glass-reflect)" opacity="0.6" />
            <polygon points="200,200 250,290 265,160 200,60" fill="url(#glass-reflect)" opacity="0.3" />
            <polygon points="150,290 250,290 200,200" fill="url(#glass-tint)" />

            {/* Reflection facet highlight lines */}
            <line x1="200" y1="60" x2="200" y2="200" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
            <line x1="150" y1="290" x2="200" y2="200" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
            <line x1="250" y1="290" x2="200" y2="200" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />

            {/* Frosted text engraving detail */}
            <text x="200" y="150" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="1">10 YEARS</text>
            <text x="200" y="166" fill="rgba(255,255,255,0.8)" fontSize="8" fontWeight="medium" textAnchor="middle" letterSpacing="0.5">OF SERVICE</text>
            
            <path d="M 190 115 Q 200 128 210 115" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          </g>
        </svg>
      );

    case "commemorative-coin-set":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Commemorative Dual Coin Presentation Set">
          <defs>
            <linearGradient id="cherry-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B2211" />
              <stop offset="50%" stopColor="#4A1108" />
              <stop offset="100%" stopColor="#2D0701" />
            </linearGradient>
          </defs>
          
          <ellipse cx="200" cy="280" rx="140" ry="20" fill="#0B1B3D" opacity="0.15" />

          {/* Opened Cherrywood Box base */}
          <g filter="url(#shadow)">
            {/* Back lid flap (perspective tilted up) */}
            <polygon points="100,160 300,160 310,60 90,60" fill="url(#cherry-wood)" stroke="#2D0701" strokeWidth="2" />
            <polygon points="102,154 298,154 304,66 96,66" fill="#0B1B3D" stroke="#071022" strokeWidth="1" />
            <text x="200" y="115" fill="#F5821F" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="1" opacity="0.7">MULTILINE</text>
            <line x1="160" y1="125" x2="240" y2="125" stroke="#FFF5D1" strokeWidth="1" opacity="0.5" />

            {/* Bottom case body */}
            <polygon points="80,160 320,160 330,260 70,260" fill="url(#cherry-wood)" stroke="#2D0701" strokeWidth="2.5" />
            {/* Velvet foam inserts */}
            <polygon points="90,166 310,166 318,250 82,250" fill="#0B1B3D" stroke="#071022" strokeWidth="1.5" />
            <polygon points="94,170 306,170 312,246 88,246" fill="#071022" />
          </g>

          {/* Two recessed commemorative coins */}
          <g filter="url(#shadow)">
            {/* Coin A: Gold Medal Coin */}
            <circle cx="155" cy="208" r="32" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1.5" />
            <circle cx="155" cy="208" r="28" fill="none" stroke="#FFF5D1" strokeWidth="1" strokeDasharray="3 1" />
            <polygon points="155,193 159,202 168,203 161,210 163,219 155,214 147,219 149,210 142,203 151,202" fill="url(#gold-grad)" stroke="#604604" strokeWidth="0.5" />
            
            {/* Coin B: Silver Medal Coin */}
            <circle cx="245" cy="208" r="32" fill="url(#silver-grad)" stroke="#5A626E" strokeWidth="1.5" />
            <circle cx="245" cy="208" r="28" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 1" />
            <path d="M 235 208 Q 245 220 255 208 Q 245 196 235 208" fill="none" stroke="#4B515A" strokeWidth="1.5" />
          </g>

          {/* Brass hinges detailing on lid joint */}
          <rect x="120" y="156" width="14" height="8" fill="url(#gold-grad)" />
          <rect x="266" y="156" width="14" height="8" fill="url(#gold-grad)" />
        </svg>
      );

    case "butterfly-gold-tray":
      return (
        <svg viewBox="0 0 400 400" className={`w-full h-full bg-slate-50 ${className}`} aria-label="Elegant Gold Butterfly Accented Tray">
          <defs>
            <linearGradient id="chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#EBF0F5" />
              <stop offset="50%" stopColor="#A8B0BE" />
              <stop offset="75%" stopColor="#DFE3EB" />
              <stop offset="100%" stopColor="#8A93A6" />
            </linearGradient>
          </defs>
          
          <ellipse cx="200" cy="290" rx="130" ry="25" fill="#0B1B3D" opacity="0.1" />

          {/* Rectangular Chrome Serving Tray Base */}
          <g filter="url(#shadow)">
            {/* Outer Rim */}
            <rect x="90" y="130" width="220" height="140" rx="12" fill="url(#chrome-grad)" stroke="#8A93A6" strokeWidth="3" />
            
            {/* Hammered interior plate representation */}
            <rect x="104" y="144" width="192" height="112" rx="6" fill="url(#chrome-grad)" stroke="#BDC3C7" strokeWidth="1" />
            
            {/* Subtle hammered textures */}
            <circle cx="120" cy="160" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="140" cy="155" r="3" fill="#FFFFFF" opacity="0.4" />
            <circle cx="180" cy="165" r="2" fill="#FFFFFF" opacity="0.5" />
            <circle cx="220" cy="150" r="3" fill="#FFFFFF" opacity="0.6" />
            <circle cx="260" cy="160" r="2" fill="#FFFFFF" opacity="0.4" />
            <circle cx="130" cy="200" r="2" fill="#FFFFFF" opacity="0.5" />
            <circle cx="200" cy="210" r="3" fill="#FFFFFF" opacity="0.6" />
            <circle cx="270" cy="190" r="2" fill="#FFFFFF" opacity="0.4" />
          </g>

          {/* Intricate Gold Butterfly Handles on Left & Right */}
          <g filter="url(#shadow)">
            {/* Left Handle Butterfly */}
            <g transform="translate(68, 180)">
              {/* Bracket bar */}
              <path d="M 12 -30 C 25 -30, 25 30, 12 30" fill="none" stroke="url(#gold-grad)" strokeWidth="4" strokeLinecap="round" />
              {/* Wings */}
              <ellipse cx="6" cy="-12" rx="10" ry="7" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
              <ellipse cx="8" cy="10" rx="8" ry="6" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
              {/* Antennae */}
              <path d="M 16 -12 Q 22 -20 22 -15" fill="none" stroke="#604604" strokeWidth="1" />
            </g>
            
            {/* Right Handle Butterfly */}
            <g transform="translate(304, 180) scale(-1, 1)">
              {/* Bracket bar */}
              <path d="M 12 -30 C 25 -30, 25 30, 12 30" fill="none" stroke="url(#gold-grad)" strokeWidth="4" strokeLinecap="round" />
              {/* Wings */}
              <ellipse cx="6" cy="-12" rx="10" ry="7" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
              <ellipse cx="8" cy="10" rx="8" ry="6" fill="url(#gold-grad)" stroke="#82610A" strokeWidth="1" />
              {/* Antennae */}
              <path d="M 16 -12 Q 22 -20 22 -15" fill="none" stroke="#604604" strokeWidth="1" />
            </g>
          </g>
        </svg>
      );

    default:
      return (
        <div className={`w-full h-full bg-navy-light text-white flex items-center justify-center p-8 text-center font-semibold rounded-lg ${className}`}>
          {productId.replace(/-/g, " ").toUpperCase()}
        </div>
      );
  }
};
