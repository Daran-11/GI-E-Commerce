import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { name } = params; // Use name instead of id

  try {
    // Fetch the manage_farmer and related Farmer data by Farmer's name
    const farmerData = await prisma.manage_farmer.findFirst({
      where: {
        farmer: {
          name: name, // Check the farmer's name
        },
      },
      include: {
        farmer: {
          select: {
            name: true,
            lastname: true,
          },
        },
        certificates: {  // Include the related certificate details
          select: {
            standardName: true,  // ชื่อมาตรฐาน (Standard Name)
            certificateNumber: true,  // หมายเลขใบรับรอง (Certificate Number)
            approvalDate: true,  // วันที่อนุมัติ (Approval Date)
          },
        },
      },
    });

    if (farmerData) {
      return new Response(JSON.stringify(farmerData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "ไม่พบเกษตร" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching farmer data:", error);
    return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }), { status: 500 });
  }
}
