// /api/users/[userId]/addresses.js

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(req, { params }) {


  const { userId } = params;


  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== parseInt(userId, 10)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log('chk Session for addresses:', session); // Debug session
  console.log('User ID:', session?.user?.id); // Debug user ID


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


export async function PUT(req, { params }) {
  
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = params;
  if (session.user.id !== parseInt(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await req.json();
  const { id, addressLine, provinceId, amphoeId, tambonId, postalCode, isDefault } = data;

  // Log data before processing
  console.log('Data received for update:', {
    id, addressLine, provinceId, amphoeId, tambonId, postalCode, isDefault
  });

  // Validate data
  if (!id || !addressLine || isNaN(provinceId) || isNaN(amphoeId) || isNaN(tambonId) || !postalCode) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update all other addresses to not be default if a new one is set as default
      if (isDefault) {
        await tx.address.updateMany({
          where: {
            userId: parseInt(userId),
            isDefault: true,
            NOT: { id: parseInt(id) },
          },
          data: { isDefault: false },
        });
        console.log('Updated other addresses to not default');
      }

      // Update the specific address
      await tx.address.update({
        where: { id: parseInt(id) },
        data: {
          addressLine,
          provinceId: parseInt(provinceId),
          amphoeId: parseInt(amphoeId),
          tambonId: parseInt(tambonId),
          postalCode,
          isDefault: !!isDefault,
        },
      });

      console.log('Address updated successfully');
    });

    return NextResponse.json({ message: 'Address updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
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

  const { addressLine, provinceId, amphoeId, tambonId, postalCode, isDefault } = await req.json();


  console.log('Data received for creation:', {
    addressLine, provinceId, amphoeId, tambonId, postalCode, isDefault
  }); // Debug data

  
  if (!addressLine || !provinceId || !amphoeId || !tambonId || !postalCode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    if (isDefault) {
      // Unset the default flag for all other addresses
      await prisma.address.updateMany({
        where: {
          userId: parseInt(userId),
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        addressLine,
        provinceId: parseInt(provinceId),
        amphoeId: parseInt(amphoeId),
        tambonId: parseInt(tambonId),
        postalCode,
        userId: parseInt(userId),
        isDefault: !!isDefault,
      },
    });
    return NextResponse.json(newAddress, { status: 201 });
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
    // Check if the address being deleted is the default address
    const addressToDelete = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (addressToDelete?.isDefault) {
      // Handle the case where the default address is being deleted
      // For example, you might set another address as default or leave none as default
      await prisma.address.updateMany({
        where: {
          userId: parseInt(userId),
          isDefault: false,
        },
        data: {
          isDefault: true,
        },
      });
    }

    await prisma.address.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Address deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
