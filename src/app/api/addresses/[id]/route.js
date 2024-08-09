import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request, { params }) {
  const { id } = params; // Address ID from URL
  const { addressLine, provinceId, amphoeId, tambonId, postalCode } = await request.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert IDs to integers
    const addressId = parseInt(id, 10);
    const province = parseInt(provinceId, 10);
    const amphoe = parseInt(amphoeId, 10);
    const tambon = parseInt(tambonId, 10);

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        addressLine,
        provinceId: province,
        amphoeId: amphoe,
        tambonId: tambon,
        postalCode
      }
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert ID to integer
    const addressId = parseInt(id, 10);

    await prisma.address.delete({ where: { id: addressId } });
    return NextResponse.json({ message: "Address deleted" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

