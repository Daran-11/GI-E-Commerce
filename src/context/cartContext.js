"use client";
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { mockProducts } from "../../lib/mockData";

const CartContext = createContext();

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// ---- Mock cart store (in-memory, resets on page refresh) ----
let mockCart = [];

const mockCartActions = {
  getCart: () => mockCart,

  addItem: (item) => {
    const existing = mockCart.find(i => i.productId === item.productId);
    const product = mockProducts.find(p => p.ProductID === item.productId);
    const maxAmount = product?.Amount ?? Infinity;

    if (existing) {
      const newQty = existing.quantity + item.quantity;
      if (newQty <= maxAmount) existing.quantity = newQty;
    } else {
      mockCart.push({ ...item });
    }
    return [...mockCart];
  },

  removeItem: (productId) => {
    mockCart = mockCart.filter(i => i.productId !== productId);
    return [...mockCart];
  },

  updateQuantity: (productId, newQuantity) => {
    const item = mockCart.find(i => i.productId === productId);
    const product = mockProducts.find(p => p.ProductID === productId);
    const maxAmount = product?.Amount ?? Infinity;

    if (item && newQuantity <= maxAmount) item.quantity = newQuantity;
    return [...mockCart];
  },
};
// ---- End mock cart store ----

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCount = (items) => {
    const unique = new Set(items.map(i => i.productId)).size;
    setCartItemCount(Math.min(unique, 99));
  };

  let isFetching = false;
  const fetchCartItems = async () => {
    if (isFetching) return;
    isFetching = true;

    try {
      // Mock fallback — no DB, no login needed
      if (USE_MOCK) {
        const items = mockCartActions.getCart();
        setCartItems(items);
        updateCount(items);
        return;
      }

      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/auth/cart', {
            headers: { 'Cache-Control': 'max-age=120' },
          });
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
            updateCount(data);
          }
        } catch {
          // DB unreachable — fall back to localStorage
          console.warn('Cart API unavailable, falling back to localStorage');
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          setCartItems(localCart);
          updateCount(localCart);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(localCart);
        updateCount(localCart);
      }
    } finally {
      isFetching = false;
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (!USE_MOCK) syncCartWithServer(session);
      fetchCartItems();
    }
    if (status === 'unauthenticated' && !session) {
      fetchCartItems();
    }
  }, [status]);

  const syncCartWithServer = async (session) => {
    if (USE_MOCK) return;
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!localCart.length) return;

    for (const item of localCart) {
      try {
        await fetch('/api/auth/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch (error) {
        console.error(`Failed to sync item ${item.productId}:`, error);
      }
    }

    localStorage.removeItem('cart');

    if (status === 'authenticated' && session) {
      try {
        const response = await fetch('/api/auth/cart', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
          updateCount(data);
        }
      } catch {
        console.warn('Sync fetch failed, keeping local state');
      }
    }
  };

  const addItemToCart = async (item) => {
    // Mock fallback
    if (USE_MOCK) {
      const updated = mockCartActions.addItem(item);
      setCartItems(updated);
      updateCount(updated);
      return;
    }

    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/auth/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          setCartItems(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(i => i.productId === item.productId);
            if (idx !== -1) {
              const newQty = updated[idx].quantity + item.quantity;
              if (newQty <= updated[idx].productAmount)
                updated[idx] = { ...updated[idx], quantity: newQty };
            } else {
              updated.push(item);
            }
            updateCount(updated);
            return updated;
          });
        }
      } catch {
        // DB down — fall back to localStorage
        console.warn('Add to cart API failed, using localStorage');
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = localCart.find(i => i.productId === item.productId);
        if (existing) {
          const newQty = existing.quantity + item.quantity;
          if (newQty <= item.productAmount) existing.quantity = newQty;
        } else {
          localCart.push(item);
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCartItems(localCart);
        updateCount(localCart);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = localCart.find(i => i.productId === item.productId);
      if (existing) {
        const newQty = existing.quantity + item.quantity;
        if (newQty <= item.productAmount) existing.quantity = newQty;
      } else {
        localCart.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(localCart));
      setCartItems(localCart);
      updateCount(localCart);
    }
  };

  const removeItemFromCart = (productId) => {
    // Mock fallback
    if (USE_MOCK) {
      const updated = mockCartActions.removeItem(productId);
      setCartItems(updated);
      updateCount(updated);
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/auth/cart/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
        .then(response => {
          if (response.ok) {
            setCartItems(prev => {
              const updated = prev.filter(i => i.productId !== productId);
              updateCount(updated);
              return updated;
            });
          }
        })
        .catch(() => {
          // DB down — remove from localStorage
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          const updated = localCart.filter(i => i.productId !== productId);
          localStorage.setItem('cart', JSON.stringify(updated));
          setCartItems(updated);
          updateCount(updated);
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updated = localCart.filter(i => i.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(updated));
      setCartItems(updated);
      updateCount(updated);
    }
  };

  const updateItemQuantity = (productId, newQuantity) => {
    // Mock fallback
    if (USE_MOCK) {
      const updated = mockCartActions.updateQuantity(productId, newQuantity);
      setCartItems(updated);
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/auth/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      })
        .then(response => {
          if (response.ok) {
            setCartItems(prev =>
              prev.map(i => i.productId === productId ? { ...i, quantity: newQuantity } : i)
            );
          }
        })
        .catch(() => {
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          const item = localCart.find(i => i.productId === productId);
          if (item && newQuantity <= item.productAmount) {
            const updated = localCart.map(i =>
              i.productId === productId ? { ...i, quantity: newQuantity } : i
            );
            localStorage.setItem('cart', JSON.stringify(updated));
            setCartItems(updated);
          }
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = localCart.find(i => i.productId === productId);
      if (item && newQuantity <= item.productAmount) {
        const updated = localCart.map(i =>
          i.productId === productId ? { ...i, quantity: newQuantity } : i
        );
        localStorage.setItem('cart', JSON.stringify(updated));
        setCartItems(updated);
      }
    }
  };

  const clearCartItems = async (productId) => {
    if (USE_MOCK) {
      const updated = mockCartActions.removeItem(productId);
      setCartItems(updated);
      updateCount(updated);
      return;
    }

    try {
      const response = await fetch('/api/auth/cart/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) await fetchCartItems();
    } catch {
      removeItemFromCart(productId);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartItemCount,
      setCartItems, setCartItemCount,
      addItemToCart, removeItemFromCart,
      updateItemQuantity, clearCartItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);