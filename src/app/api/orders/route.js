import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

  export async function POST(request) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    const userId = session.user.id;
    const { productId, quantity, productName, productPrice } = await request.json();
    if (!productId || quantity == null || !productPrice) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    try {
      // Get the default address
      const defaultAddress = await prisma.address.findFirst({
        where: {
          userId: userId,
          isDefault: true,
        },           
        include: {
          province: true,
          amphoe: true,
          tambon: true,
        },
      });
  
      if (!defaultAddress) {
        return NextResponse.json({ message: 'Default address not found' }, { status: 404 });
      }
  
      // Prepare the address text
      const addressText = `${defaultAddress.addressLine}, ${defaultAddress.tambon.name_th}, ${defaultAddress.amphoe.name_th}, ${defaultAddress.province.name_th}, ${defaultAddress.postalCode}`;
  
      // Create the order with the address as text
      const order = await prisma.order.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { ProductID: parseInt(productId, 10) } },
          quantity: parseInt(quantity, 10),
          totalPrice: parseFloat(quantity * productPrice),
          addressText: addressText,
        },
      });
  
      return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
      console.error('Failed to create order:', error);
      return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
    }
  }

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  // Check if IDs are provided
  if (!ids) {
    return NextResponse.json({ error: 'No order IDs provided' }, { status: 400 });
  }

  // Convert the IDs string to an array of integers
  const orderIds = ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

  // Check if orderIds array is empty after filtering
  if (orderIds.length === 0) {
    return NextResponse.json({ error: 'Invalid order IDs' }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: {
        product: true,
      },
    });

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Orders not found' }, { status: 404 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


  