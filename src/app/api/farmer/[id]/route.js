import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // ดึงข้อมูลชาวนาจากฐานข้อมูลโดยใช้ ID
    const farmer = await prisma.manage_farmer.findUnique({
      where: { id: Number(id) }, // เปลี่ยน id ให้เป็น Number
      select: {
        firstName: true,
        lastName: true,
        // เพิ่ม fields อื่น ๆ ที่คุณต้องการดึงข้อมูล
      },
    });

    if (farmer) {
      return new Response(JSON.stringify(farmer), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "ไม่พบชาวนา" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching farmer:", error);
    return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }), { status: 500 });
  }
}
