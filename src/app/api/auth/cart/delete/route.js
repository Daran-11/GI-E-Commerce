import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { authOptions } from '../../[...nextauth]/route';


export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }


  const { productId } = await req.json();
  const userId = session.user.id;

  try {
    await prisma.cartItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    return NextResponse.json({ message: 'Item deleted from cart' },{ status: 200 });
  } catch (error) {
    console.error('Failed to delete item from cart:', error);
    return NextResponse.json({ message: 'Failed to delete item from cart' }, { status: 500 });
  }
}


