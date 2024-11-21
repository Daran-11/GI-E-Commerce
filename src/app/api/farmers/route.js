import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const farmer = await prisma.farmer.findUnique({
      where: {
        userId: parseInt(userId, 10)
      }
    });

    return NextResponse.json(farmer);
  } catch (error) {
    console.error("Failed to fetch farmer:", error);
    return NextResponse.json(
      { error: "Failed to fetch farmer" },
      { status: 500 }
    );
  }
}