import { NextResponse } from 'next/server';
import prisma from '../../../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { userId, orderId } = params;

  if (!userId || !orderId) {
    return NextResponse.json(
      { error: 'User ID and Order ID are required' },
      { status: 400 }
    );
  }

  try {
    // Fetch all reviews for this order by user
    const reviews = await prisma.ratingReview.findMany({
      where: {
        userId: parseInt(userId),
        orderId: parseInt(orderId),
      },
      select: {
        productId: true, // Only get product IDs with reviews
      },
    });

    // Map reviews to productId keys
    const reviewedProductIds = reviews.map((review) => review.productId);

    return NextResponse.json({ success: true, reviewedProductIds });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
