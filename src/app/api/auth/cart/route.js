import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { authOptions } from "../[...nextauth]/route";



export async function GET(req) {
  const session = await getServerSession({authOptions});
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
  }



  const userId = session.user.id;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true, // Include product details if needed
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    return NextResponse.json({ message: 'Failed to fetch cart items' }, { status: 500 });
  }
}