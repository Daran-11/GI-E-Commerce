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
    const { token, orderIds, totalAmount } = body;

    // Validate the orders array
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid orders data' }, { status: 400 });
    }

    const orderIdsInt = orderIds.map(id => parseInt(id, 10));

    // Create a charge with Omise
    const charge = await omise.charges.create({
      amount: totalAmount * 100, // in satang for THB
      currency: 'thb',
      card: token,
    });

    if (charge.status === 'successful') {
      // Update orders to 'paid'
      await Promise.all(
        orderIdsInt.map(async (id) => {
          return prisma.order.update({
            where: { id },
            data: { status: 'paid' },
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
