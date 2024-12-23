import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { code } = params;
    
    // ดึงข้อมูล QR Code และ relations ที่เกี่ยวข้อง
    const qrCodeData = await prisma.qR_Code.findUnique({
      where: {
        qrcodeId: code
      },
      include: {
        certificate: true,
        product: {
          select: {
            ProductID: true,
            DateCreated: true,
            Price: true,
            images: true
          }
        }
      }
    });

    if (!qrCodeData) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูล QR Code' },
        { status: 404 }
      );
    }

    // ถ้ามีข้อมูล certificate และ standards
    if (qrCodeData.certificate?.standards) {
      try {
        // แปลง JSON string เป็น object
        const standardsData = JSON.parse(qrCodeData.certificate.standards);
        qrCodeData.certificate.standards = standardsData;
      } catch (error) {
        console.error('Error parsing standards JSON:', error);
        qrCodeData.certificate.standards = [];
      }
    }

    return NextResponse.json({
      success: true,
      data: qrCodeData
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}