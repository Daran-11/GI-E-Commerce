import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../lib/prisma";


//Get all orders under that specific farmer parsing userId to check for farmer from params
export async function GET(req,{ params }) {
    const session = await getServerSession({ req, ...authOptions });
    const { searchParams } = new URL(req.url);
    const OrderId = searchParams.get("id");   
    const { userId} = params;
  
  
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    const farmer = await prisma.farmer.findUnique({
      where: {
        userId: parseInt(userId) }
    });
  
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
    }
  
    if (OrderId) {
      try {
        
        const order = await prisma.order.findUnique({
            where: {
              id: parseInt(OrderId), // This is the ID from the 'Order' table
              farmer: {
                userId: parseInt(userId),
              },
            },
            include: {
              farmer:true, 
              orderItems: {
                include: {
                  product: true,
                  farmer: true,
                },
              },
            },
          });
        console.log("Get product Id:",OrderId)
        if (order) {
          return NextResponse.json(order);
        } else {
          return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
          { error: "Error fetching product" },
          { status: 500 }
        );
      }
    } else {
      // Fetching all orders
      try {
        const orders = await prisma.order.findMany({
          where: {
            farmer: {
              userId: parseInt(userId),
            },
            deliveryStatus: {
              not: 'Delivered', // Exclude delivered orders
            },
          },
          orderBy: { createdAt: 'desc' },
          include: {
            orderItems: {
              include: {
                product: true,  // Include product details for each order item
                farmer: true,   // Include farmer details for each order item
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
  