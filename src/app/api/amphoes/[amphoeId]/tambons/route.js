import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(request, { params }) {
  const { amphoeId } = params;
  const tambons = await prisma.tambon.findMany({
    where: { amphoeId: Number(amphoeId) },
    orderBy: {
        name_th: 'asc' // Sort alphabetically by Thai name
      }
  });
  return NextResponse.json(tambons);
}