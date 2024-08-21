import { getServerSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the latest order for the user
    const order = await prisma.order.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
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
