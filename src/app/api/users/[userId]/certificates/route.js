import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(req, { params }) {
    try {
        // Retrieve the user session to validate authentication

        const { userId } = params;
        console.log("userId is ", userId)

        // Fetch the farmer using the userId from the params
        const farmer = await prisma.farmer.findUnique({
            where: { userId: parseInt(userId) },
            select: {
                id: true,  // Make sure to select the id to use it in the next query
            },
        });

        // Check if the farmer exists
        if (!farmer) {
            return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
        }

        // Fetch the farmer's certificates
        const certificates = await prisma.certificate.findMany({
            where: {
                farmerId: farmer.id,
                status: "อนุมัติ",
            },
            select: {
                id: true,
                standards: true,
            },
        });

        // Return the certificates data as JSON
        return NextResponse.json(certificates);
    } catch (error) {
        console.error("Error fetching farmer certificates:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}