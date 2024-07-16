
import QuantityHandler from '@/components/quantityhandler';
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
  const { ProductID } = params;

  const product = await prisma.product.findUnique({
    where: {
      ProductID: parseInt(ProductID, 10), // Ensure ProductID is an integer
    },
  });

  if (!product) {
    return <p>Product not found</p>;
  }



  return (
    <main>
      <div className="top-container">
        <h1>Product ID: {product.ProductID}</h1>
        <p>Product Name: {product.ProductName}</p>
        <p>ราคา: ${product.Price}</p>
        <p>มีสินค้า: {product.Amount}</p>
        <QuantityHandler productAmount={product.Amount} productId={product.ProductID} />
      </div>
    </main>
  );
}