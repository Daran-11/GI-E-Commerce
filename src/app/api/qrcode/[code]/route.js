import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const qrCode = await prisma.qR_Code.findUnique({
      where: {
        Product_ID: params.code,
      },
      include: {
        farmer: {
          select: {
            farmerName: true,
            address: true,
            phone: true,
            certificates: {
              select: {
                type: true,
                variety: true,
                registrationDate: true,
                expiryDate: true,
                standards: true,
                status: true,
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

    // Format standards data
    let standardsData = [];
    try {
      if (typeof qrCode.Standard === 'string') {
        standardsData = JSON.parse(qrCode.Standard);
      } else if (typeof qrCode.Standard === 'object') {
        standardsData = qrCode.Standard;
      }
    } catch (e) {
      console.error('Error parsing standards:', e);
    }

    // Format the response data
    const responseData = {
      Product_ID: qrCode.Product_ID,
      Type: qrCode.Type,
      Variety: qrCode.Variety,
      ProductionQuantity: Number(qrCode.ProductionQuantity),
      Address: qrCode.Address,
      Phone: qrCode.Phone,
      farmerName: qrCode.farmerName,
      Latitude: qrCode.Latitude,
      Longitude: qrCode.Longitude,
      Standard: standardsData,
      // Include farmer certificates if needed
      certificates: qrCode.farmer?.certificates?.map(cert => ({
        type: cert.type,
        variety: cert.variety,
        standards: typeof cert.standards === 'string' 
          ? JSON.parse(cert.standards)
          : cert.standards,
        registrationDate: cert.registrationDate,
        expiryDate: cert.expiryDate,
        status: cert.status
      })) || [],
      createdAt: qrCode.createdAt
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching QR code data:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}