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
          status: 'Pending'
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
  
    if (!ids) {
      return new Response("Bad Request: Missing order IDs", { status: 400 });
    }
  
    // Convert the ids to an array of integers
    const orderIds = ids.split(',').map(id => parseInt(id, 10));
  
    // Check for any invalid order IDs
    if (orderIds.some(isNaN)) {
      return new Response("Invalid order ID(s)", { status: 400 });
    }
  
    try {
      // Fetch orders with the provided IDs
      const orders = await prisma.order.findMany({
        where: {
          id: {
            in: orderIds,
          },
        },
        include: {
          product: true, // Assuming you have a product relation
        },
      });
  
      return NextResponse.json(orders);
    } catch (error) {
      return new Response("Failed to fetch orders", { status: 500 });
    }
  }


  