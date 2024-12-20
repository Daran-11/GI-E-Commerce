import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const farmerId = parseInt(params.id);

    // ดึงข้อมูลเกษตรกร
    const farmer = await prisma.farmer.findUnique({
      where: {
        id: farmerId
      },
      include: {
        // เรียกข้อมูล user ที่เกี่ยวข้อง
        user: {
          select: {
            name: true,
            email: true
          }
        },
        // เรียกข้อมูลใบรับรอง
        certificates: {
          select: {
            type: true,
            variety: true,
            registrationDate: true,
            expiryDate: true,
            status: true,
            standards: true
          }
        },
        // เรียกข้อมูลบัญชีธนาคาร
        BankAccounts: {
          include: {
            bank: true
          }
        }
      }
    });

    if (!farmer) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลเกษตรกร' },
        { status: 404 }
      );
    }

    return NextResponse.json(farmer);

  } catch (error) {
    console.error('Error fetching farmer data:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเกษตรกร' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}