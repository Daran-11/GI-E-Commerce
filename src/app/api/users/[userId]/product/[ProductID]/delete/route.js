import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../../lib/prisma";


export async function DELETE(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });

  const { userId, ProductID } = params;
  console.log("product Id on delete:", ProductID);

  console.log('chk Session for Delete Product:', session); // Debug session
  console.log('User ID:', session?.user?.id); // Debug user ID

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const product = await prisma.product.findFirst({
    where: {
      ProductID: parseInt(ProductID, 10),
      farmer: {
        userId: parseInt(userId),
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found for this user.' }, { status: 404 });
  }

  try {
    if (!ProductID) {
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    // Perform soft delete by updating the isDeleted field
    await prisma.product.update({
      where: { 
        ProductID: parseInt(ProductID, 10),
      },
      data: {
        isDeleted: true,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}