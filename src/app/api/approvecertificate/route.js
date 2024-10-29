import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  console.log("Received GET request with id:", id);

  if (id) {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { 
          id: parseInt(id, 10),
        },
        include: { Users: true },
      });
      
      console.log("Found certificate:", certificate);

      if (certificate) {
        if (certificate.status === "รอตรวจสอบใบรับรอง") {
          return NextResponse.json(certificate);
        } else {
          return NextResponse.json(
            { error: `Certificate found but status is ${certificate.status}` },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Certificate not found" },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      return NextResponse.json(
        { error: "Error fetching certificate", details: error.message },
        { status: 500 }
      );
    }
  } else {
    try {
      const certificates = await prisma.certificate.findMany({
        where: {
          status: "รอตรวจสอบใบรับรอง"
        },
        include: { Users: true },
      });
      return NextResponse.json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return NextResponse.json(
        { error: "Error fetching certificates" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const certificateData = {
      type: data.type,
      variety: data.variety,
      plotCode: data.plotCode,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      productionQuantity: parseInt(data.productionQuantity, 10),
      standards: data.standards ? JSON.parse(data.standards) : [],
      registrationDate: new Date(data.registrationDate),
      expiryDate: new Date(data.expiryDate),
      status: "รอตรวจสอบใบรับรอง",
      Users: {
        connect: { id: parseInt(data.UsersId, 10) },
      },
    };

    const certificate = await prisma.certificate.create({
      data: certificateData,
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to add certificate:", error);
    return NextResponse.json(
      { error: "Failed to add certificate", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    console.log("Received formData:", Object.fromEntries(formData));

    const id = formData.get('id');
    const action = formData.get('action');
    const municipalComment = formData.get('municipalComment');

    if (!id || !action) {
      console.log("Missing required fields:", { id, action });
      return NextResponse.json({ error: "Missing required fields", received: { id, action } }, { status: 400 });
    }

    let status;

    if (action === "อนุมัติ") {
      status = "อนุมัติ";
    } else if (action === "ไม่อนุมัติ") {
      status = "ไม่อนุมัติ";
      if (!municipalComment) {
        console.log("Missing comment for rejection");
        return NextResponse.json({ error: "Comment is required for rejection" }, { status: 400 });
      }
    } else {
      console.log("Invalid action:", action);
      return NextResponse.json({ error: "Invalid action", received: action }, { status: 400 });
    }

    console.log("Before database update:", { id, status, municipalComment });

    const updatedCertificate = await prisma.certificate.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        municipalComment,
      },
    });

    console.log("After database update:", updatedCertificate);
    return NextResponse.json(updatedCertificate, { status: 200 });
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return NextResponse.json(
      { error: "Failed to update certificate", details: error.message },
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