import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const code = params.code;

    // ค้นหาข้อมูล QR Code พร้อมกับ relations ทั้งหมด
    const qrCode = await prisma.qR_Code.findUnique({
      where: {
        qrcodeId: code
      },
      include: {
        farmer: {
          select: {
            farmerName: true,
            address: true,
            sub_district: true,
            district: true,
            province: true,
            zip_code: true,
            phone: true,
            contactLine: true
          }
        },
        certificate: {
          include: {
            products: {
              include: {
                product: true
              }
            }
          }
        },
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

    if (!qrCode) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูล QR Code' },
        { status: 404 }
      );
    }

    return NextResponse.json(qrCode);

  } catch (error) {
    console.error('Error fetching QR code data:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}