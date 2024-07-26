import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
    const { orderId } = params;
  
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: {
          product: true,
          address: true,
        },
      });
  
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
  
      return NextResponse.json(order, { status: 200 });
    } catch (error) {
      console.error('Error fetching order details:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }