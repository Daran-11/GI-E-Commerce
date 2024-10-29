import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const formData = await request.formData();

    const UsersId = formData.get('UsersId');
    if (!UsersId) {
      throw new Error("Users ID is not provided in the form data.");
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
      Users: {
        connect: { id: parseInt(UsersId, 10) },
      },
    };

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

  try {
    if (id) {
      const certificate = await prisma.certificate.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          Users: {
            select: {
              name: true
            }
          }
        }
      });
      return NextResponse.json(certificate);
    } else if (UsersId) {
      const certificates = await prisma.certificate.findMany({
        where: {
          UsersId: parseInt(UsersId, 10)
        },
        include: {
          Users: {
            select: {
              name: true
            }
          }
        }
      });
      return NextResponse.json(certificates);
    } else {
      return NextResponse.json({ error: "Either id or UsersId is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Error fetching certificates" }, { status: 500 });
  }
}