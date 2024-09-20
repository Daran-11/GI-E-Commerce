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
<<<<<<< HEAD
      ProductID: parseInt(params.ProductID, 10),
    },
    select: {
      ProductID: true,
      ProductName: true,
      ProductType: true,
      Amount: true,
      Price: true,
      Description:true,
      farmer: {
        select: {
          id:true,
          farmerName: true,  // Select specific fields from the Farmer model
          location: true,
          contactLine: true,  // You can include more fields as needed
        },
      },
      reviews: {
        take: 5, // Limit the number of reviews fetched initially
        select: {
          id: true,
          rating: true,
          review: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true, // Fetch the user who wrote the review
            }
          },
        },
      },
=======
      ProductID: parseInt(params.ProductID, 10), // Ensure ProductID is an integer
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
    },
  });

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main>
      <div className="top-container">
<<<<<<< HEAD
        <ProductDetailsClient product={product}
          ProductID = {product.ProductID}
         totalReviewsCount={totalReviewsCount} />
=======
        <ProductDetailsClient product={product} />
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
      </div>
    </main>
  );
}
