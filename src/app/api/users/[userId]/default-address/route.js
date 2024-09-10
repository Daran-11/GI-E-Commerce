import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== parseInt(userId, 10)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the default address for the user
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: parseInt(userId, 10),
        isDefault: true,
      },
    });

    if (!defaultAddress) {
      return NextResponse.json(
        { error: "Default address not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(defaultAddress);
  } catch (error) {
    console.error("Error fetching default address:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
