import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../lib/prisma";


//Get all products under that specific farmer parsing userId to check for farmer from params
export async function GET(request,{ params }) {
    const session = await getServerSession({ request, ...authOptions });
    const { searchParams } = new URL(request.url);
    const ProductID = searchParams.get("ProductID");   
    const { userId} = params;
  
  
    console.log('chk Session for receiving product info:', session); // Debug session
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
  
    if (ProductID) {
      try {
        
        const product = await prisma.product.findUnique({
          where:
          { 
            isDeleted: false,
            ProductID: parseInt(ProductID, 10), 
            farmer: {
              userId: parseInt(userId),
            },
           },
          
        });
        console.log("Get product Id:",ProductID)
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
        const products = await prisma.product.findMany(
          {
            where: {
              isDeleted: false,
              farmer: {
                userId: parseInt(userId),
              },
            },
          }
        );
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
  