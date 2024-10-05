//completed
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prisma";

// GET API endpoint to fetch products
export async function GET(request, { params }) {
    const session = await getServerSession({ request, ...authOptions });
    const { searchParams } = new URL(request.url);
    const ProductID = searchParams.get("ProductID");
    const userId = Number(params.userId); // Ensure userId is a number

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user is authorized to access the farmer's products
    if (session.user.id !== userId && session.user.role !== "farmer") {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const farmer = await prisma.farmer.findUnique({
        where: { userId }
    });

    if (!farmer) {
        return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
    }

    try {
        if (ProductID) {
            // Fetching a single product by ProductID
            const product = await prisma.product.findUnique({
                where: {
                    ProductID: Number(ProductID),
                    isDeleted: false,
                    farmer: {
                        userId,
                    },
                },
                include: { images: true }, // Include related images
            });

            if (product) {
                return NextResponse.json(product); 
            } else {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }
        } else {
            // Fetching products with search, sorting, and pagination
            const query = searchParams.get("query") || ""; // Search query
            const sortOrder = searchParams.get("sortOrder") || "asc"; // Sort order (default: ascending)
            const page = Math.max(1, Number(searchParams.get("page")) || 1); // Ensure page is at least 1
            const pageSize = Math.min(Math.max(1, Number(searchParams.get("pageSize")) || 10), 100); // Limit pageSize to max of 100

            const [products, totalItems] = await Promise.all([
                prisma.product.findMany({
                    where: {
                        isDeleted: false,
                        farmer: {
                            userId,
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
                        DateCreated: sortOrder, // Sort by creation date
                    },
                    skip: (page - 1) * pageSize, // Pagination: Skip items
                    take: pageSize, // Pagination: Limit items per page
                    include: { images: true }, // Include related images
                }),
                prisma.product.count({
                    where: {
                        isDeleted: false,
                        farmer: {
                            userId,
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

            return NextResponse.json({ products, totalItems }); // Return products directly
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Error fetching products: " + error.message }, { status: 500 });
    }
}
