// /pages/api/users/[userId]/addresses.js

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });

  console.log('Session:', session); // Debug session
  console.log('User ID:', session?.user?.id); // Debug user ID

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = params;

  if (session.user.id !== parseInt(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: parseInt(userId) },
      include: {
        province: true,
        amphoe: true,
        tambon: true,
      },
    });


    
    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = params;

  if (session.user.id !== parseInt(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { addressLine, provinceId, amphoeId, tambonId, postalCode } = await req.json();

  if (!addressLine || !provinceId || !amphoeId || !tambonId || !postalCode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newAddress = await prisma.address.create({
      data: {
        addressLine,
        provinceId: parseInt(provinceId),
        amphoeId: parseInt(amphoeId),
        tambonId: parseInt(tambonId),
        postalCode,
        userId: parseInt(userId),
      },
    });
    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Failed to save address:', error);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = params;

  if (session.user.id !== parseInt(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id, addressLine, provinceId, amphoeId, tambonId, postalCode } = await req.json();

  if (!addressLine || !provinceId || !amphoeId || !tambonId || !postalCode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const updatedAddress = await prisma.address.update({
      where: { id: parseInt(id) },
      data: {
        addressLine,
        provinceId: parseInt(provinceId),
        amphoeId: parseInt(amphoeId),
        tambonId: parseInt(tambonId),
        postalCode,
      },
    });
    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.error('Failed to save address:', error);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, id } = params;

  if (session.user.id !== parseInt(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.address.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Address deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
