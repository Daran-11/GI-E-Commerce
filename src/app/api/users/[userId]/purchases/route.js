import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(req, { params }) {
    const session = await getServerSession({ req, ...authOptions });
    const { searchParams } = new URL(req.url); // Fetch query parameters
    const statusFilter = searchParams.get('status'); // Get the status from the query params
    const page = parseInt(searchParams.get('page'), 10) || 1; // Get current page, default to 1
    const limit = parseInt(searchParams.get('limit'), 10) || 10; // Get items per page, default to 10

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const userId = parseInt(params.userId, 10);
  
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
  
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    try {
      const [purchases, totalCount] = await Promise.all([
        prisma.order.findMany({
          where: {
            userId: userId,
            ...(statusFilter && { deliveryStatus: statusFilter }), // Add filter if status is provided
          },
          orderBy: { createdAt: 'desc' },
          include: {   
            farmer:true,     
            orderItems: {
              include: {
                product: true,  // Include product details for each order item
                farmer: true,   // Include farmer details for each order item
              },
            }, 
          },
          skip: (page - 1) * limit, // Pagination offset
          take: limit,             // Pagination limit
        }),
        prisma.order.count({
          where: {
            userId: userId,
            ...(statusFilter && { deliveryStatus: statusFilter }), // Add filter if status is provided
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        purchases,
        totalPages,
      });
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
