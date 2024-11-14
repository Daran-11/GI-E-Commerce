import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();

  try {
    // ดึงข้อมูลจากตาราง Farmer ก่อน
    const farmers = await prisma.farmer.findMany({
      select: {
        userId: true,
        farmerName: true,
        address: true,
        sub_district: true,
        district: true,
        province: true,
        zip_code: true,
        phone: true,
        contactLine: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          }
        }
      },
      where: {
        user: {
          role: 'customer'
        }
      },
      orderBy: {
        user: {
          createdAt: 'desc'
        }
      }
    });

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    const formattedUsers = farmers.map(farmer => ({
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
    }));

    return new Response(JSON.stringify(formattedUsers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch users',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
