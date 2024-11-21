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
        include: { Users: true },
      });
      
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
    const id = formData.get('id');
    const action = formData.get('action');
    const municipalComment = formData.get('municipalComment');

    if (!id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const status = action === "อนุมัติ" ? "อนุมัติ" : "ไม่อนุมัติ";
    
    if (status === "ไม่อนุมัติ" && !municipalComment) {
      return NextResponse.json({ error: "Comment is required for rejection" }, { status: 400 });
    }

    // Update certificate
    const updatedCertificate = await prisma.certificate.update({
      where: { id: parseInt(id, 10) },
      data: { status, municipalComment },
      include: { Users: true }
    });

    if (action === "อนุมัติ") {
      // Get farmer details with all required fields
      const farmer = await prisma.farmer.findUnique({
        where: { id: updatedCertificate.farmerId },
        select: {
          id: true,
          farmerName: true,
          address: true,
          sub_district: true,
          district: true,
          province: true,
          zip_code: true,
          phone: true
        }
      });

      if (!farmer) {
        return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
      }

      // Generate Product_ID components
      const farmerIdPadded = farmer.id.toString().padStart(3, '0');
      const typePrefix = updatedCertificate.type === 'สับปะรด' ? 'P' : '';
      const varietyCode = updatedCertificate.variety === 'นางแล' ? 'N' : 
                         updatedCertificate.variety === 'ภูแล' ? 'P' : '';
      const certificateIdPadded = updatedCertificate.id.toString().padStart(4, '0');
      
      // Create final Product_ID
      const productId = `${farmerIdPadded}${typePrefix}${varietyCode}${certificateIdPadded}`;

      // Create full address string
      const fullAddress = `${farmer.address} ${farmer.sub_district} ${farmer.district} ${farmer.province} ${farmer.zip_code}`;

      // Create QR Code record
      await prisma.qR_Code.create({
        data: {
          Product_ID: productId,
          Type: updatedCertificate.type,
          Variety: updatedCertificate.variety,
          ProductionQuantity: updatedCertificate.productionQuantity,
          Standard: JSON.stringify(updatedCertificate.standards),
          Address: fullAddress,
          Phone: farmer.phone,
          farmerName: farmer.farmerName,
          farmerId: farmer.id,
          Latitude: updatedCertificate.latitude,
          Longitude: updatedCertificate.longitude,
          createdAt: new Date(),
          updatedAt: updatedCertificate.updatedAt
        }
      });
    }

    return NextResponse.json(updatedCertificate);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}