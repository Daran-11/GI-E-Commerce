//แก้
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prisma";

// Get all orders under that specific farmer by parsing `userId` from params
export async function GET(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  const { userId } = params;

  // Check for session
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure the user is the same as `userId` or is a farmer
  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Verify if a farmer profile exists for the user
  const farmer = await prisma.farmer.findUnique({
    where: {
      userId: parseInt(userId),
    },
  });

  if (!farmer) {
    return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
  }

  // If `orderId` is provided, fetch the specific order
  if (orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: parseInt(orderId),
        },
        include: {
          farmer: true,
          orderItems: {
            include: {
              product: true,
              farmer: true,
            },
          },
        },
      });

      // Ensure the order belongs to the authenticated user or farmer
      if (order && order.farmer.userId === parseInt(userId)) {
        // Check if the order is delivered
        if (order.deliveryStatus === 'Delivered') {
          // Move to history
          await prisma.history.create({
            data: {
              orderId: order.id,
              userId: order.userId,
              farmerId: order.farmerId,
              totalPrice: order.totalPrice,
              status: order.status,
              paymentStatus: order.paymentStatus,
              deliveryStatus: order.deliveryStatus,
              completedAt: new Date() // Manually set the completion time here
            },
          });

          // Optionally delete the order
          await prisma.order.delete({
            where: { id: parseInt(orderId) },
          });
        }

        return NextResponse.json(order);
      } else {
        return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
    }
  } else {
    // Fetch all completed orders for the farmer
    try {
      const history = await prisma.history.findMany({
        where: {
          farmerId: parseInt(userId),
        },
        orderBy: { completedAt: 'desc' }, // Sort by completion time
        include: {
          order: true,
          user: true,
          farmer: true,
        },
      });

      return NextResponse.json(history);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
    }
  }
}
