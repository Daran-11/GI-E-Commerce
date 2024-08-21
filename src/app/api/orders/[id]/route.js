import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        product: true,
        address: {
          include: {
            province: true,
            amphoe: true,
            tambon: true,
          },
        },
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