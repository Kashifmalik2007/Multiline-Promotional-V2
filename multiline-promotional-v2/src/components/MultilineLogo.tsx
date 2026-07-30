import React from "react";
import logoImg from "../assets/logo/logo.png";

interface MultilineLogoProps {
  className?: string;
  size?: number;
}

export const MultilineLogo: React.FC<MultilineLogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div
      className={`${className} transition-all duration-300 inline-block`}
      style={{
        width: `${size}px`,
        height: `${size * 1.95}px`,
      }}
    >
      <img
        src={logoImg}
        alt="Multiline Promotional Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};