import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const VALID_STATUSES = ["อนุมัติ", "ไม่อนุมัติ", "หมดอายุ"];

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
        include: { farmer: true },
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
        include: { farmer: true },
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
        farmer: {
          connect: { id: parseInt(data.farmerId, 10) }, // Convert farmerId to integer
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
    const formData = await request.formData();
    console.log("Received formData:", Object.fromEntries(formData));

    let id = formData.get('id');
    let action = formData.get('action');
    let comment = formData.get('comment');

    console.log("Initial values:", { id, action, comment });

    // Backwards compatibility: If action is not provided, assume it's an approval
    if (!action && formData.get('type')) {
      action = "อนุมัติ";
      id = formData.get('id');
      comment = `Approved: ${formData.get('plotCode')} -${formData.get('type')} - ${formData.get('variety')}`;
      console.log("Backwards compatibility applied:", { id, action, comment });
    }

    if (!id || !action) {
      console.log("Missing required fields:", { id, action });
      return NextResponse.json({ error: "Missing required fields", received: { id, action } }, { status: 400 });
    }

    let status;
    let municipalComment = null;

    console.log("Processing action:", action);

    if (action === "อนุมัติ") {
      status = "อนุมัติ";
      municipalComment = comment || "อนุมัติ";
    } else if (action === "ไม่อนุมัติ") {
      status = "ไม่อนุมัติ";
      if (!comment) {
        console.log("Missing comment for rejection");
        return NextResponse.json({ error: "Comment is required for rejection" }, { status: 400 });
      }
      municipalComment = comment;
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
