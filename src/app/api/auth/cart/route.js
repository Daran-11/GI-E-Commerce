import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { authOptions } from "../[...nextauth]/route";



export async function GET() {
  const session = await getServerSession({authOptions});
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
  }
  const userId = session.user.id;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });
    
    const flatCartItems = cartItems.map(item => ({
      productId: item.product.ProductID,
      productName: item.product.ProductName,
      productAmount: item.product.Amount,
      productType: item.product.ProductType,
      productPrice: item.product.Price,
      farmerId: item.product.farmerId,
      quantity: item.quantity,
    }));

    return NextResponse.json(flatCartItems);
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    return NextResponse.json({ message: 'Failed to fetch cart items' }, { status: 500 });
  }
}