import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || ""; // Get the search query
  const sortOrder = searchParams.get("sortOrder") || "asc"; // Sort order (default to ascending)

  try {
    const count = await prisma.product.count({
      where: {
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
    });
    return NextResponse.json({ total: count });
  } catch (error) {
    console.error("Error fetching product count:", error);
    return NextResponse.json(
      { error: "Error fetching product count" },
      { status: 500 }
    );
  }
}
