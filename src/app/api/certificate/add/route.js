import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function handleFileUpload(file) {
  try {
    // Check if file exists
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Read the file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + path.extname(file.name);

    // Define the path where the file will be saved
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    // Write the file to the filesystem
    await writeFile(filepath, buffer);

    // Return the public URL of the file
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error in file upload:', error);
    throw error;
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();

    let imageUrl = formData.get('imageUrl');
    if (formData.get('hasCertificate') === 'มี' && imageUrl instanceof File) {
      imageUrl = await handleFileUpload(imageUrl);
    }

    const updatedCertificate = await prisma.certificate.update({
      where: { id: parseInt(formData.get('id'), 10) },
      data: {
        type: formData.get('type'),
        variety: formData.get('variety'),
        plotCode: formData.get('plotCode'),
        latitude: parseFloat(formData.get('latitude')),
        longitude: parseFloat(formData.get('longitude')),
        productionQuantity: parseInt(formData.get('productionQuantity'), 10),
        hasCertificate: formData.get('hasCertificate') === 'มี',
        imageUrl: formData.get('hasCertificate') === 'มี' ? imageUrl : null,
        status: formData.get('status') || 'pending',
        farmer: {
          connect: { id: parseInt(formData.get('farmerId'), 10) },
        },
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
        { status: 500 }
      );
    }
  }
}
