import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request) {
  const url = new URL(request.url);
  const ids = url.searchParams.get('ids');
  
  if (!ids) {
    return NextResponse.json({ error: 'No order IDs provided' }, { status: 400 });
  }

  try {
    const orderIds = ids.split(',').map(id => parseInt(id, 10));
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: { totalPrice: true },
    });

    const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    return NextResponse.json({ totalAmount });
  } catch (error) {
    console.error('Error fetching total amount:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
