import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlistItems: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("nova_wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        }
      } catch (error) {
        console.error("Error al cargar la Wishlist desde LocalStorage:", error);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("nova_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  const toggleFavorite = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.find(
        (item) => String(item.id) === String(product.id),
      );
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(product.id));
      }
      return [...prev, product];
    });
  };
  const isFavorite = (id: string) => {
    return wishlistItems.some((item) => String(item.id) === String(id));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, toggleFavorite, isFavorite }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist debe ser usado dentro de un WishlistProvider");
  }
  return context;
};
