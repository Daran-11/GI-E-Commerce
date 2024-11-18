import { PrismaClient } from '@prisma/client';

// สำหรับดึงข้อมูลผู้ใช้รายเดียว
export async function GET(request, { params }) {
  const prisma = new PrismaClient();
  const { id } = params;

  try {
    // ดึงข้อมูลจากตาราง Farmer ก่อน
    const farmer = await prisma.farmer.findFirst({
      where: {
        userId: Number(id)
      },
      include: {
        user: true
      }
    });

    if (!farmer) {
      return new Response(JSON.stringify({ message: 'ไม่พบข้อมูลผู้ใช้' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    const formattedUser = {
      id: farmer.user.id,
      name: farmer.user.name,
      email: farmer.user.email,
      phone: farmer.user.phone,
      role: farmer.user.role,
      Farmer: {
        farmerName: farmer.farmerName,
        address: farmer.address,
        sub_district: farmer.sub_district,
        district: farmer.district,
        province: farmer.province,
        zip_code: farmer.zip_code,
        phone: farmer.phone,
        contactLine: farmer.contactLine,
      }
    };

    return new Response(JSON.stringify(formattedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

// สำหรับอัพเดทสถานะเป็นเกษตรกร
export async function PUT(request, { params }) {
  const prisma = new PrismaClient();
  const { id } = params;

  try {
    // อัพเดทสถานะผู้ใช้เป็นเกษตรกร
    const user = await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: {
        role: 'farmer'
      }
    });

    // ดึงข้อมูล Farmer หลังจากอัพเดทสถานะ
    const farmer = await prisma.farmer.findFirst({
      where: {
        userId: Number(id)
      },
      include: {
        user: true
      }
    });

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    const formattedUser = {
      id: farmer.user.id,
      name: farmer.user.name,
      email: farmer.user.email,
      phone: farmer.user.phone,
      role: farmer.user.role,
      Farmer: {
        farmerName: farmer.farmerName,
        address: farmer.address,
        sub_district: farmer.sub_district,
        district: farmer.district,
        province: farmer.province,
        zip_code: farmer.zip_code,
        phone: farmer.phone,
        contactLine: farmer.contactLine,
      }
    };

    return new Response(JSON.stringify(formattedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}