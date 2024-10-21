import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET Multiple Users Data
export async function GET(req) {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 404 });
    }


    try {
        // Fetch all users or apply filters if necessary
        const users = await prisma.user.findMany({
            where: {
                role: {
                    not: "admin",
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                phone: true,

            },
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
