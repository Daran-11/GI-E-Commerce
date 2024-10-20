import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma"; // Adjust the path according to your project structure
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    const session = await getServerSession({ request, ...authOptions });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const history = await prisma.history.findMany({
            include: {
                order: true, // Include the related Order data
                user: true,  // Include the related User data
                farmer: true, // Include the related Farmer data
            },
        });

        return NextResponse.json(history, { status: 200 });
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
            { error: "Error fetching history" },
            { status: 500 }
        );
    }
}
