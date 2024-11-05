import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// Create a new Users
export async function POST(request) {
  const { firstName, lastName, certificates } = await request.json();

  try {
    const newUsers = await prisma.manage_farmer.create({
      data: {
        firstName,
        lastName,
        certificates: {
          create: certificates.map(cert => ({
            type: cert.type,
            variety: cert.variety,
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
    return NextResponse.json(newUsers, { status: 201 });
  } catch (error) {
    console.error('Failed to create Users:', error);
    return NextResponse.json({ error: 'Failed to create Users', details: error.message }, { status: 500 });
  }
}

// Update an existing Users
export async function PUT(request) {
  const { id, firstName, lastName, certificates } = await request.json();

  try {
    const updatedUsers = await prisma.manage_farmer.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        certificates: {
          deleteMany: {}, // Remove all existing certificates
          create: certificates.map(cert => ({
            type: cert.type,
            variety: cert.variety,
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
    return NextResponse.json(updatedUsers);
  } catch (error) {
    console.error('Failed to update Users:', error);
    return NextResponse.json({ error: 'Failed to update Users', details: error.message }, { status: 500 });
  }
}

// Fetch Users(s) data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const Users = await prisma.manage_farmer.findUnique({
        where: { id: parseInt(id) },
        include: { certificates: true },
      });
      if (!Users) {
        return NextResponse.json({ error: 'ไม่พบข้อมูลเกษตรกร' }, { status: 404 });
      }
      return NextResponse.json(Users);
    } else {
      const Users = await prisma.manage_farmer.findMany({
        include: { certificates: true },
      });
      return NextResponse.json(Users);
    }
  } catch (error) {
    console.error('Failed to fetch Users:', error);
    return NextResponse.json({ error: 'Failed to fetch Users', details: error.message }, { status: 500 });
  }
}

// Delete a Users
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing Users ID' }, { status: 400 });
  }

  try {
    // Delete all certificates associated with the Users
    await prisma.certificate.deleteMany({
      where: { UsersId: parseInt(id) },
    });

    // Delete the Users
    await prisma.manage_farmer.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Users and certificates deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Users:', error);
    return NextResponse.json({ error: 'Failed to delete Users', details: error.message }, { status: 500 });
  }
}
