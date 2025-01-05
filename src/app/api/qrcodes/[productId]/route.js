import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// ดึงข้อมูล QR Code ตาม productId
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = params;
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qR_Code.findFirst({
      where: {
        productId: parseInt(productId)
      },
      include: {
        certificate: true,
        product: true,
        farmer: true
      }
    });

    if (!qrCode) {
      return NextResponse.json(
        { error: "QR Code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(qrCode);

  } catch (error) {
    console.error("Failed to fetch QR code:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR code", details: error.message },
      { status: 500 }
    );
  }
}

// อัพเดท QR Code ตาม productId
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = params;
    const data = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี QR Code อยู่หรือไม่
    const existingQRCode = await prisma.qR_Code.findFirst({
      where: {
        productId: parseInt(productId)
      }
    });

    if (!existingQRCode) {
      return NextResponse.json(
        { error: "QR Code not found" },
        { status: 404 }
      );
    }

    // อัพเดท QR Code
    const updatedQRCode = await prisma.qR_Code.update({
      where: {
        qrcodeId: existingQRCode.qrcodeId
      },
      data: {
        certificateId: data.certificateId,
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

// ลบ QR Code ตาม productId
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = params;
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี QR Code อยู่หรือไม่
    const existingQRCode = await prisma.qR_Code.findFirst({
      where: {
        productId: parseInt(productId)
      }
    });

    if (!existingQRCode) {
      return NextResponse.json(
        { error: "QR Code not found" },
        { status: 404 }
      );
    }

    // ลบ QR Code
    await prisma.qR_Code.delete({
      where: {
        qrcodeId: existingQRCode.qrcodeId
      }
    });

    return NextResponse.json(
      { message: "QR Code deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to delete QR code:", error);
    return NextResponse.json(
      { error: "Failed to delete QR code", details: error.message },
      { status: 500 }
    );
  }
}