import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  // Split and convert `id` to an array of integers
  const orderIds = id.split(',').map((orderId) => parseInt(orderId, 10));

  // Validate that all elements are valid numbers
  if (orderIds.some(isNaN)) {
    console.error('Invalid order IDs:', orderIds); // Add this for debugging
    return NextResponse.json({ error: 'Invalid order IDs' }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: {
        farmer: true,
        orderItems: {
          include: {
            product: true,
            farmer: true,
          },
        },
      },
    });

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Orders not found' }, { status: 404 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
