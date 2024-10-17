// Import necessary modules
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prisma";

// Get all orders under that specific farmer parsing userId to check for farmer from params
export async function GET(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });
  const { searchParams } = new URL(req.url);
  const OrderId = searchParams.get("id");
  const { userId } = params;
  const query = searchParams.get("query") || ""; // Search query
  
  console.log("user id is ",userId)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const farmer = await prisma.farmer.findUnique({
    where: {
      userId: parseInt(userId),
    }
  });

  if (!farmer) {
    return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
  }

  // Check if an Order ID is provided
  if (OrderId) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: parseInt(OrderId),
          farmer: {
            userId: parseInt(userId), // Checking if the farmer belongs to the user
          },
        },
        include: {
          farmer: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          orderItems: {
            include: {
              product: true,
              farmer: true,
            },
          },
        },
      });
      console.log("Get Order ID:", OrderId);
      if (order) {
        return NextResponse.json(order);
      } else {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json(
        { error: "Error fetching order" },
        { status: 500 }
      );
    }
  } else if (query) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          farmer: {
            userId: parseInt(userId),
          },
          id: parseInt(query), // Querying for order by ID directly
          
        },
        include: {
          user: {
            select: {
              name: true, // Only fetch the name of the user
            },
          },
          delivery: {
            include: {
              deliveryService: true,
            },
          },
          orderItems: {
            include: {
              product: true,
              farmer: true,
            },
          },
        },
      });
      console.log(orders.user);
      return NextResponse.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Error fetching orders" },
        { status: 500 }
      );
    }
  } else {
    // Fetching all orders if no query or OrderId
    try {
      const orders = await prisma.order.findMany({
        where: {
          farmer: {
            userId: parseInt(userId),
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              phone: true,
            }
          },
          delivery: {
            include: {
              deliveryService: true,
            },
          },
          orderItems: {
            include: {
              product: true,
              farmer: true,
            },
          },
        },
      });
      return NextResponse.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Error fetching orders" },
        { status: 500 }
      );
    }
  }
}

export async function PUT(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order");
  const { userId } = params;
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const farmer = await prisma.farmer.findUnique({
    where: {
      userId: parseInt(userId),
    }
  });

  if (!farmer) {
    return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
  }


  try {
    const { deliveryStatus } = await req.json();

    // Validate deliveryStatus if necessary (you can implement your own validation logic)
    const validStatuses = [
      'Preparing',
      'Shipped',
      'OutForDelivery',
      'Delivered',
      'Canceled',
      'Returned',
      'FailedDelivery',
      'AwaitingPickup',
      'RefundProcessed',
    ];

    if (!validStatuses.includes(deliveryStatus)) {
      return new Response('Invalid delivery status', { status: 400 });
    }

    // Update the order delivery status
    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(orderId),
      },
      data: {
        deliveryStatus: deliveryStatus,
      },
    });

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update delivery status', { status: 500 });
  }
}