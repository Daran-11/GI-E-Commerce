import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server"; // Ensure you import NextResponse

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id, 10) },
        // No need to include 'Users' here as it's not in the Product model
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

export async function POST(request) {
  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        productName: data.productName,
        variety: data.variety,
        price: parseFloat(data.price), // Convert to Float
        amount: parseInt(data.amount, 10), // Convert to Int
        status: data.status,
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

export async function PUT(request) {
  try {
    const data = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(data.id, 10) },
      data: {
        productName: data.productName,
        variety: data.variety,
        price: data.price,
        amount: data.amount,
        status: data.status,
      },
    });
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
    const id = searchParams.get("id");

    if (!id) {
      console.warn("No 'id' provided in the URL query string:", href);
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
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
