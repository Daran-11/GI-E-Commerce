// app/api/farmer_certificates/[id]/route.js
import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'Invalid Users ID' },
        { status: 400 }
      );
    }

    const UsersId = parseInt(id);

    const certificates = await prisma.certificate_farmer.findMany({
      where: {
        UsersId: UsersId
      },
      orderBy: {
        approvalDate: 'desc'
      }
    });

    return NextResponse.json(certificates);

  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching certificates',
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}