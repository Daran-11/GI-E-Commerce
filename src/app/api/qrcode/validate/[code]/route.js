import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const code = params.code;

    // เช็คว่ามีค่า code หรือไม่
    if (!code) {
      return NextResponse.json(
        { error: 'กรุณาระบุรหัสบรรจุภัณฑ์' },
        { status: 400 }
      );
    }

    // เช็คความยาวรหัส
    if (code.length !== 11) {
      return NextResponse.json(
        { error: 'รหัสต้องมีความยาว 11 หลัก' },
        { status: 400 }
      );
    }

    // เช็ครูปแบบรหัส PP หรือ PN ในตำแหน่งที่ 5-6
    const productType = code.substring(4, 6);
    if (productType !== 'PP' && productType !== 'PN') {
      return NextResponse.json(
        { error: 'รูปแบบรหัสไม่ถูกต้อง (ต้องมี PP หรือ PN)' },
        { status: 400 }
      );
    }

    // ค้นหารหัสในฐานข้อมูล
    const qrCode = await prisma.qR_Code.findUnique({
      where: {
        qrcodeId: code
      },
      include: {
        farmer: true,
        certificate: true,
        product: {
          include: {
            images: true,
            certificates: {
              include: {
                certificate: true
              }
            }
          }
        }
      }
    });

    // ถ้าไม่พบรหัสในระบบ
    if (!qrCode) {
      return NextResponse.json(
        { error: 'ไม่พบรหัสบรรจุภัณฑ์นี้ในระบบ' },
        { status: 404 }
      );
    }

    // ส่งข้อมูลกลับ
    return NextResponse.json({
      success: true,
      data: qrCode
    });

  } catch (error) {
    console.error('Error validating QR code:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัส' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}