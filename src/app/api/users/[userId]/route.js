import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// GET Single User by userId
export async function GET(req, { params }) {
    const session = await getServerSession({ req, ...authOptions });

    // Check if the session exists
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure the user has admin privileges
    if (session.user.role !== "admin") {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    try {
        const { userId } = params;

        // Convert userId to a number before using it in the query
        const userIdAsNumber = parseInt(userId, 10);

        // Validate if the conversion was successful
        if (isNaN(userIdAsNumber)) {
            return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userIdAsNumber, },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                Addresses: {
                    where: {
                        isDefault: true,
                    },
                    select: {
                        id: true,
                        addressLine: true,
                        postalCode: true,
                        isDefault: true,
                        province: {
                            select: {
                                id: true,
                                name_th: true, // Fetch Thai name
                                name_en: true, // Fetch English name
                            }
                        },
                        amphoe: {
                            select: {
                                id: true,
                                name_th: true, // Fetch Thai name
                                name_en: true, // Fetch English name
                            }
                        },
                        tambon: {
                            select: {
                                id: true,
                                name_th: true, // Fetch Thai name
                                name_en: true, // Fetch English name
                            }
                        }
                    }
                }
            }
        });

        // If user not found, return 404
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return the user data with a 200 status code
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    const { id } = params;
    const { action } = await req.json();
  
    if (action === 'approve') {
      await prisma.Users.update({
        where: { id: Number(id) },
        data: { role: 'เกษตรกร' },
      });
    }
  
    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
      status: 200,
    });
  }
