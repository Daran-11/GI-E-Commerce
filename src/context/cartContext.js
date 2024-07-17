"use client"

import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (status === 'authenticated') {
        const response = await fetch('http://localhost:3000/api/auth/cart');
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
          const uniqueItemsCount = new Set(data.map(item => item.productId)).size;
          setCartItemCount(Math.min(uniqueItemsCount, 99)); // Counting unique items not over than 999
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(localCart);
        const uniqueItemsCount = new Set(localCart.map(item => item.productId)).size;
        setCartItemCount(Math.min(uniqueItemsCount, 99)); // Counting unique items
      }
    };

    fetchCartItems();
  }, [status]);

  
  useEffect(() => {
    if (session) {
      syncCartWithServer(session);
    }
  }, [session]);

  const syncCartWithServer = async (session) => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    for (const item of localCart) {
      await fetch('http://localhost:3000/api/auth/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify(item),
      });
    }
    localStorage.removeItem('cart');
  };

 const addItemToCart = (item) => {
  if (status === 'authenticated') {
    // Add item to the server cart
    fetch('http://localhost:3000/api/auth/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    }).then((response) => {
      if (response.ok) {
        setCartItems(prevItems => {
          const updatedItems = Array.isArray(prevItems) ? [...prevItems] : [];
          const existingItem = updatedItems.find(i => i.productId === item.productId);
          if (existingItem) {
            existingItem.quantity += item.quantity; // Update quantity
          } else {
            updatedItems.push(item); // Add new item
          }
          setCartItemCount(updatedItems.length, 99);
          return updatedItems;
        });
        setCartItemCount(prevItems => {
          const updatedItems = Array.isArray(prevItems) ? prevItems : [];
          const uniqueItems = new Set(updatedItems.map(i => i.productId)).size;
          return Math.min(uniqueItems, 1000); // Count unique items
        });
      }
    });
  } else {
    // Add item to the local cart
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = localCart.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity; // Update quantity
    } else {
      localCart.push(item); // Add new item
    }

    localStorage.setItem('cart', JSON.stringify(localCart));
    setCartItems(localCart);
    const uniqueItems = new Set(localCart.map(i => i.productId)).size;
    setCartItemCount(Math.min(uniqueItems, 1000)); // Count unique items
  }
};

  const removeItemFromCart = (productId) => {
    if (status === 'authenticated') {
      // Remove item from the server cart
      fetch('http://localhost:3000/api/auth/cart/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      }).then((response) => {
        if (response.ok) {
          setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
          setCartItemCount(prevCount => prevCount - 1);
        }
      });
    } else {
      // Remove item from the local cart
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = localCart.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setCartItemCount(updatedCart.length);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartItemCount, setCartItems, setCartItemCount, addItemToCart, removeItemFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);