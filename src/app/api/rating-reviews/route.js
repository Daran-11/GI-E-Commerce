import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
    try {
      const { userId, productId, orderId, rating, review } = await request.json();
  
      console.log("userId:", userId);
      console.log("productId:", productId);
      console.log("orderId:", orderId);
      console.log("rating:", rating);
  
      // Validate input
      if (!userId  || !orderId || !rating) {
        return NextResponse.json(
          { error: 'User ID, Product ID, Order ID, and rating are required' },
          { status: 400 }
        );
      }
  
      // Check if a review already exists for this user and order
      const existingReview = await prisma.ratingReview.findUnique({
        where: {
          userId_orderId: {
            userId,
            orderId: parseInt(orderId),
          },
        },
      });
  
      if (existingReview) {
        return NextResponse.json(
          { error: 'You have already reviewed this order.' },
          { status: 400 }
        );
      }
  
      // Create the rating and review
      const ratingReview = await prisma.ratingReview.create({
        data: {
          userId,
          productId,
          orderId: parseInt(orderId),
          rating,
          review,
        },
      });
  
      return NextResponse.json({ success: true, ratingReview });
    } catch (error) {
      console.error('Error saving rating and review:', error);
      return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
  }

export async function GET(request, { params }) {
    const { userId } = params;
  
    try {
      // Fetch reviews from the database where the userId matches the provided userId
      const reviews = await prisma.ratingReview.findMany({
        where: {
          userId: userId,
        },
        include: {
          product: true, // Include product information if needed
        },
      });
  
      // Return the reviews as a response
      return NextResponse.json({ success: true, reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
    }
  }