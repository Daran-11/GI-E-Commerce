import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get('sortBy'); // Get sorting parameter from the query string

  try {
    // Fetch products from the database
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false, // Filter out deleted products
      },
      select: {
        ProductID: true,
        ProductName: true,
        ProductType: true,
        Amount: true,
        Price: true,
        images: true,
        DateCreated: true, // Assuming you have a created date field
        soldCount: true,
        farmer: {
          select: {
            id: true,
            farmerName: true,

          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: sortBy === 'newest'
        ? { DateCreated: 'desc' }
        : sortBy === 'oldest'
          ? { DateCreated: 'asc' }
          : undefined,
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
        averageRating,
      };
    });

    // Sort by average rating if specified
    if (sortBy === 'highest-review') {
      productsWithRating.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'lowest-review') {
      productsWithRating.sort((a, b) => a.averageRating - b.averageRating);
    }

    return NextResponse.json(productsWithRating, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error); // Log error for debugging
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
