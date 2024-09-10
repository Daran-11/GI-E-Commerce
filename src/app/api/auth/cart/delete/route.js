import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { authOptions } from "../../[...nextauth]/route";

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Ensure that the productId is valid
    if (isNaN(parseInt(productId, 10))) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    // Remove item from the cart (assuming you have a Cart model)
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
        productId: parseInt(productId, 10),
      },
    });

    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart", details: error.message },
      { status: 500 },
    );
  }
}
