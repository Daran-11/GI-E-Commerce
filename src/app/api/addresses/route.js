import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressData = await request.json();
    const userId = session.user.id;

    // Convert IDs to integers
    const addressId = addressData.id ? parseInt(addressData.id, 10) : undefined;
    const provinceId = parseInt(addressData.provinceId, 10);
    const amphoeId = parseInt(addressData.amphoeId, 10);
    const tambonId = parseInt(addressData.tambonId, 10);

    // Check if user already has 2 addresses
    if (!addressId) {
      const addressCount = await prisma.address.count({
        where: { userId },
      });
      if (addressCount >= 2) {
        return NextResponse.json(
          { error: "Cannot have more than 2 addresses" },
          { status: 400 },
        );
      }
    }

    // Handle default address logic
    let address;
    if (addressData.isDefault) {
      // Set other addresses to non-default
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      // Create or update the default address
      address = await prisma.address.upsert({
        where: { id: addressId || -1 },
        update: {
          addressLine: addressData.addressLine,
          provinceId: parseInt(provinceId, 10),
          amphoeId: parseInt(amphoeId, 10),
          tambonId: parseInt(tambonId, 10),
          postalCode: addressData.postalCode,
          isDefault: true,
        },
        create: {
          addressLine: addressData.addressLine,
          provinceId: parseInt(provinceId, 10),
          amphoeId: parseInt(amphoeId, 10),
          tambonId: parseInt(tambonId, 10),
          postalCode: addressData.postalCode,
          userId,
          isDefault: true,
        },
      });
    } else {
      // Create or update the address without changing default status
      address = await prisma.address.upsert({
        where: { id: addressId || -1 },
        update: {
          addressLine: addressData.addressLine,
          provinceId: parseInt(provinceId, 10),
          amphoeId: parseInt(amphoeId, 10),
          tambonId: parseInt(tambonId, 10),
          postalCode: addressData.postalCode,
          userId,
        },
        create: {
          addressLine: addressData.addressLine,
          provinceId: parseInt(provinceId, 10),
          amphoeId: parseInt(amphoeId, 10),
          tambonId: parseInt(tambonId, 10),
          postalCode: addressData.postalCode,
          userId,
        },
      });
    }

    return NextResponse.json(address, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save address" },
      { status: 500 },
    );
  }
}
