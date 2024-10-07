import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../../lib/prisma";

export async function PUT(req, { params }) {
    const session = await getServerSession({ req, ...authOptions });
    const { userId } = params;
    
    const { orderId, deliveryStatus } = await req.json();
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    const farmer = await prisma.farmer.findUnique({
      where: { userId: parseInt(userId) },
    });
  
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
    }
  
    try {
      console.log("Updating order:", orderId, "to status:", deliveryStatus);
      const order = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { deliveryStatus: deliveryStatus },
        include: { farmer: true },
      });
  
    //   console.log("Updated order data:", order);
  
      if (deliveryStatus === 'Delivered') {
        // console.log("Creating history for order:", order.id);
        try {
          await prisma.history.create({
            data: {
              orderId: order.id,
              userId: order.userId,  // Assuming the order has a userId field
              farmerId: order.farmerId, // Assuming the order has a farmerId field
              totalPrice: order.totalPrice,
              status: order.status,
              paymentStatus: order.paymentStatus,
              deliveryStatus: order.deliveryStatus,
            },
          });
        //   console.log("History entry created successfully.");
        } catch (error) {
          console.error("Error creating history entry:", error);
        }
  
       
      }
  
      return NextResponse.json(order);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      return NextResponse.json({ error: 'Error updating delivery status' }, { status: 500 });
    }
  }
  