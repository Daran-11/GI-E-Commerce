
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../../lib/prisma";

export async function GET(request,{ params }) {
    const session = await getServerSession({ request, ...authOptions });
    const { userId , ProductID } = params;
  
  
    console.log('chk Session for addresses:', session); // Debug session
    console.log('User ID:', session?.user?.id); // Debug user ID
  
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
  
    if (farmer) {
      try {
        
        const product = await prisma.product.findUnique({
          where: 
          { ProductID: parseInt(ProductID, 10), 
            farmer: {
              userId: parseInt(userId),
            },
           },
          // No need to include 'farmer' here as it's not in the Product model
          
        });
        if (product) {
          return NextResponse.json(product);
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
      // Fetching all products
      try {
        const products = await prisma.product.findMany();
        return NextResponse.json(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
          { error: "Error fetching products" },
          { status: 500 }
        );
      }
    }
  }
