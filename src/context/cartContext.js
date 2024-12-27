"use client";
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  let isFetching = false;
    const fetchCartItems = async () => {
      if (isFetching) return; // หากกำลัง fetch อยู่แล้ว ให้หยุดทำงาน
      isFetching = true;
      try {
      if (status === 'authenticated' ) {
        console.log("authenticated fetching cart")
        const response = await fetch('/api/auth/cart', {
          headers: {
            'Cache-Control': 'max-age=120',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);         
          const uniqueItemsCount = new Set(data.map(item => item.productId)).size;
          setCartItemCount(Math.min(uniqueItemsCount, 99));
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(localCart);
        const uniqueItemsCount = new Set(localCart.map(item => item.productId)).size;
        setCartItemCount(Math.min(uniqueItemsCount, 99));
      }
      } finally {
        isFetching = false;
      }
    };

    const clearCartItems = async (productId) => {
      const response = await fetch('/api/auth/cart/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        await fetchCartItems(); // Refresh cart after deletion
      }
    };


  useEffect(() => {
    if (status ==='authenticated' && session) {
      syncCartWithServer(session);
      fetchCartItems();
    } 
    if (status ==='unauthenticated' && !session) {
      fetchCartItems();
    }

  }, [status]);

  // ใส่ตัวเช็คว่าจำนวนจะเกินไหมใน syncCartwithServer
  const syncCartWithServer = async (session) => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Local Cart before sync:", localCart);
    if (!localCart.length) return; // ถ้าไม่มีสินค้าก็ไม่ต้องซิงค์
    for (const item of localCart) {
      try {
        console.log(`Syncing productId: ${item.productId}, quantity: ${item.quantity}`);
        await fetch('/api/auth/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });
      } catch (error) {
        console.error(`Failed to sync item with productId: ${item.productId}`, error);
      }
    }

    localStorage.removeItem('cart');

    // Fetch updated cart items from server
    if (status === 'authenticated' && session) {
      const response = await fetch('/api/auth/cart', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Cart data from server after sync:", data);
        setCartItems(data); // Update state with server data
        console.log("synced with server finished, cartItems:",cartItems);
        const uniqueItemsCount = new Set(data.map(item => item.productId)).size;
        setCartItemCount(Math.min(uniqueItemsCount, 99)); // Update count
      }
    }
  };

  const addItemToCart = async (item) => {

    if (status === 'authenticated') {
      const response = await fetch('/api/auth/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        console.error('Failed to add item to cart on server:', await response.text());
        return;
      }


      if (response.ok) {
        setCartItems(prevItems => {
          const updatedItems = [...prevItems];
          const existingItemIndex = updatedItems.findIndex(i => i.productId === item.productId);

          if (existingItemIndex !== -1) {
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + item.quantity;

            if (newQuantity <= existingItem.productAmount) {
              updatedItems[existingItemIndex] = { ...existingItem, quantity: newQuantity };
            }
          } else {
            updatedItems.push(item);
          }

          const uniqueItems = new Set(updatedItems.map(i => i.productId)).size;
          setCartItemCount(Math.min(uniqueItems, 99));
          return updatedItems;
        });
      }
      if (status === 'authenticated') {
        syncCartWithServer(session);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = localCart.find(i => i.productId === item.productId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;

        if (newQuantity <= item.productAmount) {
          existingItem.quantity = newQuantity;
          console.log("existing item updated");
        }
      } else {
        localCart.push(item); // Add new item
      }

      localStorage.setItem('cart', JSON.stringify(localCart));
      setCartItems(localCart);
      const uniqueItems = new Set(localCart.map(i => i.productId)).size;
      setCartItemCount(Math.min(uniqueItems, 99));
    }
  };

  const removeItemFromCart = (productId) => {
    if (status === 'authenticated') {
      console.log("authenticated for item cart deletion");
      fetch('/api/auth/cart/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      }).then((response) => {
        if (response.ok) {
          localStorage.removeItem('cart');
          setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
          setCartItemCount(prevCount => prevCount - 1);
        }
      });
    } else {
      console.log("delete cart items without login");
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = localCart.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setCartItemCount(updatedCart.length);
    }
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (status === 'authenticated') {
      fetch('/api/auth/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      }).then((response) => {
        if (response.ok) {
          console.log('set new cart update')
          setCartItems(prevItems => {
            return prevItems.map(item =>
              item.productId === productId ? { ...item, quantity: newQuantity } : item
            );
          });
        }
      });
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = localCart.find(i => i.productId === productId);

      if (item && newQuantity <= item.productAmount) {
        const updatedCart = localCart.map(i =>
          i.productId === productId ? { ...i, quantity: newQuantity } : i
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartItemCount, setCartItems, setCartItemCount, addItemToCart, removeItemFromCart, updateItemQuantity, clearCartItems  }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);