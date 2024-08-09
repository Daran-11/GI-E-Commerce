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

    // Convert IDs to integers
    const addressId = addressData.id ? parseInt(addressData.id, 10) : undefined;
    const provinceId = parseInt(addressData.provinceId, 10);
    const amphoeId = parseInt(addressData.amphoeId, 10);
    const tambonId = parseInt(addressData.tambonId, 10);

    const address = await prisma.address.upsert({
      where: { id: addressId || -1 },
      update: {
        addressLine: addressData.addressLine,
        provinceId,
        amphoeId,
        tambonId,
        postalCode: addressData.postalCode,
        userId: session.user.id,
      },
      create: {
        addressLine: addressData.addressLine,
        provinceId,
        amphoeId,
        tambonId,
        postalCode: addressData.postalCode,
        userId: session.user.id,
      },
    });

    return NextResponse.json(address, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}
