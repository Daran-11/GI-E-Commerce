import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../lib/prisma";


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
  
    if (ProductID) {
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
        return NextResponse.json(
            { error: "Product ID not found " },
            { status: 404 }
          );
      } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
          { error: "Error fetching products" },
          { status: 500 }
        );
      }
    }
  }

  export async function PUT(request,{ params }) {

    const session = await getServerSession({ request, ...authOptions });
    const { userId , ProductID } = params;
  
  
    console.log('check Session for updating product:', session); // Debug session
    console.log('User ID:', session?.user?.id); // Debug user ID
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
      // Fetch the farmer data using the userId
      const farmer = await prisma.farmer.findUnique({
        where: { userId: parseInt(userId) }
      });
  
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer profile not found for this user.' }, { status: 404 });
    }
  
    const product = await prisma.product.findFirst({
      where: {
        ProductID: parseInt(ProductID, 10),
        farmer: {
          userId: parseInt(userId),
        },
      },
    });
  
    if (!product) {
      return NextResponse.json({ error: 'Product not found for this user.' }, { status: 404 });
    }
    
    try {
  
      const data = await request.json();
      const updatedProduct = await prisma.product.update({
        where: { 
          ProductID: parseInt(data.id, 10)
        },
        data: {
          plotCode: data.plotCode,
          ProductName: data.ProductName,
          ProductType: data.ProductType,
          Price: parseFloat(data.Price),
          Amount: parseFloat(data.Amount),
          status: data.status,
        },
      });
      console.log("updated:",updatedProduct)
      
      return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
      console.error("Failed to update product:", error);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }
  }

export async function DELETE(request,{ params }) {

    const session = await getServerSession({ request, ...authOptions });
    const { userId , ProductID } = params;
    
  
    console.log('chk Session for Delete Product:', session); // Debug session
    console.log('User ID:', session?.user?.id); // Debug user ID
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    const product = await prisma.product.findFirst({
      where: {
        ProductID: parseInt(ProductID, 10),
        farmer: {
          userId: parseInt(userId),
        },
      },
    });
  
    if (!product) {
      return NextResponse.json({ error: 'Product not found for this user.' }, { status: 404 });
    }
  
    try {
  
      if (!ProductID) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 });
      }
  
      await prisma.product.delete({
        where: { 
          ProductID: parseInt(ProductID, 10),
        },
      });
      return NextResponse.json({ status: 200 });
    } catch (error) {
      console.error("Failed to delete product:", error);
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }
  }
  