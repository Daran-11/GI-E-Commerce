import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";
//endpoint สำหรับ display สับปะรดในหน้าหลัก
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false, // Fetch only products where isDeleted is false
      },
      select: {
        ProductID: true,
        ProductName: true,
        ProductType: true,
        Amount: true,
        Price: true,
        imageUrl: true,
        farmer: {
          select: {
            farmerName: true,  // Select specific fields from the Farmer model
            location: true,
          },
        },
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return  NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}