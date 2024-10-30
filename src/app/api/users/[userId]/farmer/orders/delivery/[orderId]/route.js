import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DeliveryStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../../../lib/prisma';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  
  const { userId, orderId } = params;

  if (!orderId || !userId) {
    return NextResponse.json({ message: 'Missing orderId or userId' }, { status: 400 });
  }

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { deliveryService, trackingNum } = await request.json();

  if (!deliveryService || !trackingNum) {
    return NextResponse.json(
      { message: 'Delivery service and tracking number are required' },
      { status: 400 }
    );
  }

  try {

        // Find the delivery service by name
        const service = await prisma.Delivery_Service.findUnique({
          where: { id: deliveryService },
        });
    
        if (!service) {
          return NextResponse.json({ error: 'Delivery service not found' }, { status: 404 });
        }

    // Update the Delivery_Detail for the corresponding order
    const updatedDeliveryDetail = await prisma.Delivery_Detail.upsert({
      where: {
        orderId: parseInt(orderId), // Ensure that the orderId is an integer and unique
      },
      update: {
        trackingNum: trackingNum, // Update the tracking number
        serviceId: service.id, // Update the delivery service
      },
      create: {
        trackingNum: trackingNum, // Create with the new tracking number
        serviceId: service.id, // Create with the delivery service ID
        orderId: parseInt(orderId), // Associate with the correct order
      },
    });

    // Update the delivery status in the Order table to "shipped"
    await prisma.order.update({
      where: { id: parseInt(orderId) }, // Ensure that the orderId is an integer
      data: {
        deliveryId: updatedDeliveryDetail.id,
        deliveryStatus: DeliveryStatus.Shipped, // Use the enum value for "shipped"
      },
    });

    return NextResponse.json(updatedDeliveryDetail, { status: 200 });
  } catch (error) {
    console.error('Error updating delivery details:', error);
    return NextResponse.json({ message: 'Failed to update delivery details', error: error.message }, { status: 500 });
  }
}
