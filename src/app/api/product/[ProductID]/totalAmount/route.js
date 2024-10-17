// pages/api/product/[productId]/totalAmount.js

import prisma from '../../../../../../lib/prisma'; // Adjust the import based on your project structure

export async function GET(request, { params }) {
  const { ProductID } = params;

  // Convert ProductID to an integer
  const productId = parseInt(ProductID, 10);

  // Check if the conversion was successful
  if (isNaN(productId)) {
    return new Response(
      JSON.stringify({ error: 'Invalid product ID' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const totalAmount = await prisma.orderItem.aggregate({
      _sum: {
        quantity: true, // Assuming the field for quantity in OrderItem is named 'quantity'
      },
      where: {
        productId: productId, // Use the integer value here
      },
    });

    return new Response(
      JSON.stringify({ totalAmount: totalAmount._sum.quantity || 0 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching total amount:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch total amount' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}