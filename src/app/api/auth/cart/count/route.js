import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { authOptions } from "../../[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ count: 0 });
  }

  const userEmail = session.user.email;

  // Fetch cart item count for the user
  const count = await prisma.cartItem.count({
    where: { user: { email: userEmail } },
  });

  return NextResponse.json({ count });
}
