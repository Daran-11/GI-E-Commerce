import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const formData = await request.formData();

    // รับค่า farmerId จาก formData
    const farmerId = formData.get('farmerId');
    if (!farmerId) {
      throw new Error("Farmer ID is not provided in the form data.");
    }

    // ตรวจสอบและเก็บค่าพิกัด
    const latitude = parseFloat(formData.get('latitude'));
    const longitude = parseFloat(formData.get('longitude'));
    
    if (!latitude || !longitude) {
      throw new Error("Invalid latitude or longitude values.");
    }

    // จัดการข้อมูลจากฟอร์ม
    const certificateData = {
      type: formData.get('type'),
      variety: formData.get('variety'),
      plotCode: formData.get('plotCode'),
      latitude,
      longitude,
      productionQuantity: parseInt(formData.get('productionQuantity'), 10),
      hasGAP: formData.get('hasGAP') === 'true',  // รับค่าเป็น boolean
      hasGI: formData.get('hasGI') === 'true',    // รับค่าเป็น boolean
      status: 'รอตรวจสอบใบรับรอง',  // ค่าเริ่มต้นของสถานะ
      registrationDate: new Date(),
      expiryDate: new Date(),  // ค่าเริ่มต้นของวันหมดอายุ (สามารถแก้ไขได้)
      farmer: {
        connect: { id: parseInt(farmerId, 10) },
      },
    };

    // สร้างใบรับรองใหม่ในฐานข้อมูล
    const certificate = await prisma.certificate.create({
      data: certificateData,
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Error adding certificate:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function PUT(request) {
  try {
    const data = await request.json();

    const updatedCertificate = await prisma.certificate.update({
      where: { id: parseInt(data.id, 10) },
      data: {
        type: data.type,
        variety: data.variety,
        plotCode: data.plotCode,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        productionQuantity: parseFloat(data.productionQuantity),
        hasCertificate: data.hasCertificate,
        imageUrl: data.hasCertificate ? data.imageUrl : null,
        status: data.status,
        farmer: {
          connect: { id: parseInt(data.farmerId, 10) }, // Connect farmer by id
        },
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
    const { searchParams, href } = new URL(request.url);

    console.log("Request URL:", href);
    const id = searchParams.get("id");

    if (!id) {
      console.warn("No 'id' provided in the URL query string:", href);
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
  const { searchParams } = new URL(request.url);
  const farmerId = searchParams.get('farmerId');

  if (!farmerId) {
    return NextResponse.json({ error: "Farmer ID is required" }, { status: 400 });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      where: {
        farmerId: parseInt(farmerId, 10)
      },
      include: {
        farmer: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Error fetching certificates" }, { status: 500 });
  }
}