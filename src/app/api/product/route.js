import { NextResponse } from 'next/server';
import { mockProducts } from "../../../../lib/mockData";
import prisma from "../../../../lib/prisma";

export const dynamic = 'force-dynamic';

// Helper to compute average rating
const calcAvgRating = (reviews) => {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length;
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get('sortBy');

  // ---- Mock fallback ----
  if (process.env.USE_MOCK_DATA === 'true') {
    let products = mockProducts.map((product) => ({
      ...product,
      averageRating: calcAvgRating(product.reviews),
    }));

    if (sortBy === 'newest') {
      products.sort((a, b) => new Date(b.HarvestedAt) - new Date(a.HarvestedAt));
    } else if (sortBy === 'oldest') {
      products.sort((a, b) => new Date(a.HarvestedAt) - new Date(b.HarvestedAt));
    } else if (sortBy === 'highest-review') {
      products.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'lowest-review') {
      products.sort((a, b) => a.averageRating - b.averageRating);
    }

    return NextResponse.json(products, { status: 200 });
  }
  // ---- End mock fallback ----

  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      select: {
        ProductID: true,
        ProductName: true,
        ProductType: true,
        Amount: true,
        Price: true,
        images: true,
        DateCreated: true,
        soldCount: true,
        farmer: {
          select: {
            id: true,
            farmerName: true,
          },
        },
        certificates: {
          include: {
            certificate: {
              select: {
                id: true,
                standards: true,
              },
            },
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: sortBy === 'newest'
        ? { DateCreated: 'desc' }
        : sortBy === 'oldest'
          ? { DateCreated: 'asc' }
          : undefined,
    });

    const productsWithRating = products.map((product) => ({
      ...product,
      averageRating: calcAvgRating(product.reviews),
    }));

    if (sortBy === 'highest-review') {
      productsWithRating.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'lowest-review') {
      productsWithRating.sort((a, b) => a.averageRating - b.averageRating);
    }

    return NextResponse.json(productsWithRating, { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}