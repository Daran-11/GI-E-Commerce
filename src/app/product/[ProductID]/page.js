import ProductDetailsClient from '@/components/productDetails/productDetailsClient';
import prisma from '../../../../lib/prisma';
import { getMockProduct, getMockProductParams } from '../../../../lib/mockData';

export const revalidate = 30

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: {
        ProductID: true,
      },
    });

    return products.map((Product) => ({
      ProductID: Product.ProductID.toString(),
    }));
  } catch (error) {
    console.log('Database unavailable during build, using mock data');
    return getMockProductParams();
  }
}

export default async function ProductDetails({ params }) {
  let product = null;
  let totalReviewsCount = 0;

  try {
    product = await prisma.product.findUnique({
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
        Details:true,
        images: true,
        HarvestedAt: true,
        certificates: {
          include: {
            certificate: {
              select: {
                id: true,
                standards: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        farmer: {
          select: {
            id:true,
            farmerName: true,
            province: true,
            contactLine: true,
          },
        },
        reviews: {
          take: 5,
          select: {
            id: true,
            rating: true,
            review: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              }
            },
          },
        },
      },
    });

    if (product) {
      totalReviewsCount = await prisma.ratingReview.count({
        where: {
          productId:  parseInt(params.ProductID, 10),
        },
      });
    }
  } catch (error) {
    console.error('Database error, attempting to use mock data:', error);
    product = getMockProduct(parseInt(params.ProductID, 10));
    if (product) {
      totalReviewsCount = product.reviews.length;
    }
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div >
      <ProductDetailsClient product={product}
        ProductID = {product.ProductID}
       totalReviewsCount={totalReviewsCount} />
    </div>
  );
}
