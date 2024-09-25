import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  // Convert id to an integer
  const orderId = parseInt(id, 10);

  // Check if orderId is a valid number
  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        farmer: true,
        orderItems: {
          include: {
            product: true,
            farmer: true,
          }

        }
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

