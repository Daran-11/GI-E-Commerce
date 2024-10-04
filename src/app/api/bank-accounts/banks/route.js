import prisma from "../../../../../lib/prisma";

export async function GET() {
    const banks = await prisma.bank.findMany(); // ดึงข้อมูลธนาคารทั้งหมด
    return new Response(JSON.stringify(banks), { status: 200 });
  }