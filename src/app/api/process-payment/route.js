import { NextResponse } from 'next/server';
import Omise from 'omise';
import prisma from '../../../../lib/prisma';

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body); // Log the request body for debugging
    const { token, orderId, totalAmount, quantity, productId } = body;

    // Validate the order ID(s)
    if (!orderId || !orderId.length) {
      return NextResponse.json({ success: false, message: 'Invalid order ID' }, { status: 400 });
    }

    // Create a charge with Omise
    const charge = await omise.charges.create({
      amount: totalAmount * 100, // in satang for THB
      currency: 'thb',
      card: token,
    });

    if (charge.status === 'successful') {
      // Update multiple orders to 'Completed'
      await Promise.all(
        orderId.map(async (id) => {
          return prisma.order.update({
            where: { id: parseInt(id, 10) }, // Ensure the ID is an integer
            data: { 
              paymentStatus: 'Completed', // Use the enum value correctly
              status: 'Processing'
            },
          });
        })
      );

      // Update product amounts based on the quantities from the order
      await Promise.all(
        productId.map(async (id, index) => {
          const qty = quantity[index]; // Corresponding quantity for the product
          return prisma.product.update({
            where: { ProductID: parseInt(id, 10) }, // Ensure the ID is an integer
            data: {
              Amount: {
                decrement: qty, // Decrease the amount by the quantity ordered
              },
            },
          });
        })
      );

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: charge.failure_message }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
