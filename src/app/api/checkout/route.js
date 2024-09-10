import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const { userId, productId, quantity, address } = await request.json();

    // Fetch the product to validate quantity and calculate total price
    const product = await prisma.product.findUnique({
      where: { ProductID: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (quantity > product.Amount) {
      return NextResponse.json({ error: 'Insufficient product quantity' }, { status: 400 });
    }

    // Create the user's address or update if it exists
    const userAddress = await prisma.address.upsert({
      where: {
        userId_addressLine: {
          userId: userId,
          addressLine: address.addressLine
        }
      },
      update: {
        provinceId: address.provinceId,
        amphoeId: address.amphoeId,
        tambonId: address.tambonId,
        postalCode: address.postalCode
      },
      create: {
        userId: userId,
        provinceId: address.provinceId,
        amphoeId: address.amphoeId,
        tambonId: address.tambonId,
        addressLine: address.addressLine,
        postalCode: address.postalCode
      }
    });

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: userId,
        productId: productId,
        quantity: quantity,
        totalPrice: quantity * product.Price,
        addressId: userAddress.id
      }
    });

    // Reduce the product amount
    await prisma.product.update({
      where: { ProductID: productId },
      data: { Amount: product.Amount - quantity }
    });

    return NextResponse.json({ message: 'Order placed successfully', order }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}