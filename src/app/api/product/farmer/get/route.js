import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("ProductID");
  const query = searchParams.get("query") || ""; // Get the search query
  const sortOrder = searchParams.get("sortOrder") || "asc"; // Sort order (default to ascending)
  const page = parseInt(searchParams.get("page")) || 1; // Current page
  const pageSize = parseInt(searchParams.get("pageSize")) || 10; // Number of items per page

  if (id) {
    // Fetching a single product by ProductID
    try {
      const product = await prisma.product.findUnique({
        where: { ProductID: parseInt(id, 10) },
        include: { images: true }, // Include related images
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
    // Fetching products with optional search query, sort order, and pagination
    try {
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            // Filter products based on the search query if provided
            OR: [
              {
                ProductName: {
                  contains: query, // Case-insensitive search
                },
              },
              {
                ProductType: {
                  contains: query, // Case-insensitive search
                },
              },
            ],
          },
          orderBy: {
            DateCreated: sortOrder, // Replace with the appropriate field name if needed
          },
          skip: (page - 1) * pageSize, // Offset for pagination
          take: pageSize, // Limit the number of items per page
          include: { images: true }, // Include related images
        }),
        prisma.product.count({
          where: {
            // Filter products based on the search query if provided
            OR: [
              {
                ProductName: {
                  contains: query, // Case-insensitive search
                },
              },
              {
                ProductType: {
                  contains: query, // Case-insensitive search
                },
              },
            ],
          },
        }),
      ]);

      return NextResponse.json({ products, total });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Error fetching products" },
        { status: 500 }
      );
    }
  }
}
