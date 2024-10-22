import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../lib/prisma';

export async function GET(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });
  const { searchParams } = new URL(request.url); // Fetch query parameters

  // Debugging session
  console.log('Session:', session); 
  console.log('User ID:', session?.user?.id); 

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId } = params;

  try {
    // Fetch the order with user check
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId), // This is the ID from the 'Order' table
      },
      include: {
        farmer:true, 
        delivery: {
          include: {
            deliveryService: true,
          },
        }, 
        orderItems: {
          include: {
            product: true,
            farmer: true,
          },
        },
      },
    });

    console.log('Order:', order);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
