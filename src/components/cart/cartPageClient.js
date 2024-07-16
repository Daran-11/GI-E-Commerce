'use client';

import CartItem from '@/components/cart/cartItem';
import { useCart } from '@/context/cartContext';
import { useSession } from 'next-auth/react';

export default function CartPageClient() {
  const { data: session, status } = useSession();
  const { cartItems } = useCart();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  
    return (
      <div className="top-container">
        <CartItem initialItems={cartItems} session={session} />
      </div>
    );
  }