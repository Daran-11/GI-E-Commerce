import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { ProductID } = params;
  const take = parseInt(request.nextUrl.searchParams.get('take') || '5', 10); // Default to 5 if not provided
  const lastReviewId = request.nextUrl.searchParams.get('lastReviewId'); // Use query parameters for pagination

  const lastReviewIdNumber = lastReviewId ? parseInt(lastReviewId, 10) : undefined;

  if (!ProductID) {
    return NextResponse.json({ error: 'ProductID is required' }, { status: 400 });
  }

  try {
    // Fetch reviews with pagination
    const reviews = await prisma.ratingReview.findMany({
      where: {
        productId: parseInt(ProductID, 10),
      },
      take: take + 1, // Fetch one extra review to determine if there are more reviews
      skip: lastReviewIdNumber ? 1 : 0, // Skip the last review if lastReviewId is provided
      cursor: lastReviewIdNumber ? { id: lastReviewIdNumber } : undefined, // Use cursor for pagination
      orderBy: { createdAt: 'asc' }, // Ensure reviews are ordered correctly
      include: {
        user: true, // Include user details if needed
      },
    });

    // Determine if there are more reviews to load
    const hasMoreReviews = reviews.length > take;
    const reviewList = hasMoreReviews ? reviews.slice(0, take) : reviews;

    // Return the reviews and the total count
    const totalReviewsCount = await prisma.ratingReview.count({
      where: { productId: parseInt(ProductID, 10) },
    });



    return NextResponse.json({ reviews: reviewList, totalReviewsCount }, { status: 200 });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
