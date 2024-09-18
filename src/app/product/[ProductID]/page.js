import ProductDetailsClient from '@/components/productDetails/productDetailsClient';
import prisma from '../../../../lib/prisma';

export const revalidate = 30

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
      ProductID: parseInt(params.ProductID, 10),
    },
    select: {
      ProductID: true,
      ProductName: true,
      ProductType: true,
      Amount: true,
      Price: true,
      Description:true,
      imageUrl: true,
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
    },
  });

  if (!product) {
    return <p>Product not found</p>;
  }

    // Count the total number of reviews (for load more functionality)
    const totalReviewsCount = await prisma.ratingReview.count({
      where: {
        productId:  parseInt(params.ProductID, 10),
      },
    });

  return (
    <main>
      <div className="top-container">
        <ProductDetailsClient product={product}
          ProductID = {product.ProductID}
         totalReviewsCount={totalReviewsCount} />
      </div>
    </main>
  );
}
