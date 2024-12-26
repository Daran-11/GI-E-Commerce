import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ดึงรายการ IDs ของ users ที่เป็น farmer แล้ว
    const farmerIds = await prisma.user.findMany({
      where: { role: 'farmer' },
      select: { id: true }
    });
    
    const farmerIdList = farmerIds.map(u => u.id);

    // ดึงข้อมูล users ที่ยังไม่ได้เป็น farmer
    const users = await prisma.user.findMany({
      where: {
        role: 'customer',
        Farmer: {
          some: {} // มีข้อมูลในตาราง Farmer
        },
        NOT: {
          id: { in: farmerIdList } // ไม่เอาที่เป็น farmer แล้ว
        }
      },
      include: {
        Farmer: {
          select: {
            farmerName: true,
            address: true,
            sub_district: true,
            district: true,
            province: true,
            zip_code: true,
            phone: true,
            contactLine: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // จัดรูปแบบข้อมูลก่อนส่งกลับ
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      Farmer: user.Farmer[0] // เลือกข้อมูล Farmer อันแรก
    }));

    // ส่งข้อมูลกลับ
    return NextResponse.json(formattedUsers, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    
    // ส่ง error กลับ
    return NextResponse.json(
      {
        error: 'Failed to fetch users',
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        details: error.message
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
}

// สำหรับการค้นหา
function buildSearchQuery(searchQuery) {
  if (!searchQuery) return {};
  
  return {
    OR: [
      { email: { contains: searchQuery } },
      { name: { contains: searchQuery } },
      { phone: { contains: searchQuery } },
      {
        Farmer: {
          some: {
            farmerName: { contains: searchQuery }
          }
        }
      }
    ]
  };
}

// สำหรับการจัดการ response
function createResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
}

// สำหรับการจัดการ error
function handleError(error) {
  console.error('API Error:', error);
  
  let status = 500;
  let message = 'เกิดข้อผิดพลาดในการดำเนินการ';

  // จัดการ error ตามประเภท
  if (error.code === 'P2025') {
    status = 404;
    message = 'ไม่พบข้อมูลที่ต้องการ';
  } else if (error.code === 'P2002') {
    status = 400;
    message = 'ข้อมูลซ้ำในระบบ';
  }

  return createResponse(
    { error: true, message, details: error.message },
    status
  );
}