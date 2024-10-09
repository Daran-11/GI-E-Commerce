import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// Create a new farmer
export async function POST(request) {
  const { firstName, lastName, certificates } = await request.json();

  try {
    const newFarmer = await prisma.manage_farmer.create({
      data: {
        firstName,
        lastName,
        certificates: {
          create: certificates.map(cert => ({
            standardName: cert.standardName,
            certificateNumber: cert.certificateNumber,
            approvalDate: new Date(cert.approvalDate),
          })),
        },
      },
      include: {
        certificates: true,
      },
    });
    return NextResponse.json(newFarmer, { status: 201 });
  } catch (error) {
    console.error('Failed to create farmer:', error);
    return NextResponse.json({ error: 'Failed to create farmer', details: error.message }, { status: 500 });
  }
}

// Update an existing farmer
export async function PUT(request) {
  const { id, firstName, lastName, certificates } = await request.json();

  try {
    const updatedFarmer = await prisma.manage_farmer.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        certificates: {
          deleteMany: {}, // Remove all existing certificates
          create: certificates.map(cert => ({
            standardName: cert.standardName,
            certificateNumber: cert.certificateNumber,
            approvalDate: new Date(cert.approvalDate),
          })),
        },
      },
      include: {
        certificates: true,
      },
    });
    return NextResponse.json(updatedFarmer);
  } catch (error) {
    console.error('Failed to update farmer:', error);
    return NextResponse.json({ error: 'Failed to update farmer', details: error.message }, { status: 500 });
  }
}

// Fetch farmer(s) data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const farmer = await prisma.manage_farmer.findUnique({
        where: { id: parseInt(id) },
        include: { certificates: true },
      });
      if (!farmer) {
        return NextResponse.json({ error: 'ไม่พบข้อมูลเกษตรกร' }, { status: 404 });
      }
      return NextResponse.json(farmer);
    } else {
      const farmers = await prisma.manage_farmer.findMany({
        include: { certificates: true },
      });
      return NextResponse.json(farmers);
    }
  } catch (error) {
    console.error('Failed to fetch farmers:', error);
    return NextResponse.json({ error: 'Failed to fetch farmers', details: error.message }, { status: 500 });
  }
}

// Delete a farmer
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing farmer ID' }, { status: 400 });
  }

  try {
    // Delete all certificates associated with the farmer
    await prisma.certificate.deleteMany({
      where: { farmerId: parseInt(id) },
    });

    // Delete the farmer
    await prisma.manage_farmer.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Farmer and certificates deleted successfully' });
  } catch (error) {
    console.error('Failed to delete farmer:', error);
    return NextResponse.json({ error: 'Failed to delete farmer', details: error.message }, { status: 500 });
  }
}
