import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prisma";

export async function GET(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");
  const userId = parseInt(params.userId);

  // Check for session
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate user's access rights
  const isFarmer = session.user.role === "farmer";
  if (session.user.id !== userId && !isFarmer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Ensure a farmer profile exists
  const farmer = await prisma.farmer.findUnique({
    where: { userId },
  });
  if (!farmer) {
    return NextResponse.json(
      { error: "Farmer profile not found for this user" },
      { status: 404 }
    );
  }

  try {
    if (orderId) {
      // Fetch a specific order and make sure it's owned by the farmer's products
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          farmer: true,
          orderItems: {
            include: {
              product: true,  // Fetch product details for each order item
              farmer: true,
            },
          },
        },
      });

      // Ensure the order belongs to the current farmer's products
      const isOrderRelatedToFarmer = order?.orderItems.some(
        (orderItem) => orderItem.product.farmerId === farmer.id
      );

      if (!order || !isOrderRelatedToFarmer) {
        return NextResponse.json(
          { error: "Order not found or access denied" },
          { status: 404 }
        );
      }

      // Check if the order is delivered and move it to history
      if (order.deliveryStatus === "Delivered" && order.status === "Completed") {
        const historyEntry = await prisma.history.create({
          data: {
            orderId: order.id,
            userId: order.userId,
            farmerId: order.farmerId,
            totalPrice: order.totalPrice,
            status: order.status,
            paymentStatus: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
            completedAt: new Date(), // Set completion time
          },
        });


      }

      return NextResponse.json(order);
    } else {
      // Fetch all completed orders related to the farmer's products
      const history = await prisma.history.findMany({
        where: { farmerId: farmer.id },
        orderBy: { completedAt: 'desc' },
        include: {
          order: {
            include: {
              orderItems: {
                include: {
                  product: true, // Fetch products for the order items
                },
              },
            },
          },
          user: true,
          farmer: true,
        },
      });


      if (history.length === 0) {
        return NextResponse.json({ message: "No history found" });
      }

      return NextResponse.json(history);
    }
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
