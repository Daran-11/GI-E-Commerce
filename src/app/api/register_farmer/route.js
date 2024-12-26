import { PrismaClient } from '@prisma/client';

export async function POST(request) {
  const prisma = new PrismaClient();

  try {
    const {
      farmerName,
      address,
      sub_district,
      district,
      province,
      zip_code,
      phone,
      contactLine,
      userId,
    } = await request.json();

    // Validate the input data
    if (
      !farmerName ||
      !address ||
      !sub_district ||
      !district ||
      !province ||
      !zip_code ||
      !phone ||
      !contactLine ||
      !userId
    ) {
      return new Response(JSON.stringify({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return new Response(JSON.stringify({ message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const zip_codeRegex = /^[0-9]{5}$/;
    if (!zip_codeRegex.test(zip_code)) {
      return new Response(JSON.stringify({ message: 'กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (ตัวเลข 5 หลัก)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if farmer already exists for this userId
    const existingFarmer = await prisma.farmer.findUnique({
      where: {
        userId: userId,
      },
    });

    if (existingFarmer) {
      return new Response(JSON.stringify({ message: 'ผู้ใช้นี้ได้ลงทะเบียนเป็นเกษตรกรแล้ว' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the farmer name already exists in farmer table
    const existingFarmerName = await prisma.farmer.findFirst({
      where: {
        farmerName: farmerName,
      },
    });

    if (existingFarmerName) {
      return new Response(JSON.stringify({ message: 'ชื่อเกษตรกรนี้มีในระบบแล้ว กรุณาตรวจสอบข้อมูล' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the farmer name exists in manage_farmer table
    const approvedFarmer = await prisma.manage_farmer.findFirst({
      where: {
        farmerNameApprove: farmerName,
      },
    });

    if (!approvedFarmer) {
      return new Response(JSON.stringify({ 
        message: 'ไม่พบข้อมูลของผู้ใช้ในฐานข้อมูลของเทศบาล โปรดติดต่อเทศบาล',
        status: 'not_found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If farmer is found in manage_farmer and name is not duplicate, create new farmer record
    const farmer = await prisma.farmer.create({
      data: {
        farmerName,
        address,
        sub_district,
        district,
        province,
        zip_code,
        phone,
        contactLine,
        userId,
      },
    });

    // Update user role to farmer
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'farmer' }
    });

    return new Response(JSON.stringify({
      message: 'สมัครเป็นเกษตรกรสำเร็จ',
      data: farmer
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}