// api/qrcode/validate/[code]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

// Regex patterns for QR code validation
const QR_CODE_PATTERNS = {
  PP: /^\d{3}PP\d{4}$/, // เช่น 001PP0002
  PN: /^\d{3}PN\d{4}$/, // เช่น 001PN0002
};

export async function GET(request, { params }) {
  try {
    const { code } = params;

    // Validate code format
    const isPP = QR_CODE_PATTERNS.PP.test(code);
    const isPN = QR_CODE_PATTERNS.PN.test(code);

    if (!isPP && !isPN) {
      return NextResponse.json(
        { 
          error: 'รูปแบบรหัสไม่ถูกต้อง',
          details: 'รหัสต้องอยู่ในรูปแบบ 000PP0000 หรือ 000PN0000'
        },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qR_Code.findUnique({
      where: {
        Product_ID: code,
      },
      select: {
        Product_ID: true,
        createdAt: true,
        Type: true, // เพิ่มเพื่อตรวจสอบประเภทสินค้า
        farmer: {
          select: {
            certificates: {
              select: {
                status: true,
                expiryDate: true
              },
              where: {
                status: "ผ่านการรับรอง",
                expiryDate: {
                  gt: new Date()
                }
              }
            }
          }
        }
      }
    });

    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    headers.set('Content-Type', 'application/json');

    const hasValidCertificates = qrCode?.farmer?.certificates?.length > 0;
    const codeType = code.substring(3, 5); // 'PP' or 'PN'

    return NextResponse.json({
      exists: !!qrCode,
      isValid: hasValidCertificates,
      productType: codeType,
      metadata: qrCode ? {
        createdAt: qrCode.createdAt,
        type: qrCode.Type,
        certificateStatus: hasValidCertificates ? 'valid' : 'expired'
      } : null,
    }, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error validating QR code:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถตรวจสอบรหัสได้ กรุณาลองใหม่อีกครั้ง',
        errorCode: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}