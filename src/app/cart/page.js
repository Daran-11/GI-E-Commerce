import dynamic from 'next/dynamic';

const CartPageClient = dynamic(() => import('@/components/cart/cartPageClient'), {
  ssr: false,
});

export default function CartPage() {
  return <CartPageClient />;
}