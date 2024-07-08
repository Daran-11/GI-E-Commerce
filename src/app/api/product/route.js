import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";
//endpoint สำหรับ display สับปะรดแต่ละอัน
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        ProductID: true,
        ProductName: true,
        ProductType: true,
        Price: true,
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return  NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}