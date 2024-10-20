import { NextResponse } from 'next/server';
import { prisma } from "../../../../../lib/prisma"; // Adjust the path as necessary
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    const session = await getServerSession(authOptions, request);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                isDeleted: false,
            },

        });

        if (!products) {
            return NextResponse.json({ error: "No products found" }, { status: 404 });
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Error fetching products" },
            { status: 500 }
        );
    }
}
