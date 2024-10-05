import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

// Get all products for a specific farmer or a single product by ProductID
export async function GET(request, { params }) {
    const session = await getServerSession({ request, ...authOptions });
    const { searchParams } = new URL(request.url);
    const ProductID = searchParams.get("ProductID");
    const { userId } = params;

    // console.log('Session for receiving product info:', session); // Debug session
    // console.log('User ID:', session?.user?.id); // Debug user ID

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const farmer = await prisma.farmer.findUnique({
        where: { userId: parseInt(userId) }
    });

    if (!farmer) {
        return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
    }

    if (ProductID) {
        // Fetching a single product by ProductID
        try {
            const product = await prisma.product.findUnique({
                where: {
                    isDeleted: false,
                    ProductID: parseInt(ProductID, 10),
                    farmer: {
                        userId: parseInt(userId),
                    },
                },
                include: { images: true }, // Include related images
            });

            console.log("Get product Id:", ProductID);
            if (product) {
                return NextResponse.json(product);
            } else {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            return NextResponse.json({ error: "Error fetching product" }, { status: 500 });
        }
    } else {
        // Fetching products with optional search query, sort order, and pagination
        const query = searchParams.get("query") || ""; // Get the search query
        const sortOrder = searchParams.get("sortOrder") || "asc"; // Sort order (default to ascending)
        const page = parseInt(searchParams.get("page")) || 1; // Current page
        const pageSize = parseInt(searchParams.get("pageSize")) || 10; // Number of items per page

        try {
            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where: {
                        isDeleted: false,
                        farmer: {
                            userId: parseInt(userId),
                        },
                        OR: [
                            {
                                ProductName: {
                                    contains: query, // Case-insensitive search
                                },
                            },
                            {
                                ProductType: {
                                    contains: query, // Case-insensitive search
                                },
                            },
                        ],
                    },
                    orderBy: {
                        DateCreated: sortOrder, // Sort based on creation date
                    },
                    skip: (page - 1) * pageSize, // Offset for pagination
                    take: pageSize, // Limit the number of items per page
                    include: { images: true }, // Include related images
                }),
                prisma.product.count({
                    where: {
                        isDeleted: false,
                        farmer: {
                            userId: parseInt(userId),
                        },
                        OR: [
                            {
                                ProductName: {
                                    contains: query, // Case-insensitive search
                                },
                            },
                            {
                                ProductType: {
                                    contains: query, // Case-insensitive search
                                },
                            },
                        ],
                    },
                }),
            ]);

            return NextResponse.json({ products, total });
        } catch (error) {
            console.error("Error fetching products:", error);
            return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
        }
    }
}
