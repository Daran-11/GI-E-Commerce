import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
export async function POST(request) {
  try {
    const data = await request.json(); // เปลี่ยนจาก formData เป็น json

    const userId = data.userId;
    if (!userId) {
      throw new Error("Users ID is not provided.");
    }

    const { latitude, longitude } = data;
    if (!latitude || !longitude) {
      throw new Error("Invalid latitude or longitude values.");
    }

    const farmer = await prisma.farmer.findUnique({
      where: {
        userId: parseInt(userId)
      }
    });

    if (!farmer) {
      return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
    }

    const certificateData = {
      type: data.type,
      variety: data.variety,
      latitude,
      longitude,
      productionQuantity: parseInt(data.productionQuantity, 10),
      standards: JSON.stringify(data.standards),
      status: 'รอตรวจสอบใบรับรอง',
      registrationDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      Users: {
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
      { error: error.message || "Failed to add certificate" },
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
  const { searchParams } = new URL(request.url);
  const UsersId = searchParams.get('UsersId');
  const id = searchParams.get('id');

  if(!UsersId) {
    console.log("no UsersId");
  }

  const farmer = await prisma.farmer.findUnique({
    where: {
      userId: parseInt(UsersId)
    }
  });
  
  

  if (!farmer) {
    return NextResponse.json({ error: 'Farmer profile not found for this user' }, { status: 404 });
  }

  try {
    if (id) {
      const certificate = await prisma.certificate.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          Users: {
            select: {
              farmerName: true
            }
          }
        }
      });
      return NextResponse.json(certificate);
    } else if (UsersId) {
      const certificates = await prisma.certificate.findMany({
        where: {
          farmerId: parseInt(farmer.id, 10)
        },
        include: {
          Users: {
            select: {
              farmerName: true
            }
          }
        }
      });
      return NextResponse.json(certificates);
    } else {
      console.error("Error fetching certificates:", error);
    }
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Error fetching certificates" }, { status: 500 });
  }
}