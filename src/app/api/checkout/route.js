import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the import based on your project structure

export async function POST(request) {
  const { productId, quantity } = await request.json();

  // Validate the input
  if (!productId || !quantity) {
    return NextResponse.json({ error: 'Product ID and quantity are required.' }, { status: 400 });
  }

  // Fetch product details from database
  const product = await prisma.product.findUnique({
    where: { ProductID: productId },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  // Validate quantity
  if (quantity <= 0 || quantity > product.Amount) {
    return NextResponse.json({ error: 'Invalid quantity.' }, { status: 400 });
  }

  // Here you can process the checkout logic, such as creating an order or updating stock

  // Example response
  return NextResponse.json({
    message: 'Checkout successful!',
    product: {
      name: product.ProductName,
      price: product.Price,
      quantity,
      total: product.Price * quantity,
    },
  });
}