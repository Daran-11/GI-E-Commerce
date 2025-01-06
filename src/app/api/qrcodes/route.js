import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// คงไว้เหมือนเดิม
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

    console.log("Found QR codes:", qrCodes);
    return NextResponse.json(qrCodes);

  } catch (error) {
    console.error("Failed to fetch QR codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR codes", details: error.message },
      { status: 500 }
    );
  }
}

// เพิ่ม POST endpoint สำหรับสร้าง QR Code
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.farmerId || !data.productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี QR Code อยู่แล้วหรือไม่
    const existingQRCode = await prisma.qR_Code.findFirst({
      where: {
        productId: data.productId,
        farmerId: data.farmerId
      }
    });

    if (existingQRCode) {
      return NextResponse.json(
        { error: "QR Code already exists for this product" },
        { status: 409 }
      );
    }

    // สร้าง QR Code ใหม่
    const qrCode = await prisma.qR_Code.create({
      data: {
        qrcodeId: data.qrcodeId,
        farmerId: data.farmerId,
        certificateId: data.certificateId || null,
        productId: data.productId,
        userId: data.userId || null,
        orderId: data.orderId || null
      }
    });

    console.log("Created QR code:", qrCode);
    return NextResponse.json(qrCode, { status: 201 });

  } catch (error) {
    console.error("Failed to create QR code:", error);
    return NextResponse.json(
      { error: "Failed to create QR code", details: error.message },
      { status: 500 }
    );
  }
}

// เพิ่ม PUT endpoint สำหรับอัพเดท QR Code
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.qrcodeId) {
      return NextResponse.json(
        { error: "QR Code ID is required" },
        { status: 400 }
      );
    }

    const updatedQRCode = await prisma.qR_Code.update({
      where: {
        qrcodeId: data.qrcodeId
      },
      data: {
        certificateId: data.certificateId,
        productId: data.productId,
        userId: data.userId,
        orderId: data.orderId
      }
    });

    console.log("Updated QR code:", updatedQRCode);
    return NextResponse.json(updatedQRCode);

  } catch (error) {
    console.error("Failed to update QR code:", error);
    return NextResponse.json(
      { error: "Failed to update QR code", details: error.message },
      { status: 500 }
    );
  }
}