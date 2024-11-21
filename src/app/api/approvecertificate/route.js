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
        include: {
          Users: {
            select: {
              id: true,
              farmerName: true,
              address: true,
              sub_district: true,
              district: true,
              province: true,
              zip_code: true,
              phone: true,
              contactLine: true,
            },
          },
        },
      });

      if (!certificate) {
        return NextResponse.json(
          { error: "ไม่พบข้อมูลใบรับรอง" },
          { status: 404 }
        );
      }

      if (certificate.status !== "รอตรวจสอบใบรับรอง") {
        return NextResponse.json(
          {
            error: `ใบรับรองนี้มีสถานะเป็น ${certificate.status} ไม่สามารถดำเนินการต่อได้`,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(certificate);
    } catch (error) {
      console.error("Error fetching certificate:", error);
      return NextResponse.json(
        {
          error: "เกิดข้อผิดพลาดในการดึงข้อมูลใบรับรอง",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } else {
    try {
      const certificates = await prisma.certificate.findMany({
        where: {
          status: "รอตรวจสอบใบรับรอง",
        },
        include: {
          Users: {
            select: {
              id: true,
              farmerName: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการดึงข้อมูลรายการใบรับรอง" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Validate required fields
    const requiredFields = [
      "type",
      "variety",
      "productionQuantity",
      "registrationDate",
      "expiryDate",
      "UsersId",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `กรุณาระบุข้อมูล ${field}` },
          { status: 400 }
        );
      }
    }

    const certificateData = {
      type: data.type,
      variety: data.variety,
      plotCode: data.plotCode,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      productionQuantity: parseInt(data.productionQuantity, 10),
      standards: data.standards ? JSON.parse(data.standards) : [],
      registrationDate: new Date(data.registrationDate),
      expiryDate: new Date(data.expiryDate),
      status: "รอตรวจสอบใบรับรอง",
      farmerId: parseInt(data.UsersId, 10),
    };

    const certificate = await prisma.certificate.create({
      data: certificateData,
      include: {
        Users: true,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to add certificate:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเพิ่มใบรับรอง", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const action = formData.get("action");
    const municipalComment = formData.get("municipalComment");

    if (!id || !action) {
      return NextResponse.json(
        { error: "กรุณาระบุข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const status =
      action === "อนุมัติ" ? "ได้รับการรับรอง" : "ไม่ผ่านการรับรอง";

    if (status === "ไม่ผ่านการรับรอง" && !municipalComment) {
      return NextResponse.json(
        { error: "กรุณาระบุเหตุผลในการไม่อนุมัติ" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลใบรับรองเดิม
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id, 10) },
      include: { Users: true },
    });

    if (!existingCertificate) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลใบรับรอง" },
        { status: 404 }
      );
    }

    if (existingCertificate.status !== "รอตรวจสอบใบรับรอง") {
      return NextResponse.json(
        { error: "ไม่สามารถอัปเดตใบรับรองที่ดำเนินการไปแล้ว" },
        { status: 400 }
      );
    }

    // อัพเดทใบรับรอง
    const updatedCertificate = await prisma.certificate.update({
      where: { id: parseInt(id, 10) },
      data: {
        status,
        municipalComment,
        updatedAt: new Date(),
      },
      include: { Users: true },
    });

    if (action === "อนุมัติ") {
      // Get farmer details
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
          phone: true,
        },
      });

      if (!farmer) {
        return NextResponse.json(
          { error: "ไม่พบข้อมูลเกษตรกร" },
          { status: 404 }
        );
      }

      // สร้าง Product_ID
      const farmerIdPadded = farmer.id.toString().padStart(3, "0");
      const typePrefix = updatedCertificate.type === "สับปะรด" ? "P" : "";
      const varietyCode =
        updatedCertificate.variety === "นางแล"
          ? "N"
          : updatedCertificate.variety === "ภูแล"
          ? "P"
          : "";
      const certificateIdPadded = updatedCertificate.id
        .toString()
        .padStart(4, "0");
      const productId = `${farmerIdPadded}${typePrefix}${varietyCode}${certificateIdPadded}`;

      // สร้างที่อยู่เต็ม
      const fullAddress = `${farmer.address} ${farmer.sub_district} ${farmer.district} ${farmer.province} ${farmer.zip_code}`;

      // สร้าง QR Code โดยใช้ standards โดยตรงจาก Certificate
      await prisma.qR_Code.create({
        data: {
          Product_ID: productId,
          Type: updatedCertificate.type,
          Variety: updatedCertificate.variety,
          ProductionQuantity: updatedCertificate.productionQuantity,
          Standard: updatedCertificate.standards, // ใช้ค่าโดยตรง ไม่ต้อง stringify ซ้ำ
          Address: fullAddress,
          Phone: farmer.phone,
          farmerName: farmer.farmerName,
          farmerId: farmer.id,
          Latitude: updatedCertificate.latitude,
          Longitude: updatedCertificate.longitude,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        action === "อนุมัติ"
          ? "อนุมัติใบรับรองเรียบร้อยแล้ว"
          : "ปฏิเสธใบรับรองเรียบร้อยแล้ว",
      certificate: updatedCertificate,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดำเนินการ", details: error.message },
      { status: 500 }
    );
  }
}
