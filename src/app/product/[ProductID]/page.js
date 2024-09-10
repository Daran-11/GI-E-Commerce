import ProductDetailsClient from '@/components/productDetails/productDetailsClient';
import prisma from '../../../../lib/prisma';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: {
      ProductID: true,
    },
  });

  return products.map((Product) => ({
    ProductID: Product.ProductID.toString(),
  }));
}

export default async function ProductDetails({ params }) {
  const product = await prisma.product.findUnique({
    where: {
      ProductID: parseInt(params.ProductID, 10), // Ensure ProductID is an integer
    },
  });

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main>
      <div className="top-container">
        <ProductDetailsClient product={product} />
      </div>
    </main>
  );
}
