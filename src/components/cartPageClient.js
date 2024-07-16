'use client';

import CartItem from '@/components/cartItem';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function CartPageClient() {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCartItems = async () => {
        if (status === 'authenticated') {
          const response = await fetch('http://localhost:3000/api/auth/cart');
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
          }
        } else {
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          setCartItems(localCart);
        }
        setLoading(false);
      };
  
      fetchCartItems();
    }, [status]);
  
    if (status === 'loading' || loading) {
      return <p>Loading...</p>;
    }
  
    return (
      <div className="top-container">
        <CartItem initialItems={cartItems} session={session} />
      </div>
    );
  }