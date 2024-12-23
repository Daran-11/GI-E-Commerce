import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET: Fetch ManageTypes and their related Varieties
export async function GET() {
  try {
    const manageTypes = await prisma.manageType.findMany({
      include: {
        varieties: true, // เชื่อมความสัมพันธ์กับ varieties
      },
    });

    return NextResponse.json({ manageTypes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ManageTypes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manage types' },
      { status: 500 }
    );
  }
}
