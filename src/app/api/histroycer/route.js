import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const VALID_STATUSES = ["ได้รับการรับรอง", "ไม่ผ่านการรับรอง", "หมดอายุ"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    try {
      const certificate = await prisma.certificate.findFirst({
        where: { 
          id: parseInt(id, 10),
          status: { in: VALID_STATUSES }
        },
        include: { Users: true },
      });
      if (certificate) {
        return NextResponse.json(certificate);
      } else {
        return NextResponse.json(
          { error: "Certificate not found or not in valid status" },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      return NextResponse.json(
        { error: "Error fetching certificate" },
        { status: 500 }
      );
    }
  } else {
    // Fetching all certificates with valid statuses
    try {
      const certificates = await prisma.certificate.findMany({
        where: {
          status: { in: VALID_STATUSES }
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
    const data = await request.json();
    const certificate = await prisma.certificate.create({
      data: {
        variety: data.variety,
        plotCode: data.plotCode,
        registrationDate: new Date(data.registrationDate),
        expiryDate: new Date(data.expiryDate),
        status: data.status,
        municipalComment: data.municipalComment || null, // Add municipalComment field
        Users: {
          connect: { id: parseInt(data.UsersId, 10) }, // Convert farmerId to integer
        },
      },
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
    console.log("Received PUT request");
    
    // Check content type
    const contentType = request.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle multipart/form-data
      const formData = await request.formData();
      data = Object.fromEntries(formData);
    } else {
      // Handle JSON
      const bodyText = await request.text();
      data = JSON.parse(bodyText);
    }

    console.log("Parsed data:", data);

    const { id, action, municipalComment } = data;

    if (!id || !action) {
      return NextResponse.json({ error: "Missing required fields", received: { id, action } }, { status: 400 });
    }

    let status;

    if (action === "อนุมัติ") {
      status = "อนุมัติ";
    } else if (action === "ไม่อนุมัติ") {
      status = "ไม่อนุมัติ";
      if (!municipalComment) {
        return NextResponse.json({ error: "Comment is required for rejection" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid action", received: action }, { status: 400 });
    }

    const updatedCertificate = await prisma.certificate.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        municipalComment,
      },
    });

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
    const { searchParams, href } = new URL(request.url);

    console.log("Request URL:", href); // Log the entire URL
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
