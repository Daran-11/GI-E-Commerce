import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const qrCode = await prisma.qR_Code.findUnique({
      where: {
        Product_ID: params.code,
      },
    });

    return NextResponse.json({
      exists: !!qrCode,
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถตรวจสอบรหัสได้ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}