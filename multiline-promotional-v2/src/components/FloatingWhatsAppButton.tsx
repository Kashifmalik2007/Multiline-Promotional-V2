import React from "react";
import { CONTACT_INFO } from "../data/contact";

export const FloatingWhatsAppButton: React.FC = () => {
  const phoneNumber = CONTACT_INFO.phones[0].value.replace("+", "");
  const message = "Hello Multiline Promotional! I am interested in placing a bulk inquiry for custom corporate giveaways. Please share catalogs and details.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-[#25D366]/40 flex items-center justify-center group"
      aria-label="Contact Multiline Promotional on WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-current drop-shadow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.01-5.05-2.85-6.893-1.84-1.842-4.29-2.856-6.896-2.858-5.437 0-9.863 4.371-9.867 9.743-.001 1.73.457 3.418 1.328 4.937l-.988 3.613 3.712-.96zm11.367-7.614c-.301-.15-1.78-.877-2.056-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.651.075-.301-.15-1.272-.468-2.422-1.494-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.018-.462.13-.61.135-.133.301-.35.451-.524.15-.174.2-.3.301-.5.1-.2.05-.375-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.588-.493-.508-.675-.518-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.374-.275.3-.1.775-.1 1.624 0 1.7 1.25 3.342 1.425 3.57.175.225 2.458 3.754 5.954 5.26.832.358 1.48.572 1.986.733.837.266 1.6.228 2.202.139.672-.1 1.78-.727 2.03-1.428.25-.7.25-1.3.175-1.428-.075-.125-.275-.2-.575-.35z" />
      </svg>
      
      {/* Dynamic hover bubble label */}
      <span className="absolute right-16 bg-navy text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap border border-navy-light">
        Chat with Malik Kamran (CEO)
      </span>
    </a>
  );
};
