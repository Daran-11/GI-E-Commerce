import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";
//endpoint สำหรับ display สับปะรดในหน้าหลัก
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false, // Fetch only products where isDeleted is false
      },
      select: {
        ProductID: true,
        ProductName: true,
        ProductType: true,
        Amount: true,
        Price: true,
        images: true,
        farmer: {
          select: {
            farmerName: true,  // Select specific fields from the Farmer model
            location: true,
          },
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
    });

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const totalRatings = product.reviews.length;
      const averageRating =
        totalRatings > 0
          ? product.reviews.reduce((sum, { rating }) => sum + rating, 0) / totalRatings
          : 0;

      return {
        ...product,
        averageRating // Include the average rating in the product data
      };
    });


    return NextResponse.json(productsWithRating, { status: 200 });
  } catch (error) {
    return  NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}