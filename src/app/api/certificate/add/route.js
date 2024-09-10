// app/api/certificate/add/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { id: parseInt(id, 10) },
        include: { farmer: true },
      });
      if (certificate) {
        return NextResponse.json(certificate);
      } else {
        return NextResponse.json(
          { error: "Certificate not found" },
          { status: 404 },
        );
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      return NextResponse.json(
        { error: "Error fetching certificate" },
        { status: 500 },
      );
    }
  } else {
    // Existing GET method for fetching all certificates
    try {
      const certificates = await prisma.certificate.findMany({
        include: { farmer: true },
      });
      return NextResponse.json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return NextResponse.json(
        { error: "Error fetching certificates" },
        { status: 500 },
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
        imageUrl: data.imageUrl,
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
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const updatedCertificate = await prisma.certificate.update({
      where: { id: parseInt(data.id, 10) },
      data: {
        variety: data.variety,
        plotCode: data.plotCode,
        registrationDate: new Date(data.registrationDate),
        expiryDate: new Date(data.expiryDate),
        status: data.status,
        imageUrl: data.imageUrl,
        farmer: {
          connect: { id: parseInt(data.farmerId, 10) }, // Convert farmerId to integer
        },
      },
    });
    return NextResponse.json(updatedCertificate, { status: 200 });
  } catch (error) {
    console.error("Failed to update certificate:", error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 },
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
      { status: 500 },
    );
  }
}
