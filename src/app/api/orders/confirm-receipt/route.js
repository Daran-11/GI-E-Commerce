import { NextResponse } from 'next/server';
import Omise from 'omise';
import prisma from '../../../../../lib/prisma';

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function POST(request) {
  try {
    const { orderId, userId } = await request.json();
    console.log("orderId: ",orderId );
    // Retrieve the order to get the farmer's information
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { farmer: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    console.log("order is ",order);
    // Retrieve the farmer's default bank account
    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        farmerId: order.farmerId,
        isDefault: true,
      },
    });

    console.log("bankAccount is ",bankAccount);

    if (!bankAccount || !bankAccount.recipientId) {
      return NextResponse.json(
        { error: 'Farmer does not have a valid recipient ID' },
        { status: 400 }
      );
    }

    console.log("recipient is ",bankAccount.recipientId);
    console.log("price is ", Math.floor(order.totalPrice * 100))
    // Perform the Omise transfer to the farmer's recipient ID
    const transfer = await omise.transfers.create({
      amount: Math.floor(order.totalPrice * 100), // Omise uses satangs, so multiply by 100
      recipient: bankAccount.recipientId,
    });



    // Update the order status in the database to 'Completed' and 'Delivered'
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'Completed',
        deliveryStatus: 'Delivered',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error confirming receipt and transferring funds:', error);
    return NextResponse.json({ error: 'Failed to confirm receipt' }, { status: 500 });
  }
}
