// Import necessary modules
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prisma"; // Ensure this path is correct
import { checkOrderStatus } from "../../../../../../../lib/middleware/orderStatusMiddleware";

// Helper function to check session and permissions
async function checkPermissions(session, userId) {
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer" && session.user.role !== "admin") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null; // No errors
}

// Get orders or specific order details based on request parameters
export async function GET(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id"); // Get the order ID from query parameters
  const { userId } = params; // Get the user ID from route parameters
  const query = searchParams.get("query") || ""; // Search query

  // Check permissions
  const permissionError = await checkPermissions(session, userId);
  if (permissionError) return permissionError;

  // Check for farmer profile only if not admin
  const farmer = await prisma.farmer.findUnique({
    where: {
      userId: parseInt(userId),
    },
  });

  if (!farmer && session.user.role !== "admin") {
    return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
  }

  // Apply middleware to update statuses before proceeding
  await checkOrderStatus(req, userId);

  // If orderId is provided, fetch that specific order
  if (orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: parseInt(orderId),
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

      if (order || session.user.role === "admin") {
        return NextResponse.json(order);
      } else {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json({ error: "Error fetching order" }, { status: 500 });
    }
  } else if (query) {
    // Fetch orders based on the query (additional logic can be added here)
    try {
      const orders = await prisma.order.findMany({
        where: {
          farmer: {
            userId: parseInt(userId),
          },
          id: parseInt(query), // Modify this as needed based on your search criteria
        },
        include: {
          user: {
            select: {
              name: true,
              phone: true,
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

      return NextResponse.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
    }
  } else {
    // Fetching all orders if no query or orderId
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
      return NextResponse.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
    }
  }
}

// Update order delivery status
export async function PUT(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order"); // Get the order ID from query parameters
  const { userId } = params; // Get the user ID from route parameters

  const permissionError = await checkPermissions(session, userId);
  if (permissionError) return permissionError;

  const farmer = await prisma.farmer.findUnique({
    where: {
      userId: parseInt(userId),
    }
  });

  if (!farmer && session.user.role !== "admin") {
    return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
  }

  try {
    const { deliveryStatus } = await req.json();

    // Validate deliveryStatus if necessary
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
      return NextResponse.json({ error: 'Invalid delivery status' }, { status: 400 });
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

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update delivery status' }, { status: 500 });
  }
}
