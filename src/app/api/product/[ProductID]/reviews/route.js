import { NextResponse } from 'next/server';
import { getMockProduct } from '../../../../../../lib/mockData';
import prisma from '../../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { ProductID } = params;
  const take = parseInt(request.nextUrl.searchParams.get('take') || '5', 10);
  const lastReviewId = request.nextUrl.searchParams.get('lastReviewId');
  const lastReviewIdNumber = lastReviewId ? parseInt(lastReviewId, 10) : undefined;

  if (!ProductID) {
    return NextResponse.json({ error: 'ProductID is required' }, { status: 400 });
  }

  // ---- Mock fallback ----
  if (process.env.USE_MOCK_DATA === 'true') {
    const mockProduct = getMockProduct(parseInt(ProductID, 10));

    if (!mockProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const allReviews = mockProduct.reviews;
    const startIndex = lastReviewIdNumber
      ? allReviews.findIndex((r) => r.id === lastReviewIdNumber) + 1
      : 0;

    const reviewSlice = allReviews.slice(startIndex, startIndex + take);
    const totalReviewsCount = allReviews.length;
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    return NextResponse.json({
      reviews: reviewSlice,
      totalReviewsCount,
      avgRating: parseFloat(avgRating.toFixed(1)),
    }, { status: 200 });
  }
  // ---- End mock fallback ----

  try {
    const product = await prisma.product.findUnique({
      where: { ProductID: parseInt(ProductID, 10) },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const reviews = await prisma.ratingReview.findMany({
      where: { productId: parseInt(ProductID, 10) },
      take: take + 1,
      skip: lastReviewIdNumber ? 1 : 0,
      cursor: lastReviewIdNumber ? { id: lastReviewIdNumber } : undefined,
      orderBy: { createdAt: 'asc' },
      include: { user: true },
    });

    const avgRating = await prisma.ratingReview.aggregate({
      where: { productId: parseInt(ProductID, 10) },
      _avg: { rating: true },
    });

    const hasMoreReviews = reviews.length > take;
    const reviewList = hasMoreReviews ? reviews.slice(0, take) : reviews;

    const totalReviewsCount = await prisma.ratingReview.count({
      where: { productId: parseInt(ProductID, 10) },
    });

    return NextResponse.json({
      reviews: reviewList,
      totalReviewsCount,
      avgRating: avgRating._avg.rating || 0,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}