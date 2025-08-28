// src/components/CartIcon.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getCart } from '../services/cartService';

interface CartIconProps {
  className?: string;
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ className, onClick }) => {
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const cart = await getCart();
      // Calculer le nombre total d'articles dans le panier
      const count = cart.items.reduce((total, item) => total + item.quantity, 0);
      setItemsCount(count);
      setError(false);
    } catch (err) {
      console.error("Erreur lors de la récupération du panier:", err);
      setError(true);
      setItemsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
    
    // Écouter l'événement personnalisé pour les mises à jour du panier
    const handleCartUpdate = () => {
      fetchCartData();
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    
    // Mettre à jour le panier toutes les 30 secondes (comme fallback)
    const interval = setInterval(fetchCartData, 30000);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`relative ${className || ''}`}>
      <button 
        className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        onClick={onClick}
        aria-label="Panier"
      >
        <ShoppingCart size={20} className="text-gray-600" />
        {!loading && !error && itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {itemsCount > 99 ? '99+' : itemsCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default CartIcon;