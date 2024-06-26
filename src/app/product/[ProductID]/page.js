import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const revalidate = 60

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    
    select: {
      ProductID: true,
    },
  });

  return products.map((product) => ({
    ProductID: product.ProductID.toString(),
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
        <p>Price: ${product.Price}</p>
        {/* Other product details */}
      </div>
    </main>
  );
}