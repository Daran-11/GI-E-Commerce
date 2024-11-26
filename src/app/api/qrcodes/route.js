import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json({ error: "Farmer ID is required" }, { status: 400 });
    }

    const qrCodes = await prisma.qR_Code.findMany({
      where: {
        farmerId: parseInt(farmerId, 10)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log("Found QR codes:", qrCodes); // Debug log
    return NextResponse.json(qrCodes);

  } catch (error) {
    console.error("Failed to fetch QR codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR codes", details: error.message },
      { status: 500 }
    );
  }
}