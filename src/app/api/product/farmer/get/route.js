// ดึงข้อมูลไปแสดงผลยังหน้าเเว็บ
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("ProductID");

  if (id) {
    try {
      const product = await prisma.product.findUnique({
        where: { ProductID: parseInt(id, 10) },
      });
      console.log("Get product Id:", id);
      if (product) {
        return NextResponse.json(product);
      } else {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { error: "Error fetching product" },
        { status: 500 },
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
        { status: 500 },
      );
    }
  }
}
