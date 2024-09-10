import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { authOptions } from '../../[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession({ authOptions });

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { productId, quantity } = await request.json();
  const userEmail = session.user.email;

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Add or update cart item
  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: productId,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      userId: user.id,
      productId: productId,
      quantity: quantity,
    },
  });

  return NextResponse.json(cartItem);
}