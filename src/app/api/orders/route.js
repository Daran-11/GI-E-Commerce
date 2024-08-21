import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const userId = session.user.id;
      const { productId, quantity, productName, productPrice, addressId } = await request.json();
  
      console.log('Request Data:', { userId, productId, quantity, productName, productPrice, addressId });
  
      // Ensure all necessary fields are provided and are the correct type
      if (!productId || !addressId || quantity == null || !productPrice) {
        console.log('Missing required fields');
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      const order = await prisma.order.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { ProductID: parseInt(productId, 10) } },
          quantity: parseInt(quantity, 10),
          totalPrice: parseFloat(quantity * productPrice),
          address: { connect: { id: parseInt(addressId, 10) } },
        },
      });
  
      return NextResponse.json(order, { status: 200 });
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
  }


  