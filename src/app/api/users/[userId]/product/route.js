import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../lib/prisma";

export async function GET(request,{ params }) {
  const session = await getServerSession({ request, ...authOptions });
  const { userId, ProductID } = params;


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

export async function POST(request,{ params }) {

  const session = await getServerSession({ request, ...authOptions });
  const { userId } = params;


  console.log('chk Session for addresses:', session); // Debug session
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

  try {
    const data = await request.json();
    console.log("create data:",data)
    const product = await prisma.product.create({
      data: {
        plotCode: data.plotCode,
        ProductName: data.ProductName,
        ProductType: data.ProductType,
        Price: parseFloat(data.Price), // Convert to Float
        Amount: parseInt(data.Amount, 10), // Convert to Int
        status: data.status,
        farmerId: farmer.id,  // Link the product to the farmer
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}


