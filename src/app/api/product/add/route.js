import { NextResponse } from "next/server"; // Ensure you import NextResponse
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ProductID = searchParams.get("ProductID");

  if (ProductID) {
    try {
      const product = await prisma.product.findUnique({
        where: { ProductID: parseInt(ProductID, 10) },
        // No need to include 'farmer' here as it's not in the Product model
      });
      if (product) {
        return NextResponse.json(product);
      } else {
        return NextResponse.json(
          { error: "Product not found" },
          { Status: 404 }
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { error: "Error fetching product" },
        { Status: 500 }
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
        { Status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        PlotCode: data.PlotCode,
        ProductName: data.ProductName,
        ProductType: data.ProductType,
        Price: parseFloat(data.Price), // Convert to Float
        Amount: parseInt(data.Amount, 10), // Convert to Int
        Status: data.Status,
      },
    });
    return NextResponse.json(product, { Status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { Status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data); // Log the received data

    const updatedProduct = await prisma.product.update({
      where: { ProductID: parseInt(data.ProductID, 10) },
      data: {
        PlotCode: data.PlotCode,
        ProductName: data.ProductName,
        ProductType: data.ProductType,
        Price: data.Price, // Convert Price to integer
        Amount: parseInt(data.Amount, 10), // Assuming Amount should also be an integer
        Status: data.Status,
      },
    });

    console.log("Updated product:", updatedProduct); // Log the updated product
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}


export async function DELETE(request) {
  try {
    const { searchParams, href } = new URL(request.url);

    console.log("Request URL:", href); // Log the entire URL
    const ProductID = searchParams.get("ProductID");

    if (!ProductID) {
      console.warn("No 'ProductID' provProductIDed in the URL query string:", href);
      return NextResponse.json({ error: "No ProductID provide" }, { Status: 400 });
    }

    await prisma.product.delete({
      where: { ProductID: parseInt(ProductID, 10) },
    });
    return NextResponse.json({ Status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { Status: 500 }
    );
  }
}
