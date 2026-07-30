import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, QuoteItem } from "../types";

interface QuoteListContextType {
  items: QuoteItem[];
  addToQuoteList: (product: Product, quantity: number, customizationNotes?: string) => void;
  removeFromQuoteList: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateQuoteItem: (productId: string, quantity: number, customizationNotes?: string) => void;
  clearQuoteList: () => void;
  isItemInQuoteList: (productId: string) => boolean;
  totalItemsCount: number;
}

const QuoteListContext = createContext<QuoteListContextType | undefined>(undefined);

export const QuoteListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem("multiline_quote_list");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("multiline_quote_list", JSON.stringify(items));
  }, [items]);

  const addToQuoteList = (product: Product, quantity: number, customizationNotes?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.max(product.minOrder, quantity), customizationNotes }
            : item
        );
      }
      return [...prev, { product, quantity: Math.max(product.minOrder, quantity), customizationNotes }];
    });
  };

  const removeFromQuoteList = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(item.product.minOrder, quantity) }
          : item
      )
    );
  };

  // Update both quantity and per-item customization notes in one call.
  // QuoteRequestPage relies on this signature; without it the "update quote item" UI silently failed.
  const updateQuoteItem = (productId: string, quantity: number, customizationNotes?: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.max(item.product.minOrder, quantity),
              customizationNotes: customizationNotes !== undefined ? customizationNotes : item.customizationNotes,
            }
          : item
      )
    );
  };

  const clearQuoteList = () => {
    setItems([]);
  };

  const isItemInQuoteList = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <QuoteListContext.Provider
      value={{
        items,
        addToQuoteList,
        removeFromQuoteList,
        updateQuantity,
        updateQuoteItem,
        clearQuoteList,
        isItemInQuoteList,
        totalItemsCount,
      }}
    >
      {children}
    </QuoteListContext.Provider>
  );
};

export const useQuoteList = () => {
  const context = useContext(QuoteListContext);
  if (!context) {
    throw new Error("useQuoteList must be used within a QuoteListProvider");
  }
  return context;
};
