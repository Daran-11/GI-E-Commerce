// app/api/certificate/add/route.js
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";



export async function POST(request) {
  try {
    const formData = await request.formData();

    const userId = formData.get('userId');
    if (!userId) {
      throw new Error("User ID is not provided in the form data.");
    }

    const latitude = parseFloat(formData.get('latitude'));
    const longitude = parseFloat(formData.get('longitude'));
    
    if (!latitude || !longitude) {
      throw new Error("Invalid latitude or longitude values.");
    }


    const standards = [];
    for (let i = 0; formData.get(`standards[${i}][id]`); i++) {
      const standard = {
        id: parseInt(formData.get(`standards[${i}][id]`), 10),
        name: formData.get(`standards[${i}][name]`),
        logo: formData.get(`standards[${i}][logo]`),
        certNumber: formData.get(`standards[${i}][certNumber]`),
        certDate: formData.get(`standards[${i}][certDate]`),
      };
      standards.push(standard);
    }

    const farmer = await 
    ({
      where: {
        userId: parseInt(userId)
      }
    });
    
    
  
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
    }

    const certificateData = {
      type: formData.get('type'),
      variety: formData.get('variety'),
      latitude,
      longitude,
      productionQuantity: parseInt(formData.get('productionQuantity'), 10),
      standards: JSON.stringify(standards),
      status: 'รอตรวจสอบใบรับรอง',
      registrationDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Set expiry to 1 year from now
      user: {
        connect: { id: parseInt(farmer.id, 10) },
      },
      
    };



    const certificate = await prisma.certificate.create({
      data: certificateData,
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to add certificate:", error);
    return NextResponse.json(
      { error: "Failed to add certificate" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = parseInt(formData.get('id'), 10);

    const standards = [];
    for (let i = 0; formData.get(`standards[${i}][id]`); i++) {
      const standard = {
        id: parseInt(formData.get(`standards[${i}][id]`), 10),
        name: formData.get(`standards[${i}][name]`),
        logo: formData.get(`standards[${i}][logo]`),
        certNumber: formData.get(`standards[${i}][certNumber]`),
        certDate: formData.get(`standards[${i}][certDate]`),
      };
      standards.push(standard);
    }

    const updatedCertificate = await prisma.certificate.update({
      where: { id },
      data: {
        type: formData.get('type'),
        variety: formData.get('variety'),
        latitude: parseFloat(formData.get('latitude')),
        longitude: parseFloat(formData.get('longitude')),
        productionQuantity: parseInt(formData.get('productionQuantity'), 10),
        standards: JSON.stringify(standards),
        status: formData.get('status'),
      },
    });
    return NextResponse.json(updatedCertificate, { status: 200 });
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    await prisma.certificate.delete({
      where: { id: parseInt(id, 10) },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('UsersId'); // แก้ตรงนี้ให้รับ UsersId แทน userId
    const id = searchParams.get('id');

    console.log('Received UsersId:', userId); // เพิ่ม log เพื่อดูค่าที่รับมา

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }

    // ค้นหา farmer โดยใช้ UserId
    const farmer = await prisma.farmer.findFirst({ // เปลี่ยนเป็น findFirst
      where: {
        userId: parseInt(userId)
      }
    });

    console.log('Found farmer:', farmer); // เพิ่ม log เพื่อดูผลการค้นหา farmer

    if (!farmer) {
      return NextResponse.json(
        { error: 'Farmer profile not found' }, 
        { status: 404 }
      );
    }

    // ถ้ามี id ให้ดึงใบรับรองเดียว
    if (id) {
      const certificate = await prisma.certificate.findUnique({
        where: { 
          id: parseInt(id)
        },
        include: {
          Users: true // เปลี่ยนการ include ให้เรียบง่ายขึ้น
        }
      });

      if (!certificate) {
        return NextResponse.json(
          { error: 'Certificate not found' }, 
          { status: 404 }
        );
      }

      return NextResponse.json(certificate);
    }

    // ดึงใบรับรองทั้งหมดของเกษตรกร
    const certificates = await prisma.certificate.findMany({
      where: {
        farmerId: farmer.id
      },
      include: {
        Users: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found certificates:', certificates); // เพิ่ม log เพื่อดูผลลัพธ์

    return NextResponse.json(certificates);

  } catch (error) {
    console.error("Error in GET certificate:", error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch certificates', 
        details: error.message,
        stack: error.stack // เพิ่ม stack trace เพื่อดูรายละเอียดข้อผิดพลาด
      }, 
      { status: 500 }
    );
  }
}
// สำหรับการสร้างใบรับรองใหม่
const createCertificate = async (formData, farmerId) => {
  const standards = [];
  for (let i = 0; formData.get(`standards[${i}][id]`); i++) {
    standards.push({
      id: parseInt(formData.get(`standards[${i}][id]`)),
      name: formData.get(`standards[${i}][name]`),
      logo: formData.get(`standards[${i}][logo]`),
      certNumber: formData.get(`standards[${i}][certNumber]`),
      certDate: formData.get(`standards[${i}][certDate]`)
    });
  }

  return await prisma.certificate.create({
    data: {
      type: formData.get('type'),
      variety: formData.get('variety'),
      latitude: parseFloat(formData.get('latitude')),
      longitude: parseFloat(formData.get('longitude')),
      productionQuantity: parseInt(formData.get('productionQuantity')),
      registrationDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: 'รอตรวจสอบใบรับรอง',
      standards: JSON.stringify(standards),
      farmerId: farmerId
    }
  });
};