// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart } from '../services/cartService';

type CartContextType = {
  itemsCount: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  itemsCount: 0,
  refreshCart: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itemsCount, setItemsCount] = useState(0);

  const refreshCart = async () => {
    try {
      const cart = await getCart();
      const count = cart.items.reduce((total, item) => total + item.quantity, 0);
      setItemsCount(count);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      setItemsCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
    
    // Rafraîchir le panier toutes les 30 secondes
    const interval = setInterval(refreshCart, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CartContext.Provider value={{ itemsCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};