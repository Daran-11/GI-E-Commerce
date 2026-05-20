import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const provinces = await prisma.province.findMany(
    {
        orderBy: {
            name_th: 'asc' // Sort alphabetically by Thai name
          }
    }
  );
  return NextResponse.json(provinces);
}