import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../../../../lib/prisma';

export async function DELETE(req, { params }) {
  const session = await getServerSession({ req });
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { userId, addressId } = params;

  try {
    // Ensure that the user owns the address
    const address = await prisma.address.findUnique({
      where: {
        id: Number(addressId),
      },
    });

    if (!address || address.userId !== Number(userId)) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    // Delete the address
    await prisma.address.delete({
      where: {
        id: Number(addressId),
      },
    });

    return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete address:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}