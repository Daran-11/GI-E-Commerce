import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET request to fetch delivery services
export async function GET(req) {
  try {
    const deliveryServices = await prisma.Delivery_Service.findMany({
      orderBy: {
        name: 'asc', // Sorting alphabetically by name
      },
    });

    return NextResponse.json(deliveryServices);
  } catch (error) {
    console.error("Failed to fetch delivery services:", error);
    return NextResponse.json({ message: "Error fetching delivery services" }, { status: 500 });
  }
}
