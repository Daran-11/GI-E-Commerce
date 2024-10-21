
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
    // Fetch total amount sold from OrderItem
    const totalAmount = await prisma.orderItem.aggregate({
      _sum: {
        quantity: true, // Assuming the field for quantity in OrderItem is named 'quantity'
      },
      where: {
        productId: productId, // Use the integer value here
      },
    });

    // Get the sum of sold quantities
    const soldAmount = totalAmount._sum.quantity || 0;

    // Update the soldCount in the Product table
    await prisma.product.update({
      where: { ProductID: productId },
      data: {
        soldCount: soldAmount, // Update the soldCount to the latest total sold amount
      },
    });

    return new Response(
      JSON.stringify({ totalAmount: soldAmount }), // Returning the sold amount
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
