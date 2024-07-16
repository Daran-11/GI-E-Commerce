import dynamic from 'next/dynamic';

const CartPageClient = dynamic(() => import('@/components/cartPageClient'), {
  ssr: false,
});

export default function CartPage() {
  return <CartPageClient />;
}