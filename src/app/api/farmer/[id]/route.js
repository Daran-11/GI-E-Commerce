import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { name } = params; // Use name instead of id

  try {
    // Fetch the manage_farmer and related Users data by Users's name
    const UsersData = await prisma.manage_farmer.findFirst({
      where: {
        Users: {
          name: name, // Check the Users's name
        },
      },
      include: {
        Users: {
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

    if (UsersData) {
      return new Response(JSON.stringify(UsersData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "ไม่พบเกษตร" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching Users data:", error);
    return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }), { status: 500 });
  }
}
