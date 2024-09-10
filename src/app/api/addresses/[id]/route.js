import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(request, { params }) {
  const { id } = params;
  const { addressLine, provinceId, amphoeId, tambonId, postalCode, isDefault } =
    await request.json();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressId = parseInt(id, 10);

    // Handle default address logic
    if (isDefault) {
      // Clear existing default address for the user
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Update the selected address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        addressLine,
        provinceId,
        amphoeId,
        tambonId,
        postalCode,
        isDefault, // Update the default status here
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const addressId = parseInt(id, 10);

    // Check if the address being deleted is the default address
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (address.isDefault) {
      // Reassign default address
      const otherAddress = await prisma.address.findFirst({
        where: { userId: session.user.id, id: { not: addressId } },
        orderBy: { createdAt: "asc" }, // Choose a method for selecting a new default
      });

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.address.delete({ where: { id: addressId } });
    return NextResponse.json({ message: "Address deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}
