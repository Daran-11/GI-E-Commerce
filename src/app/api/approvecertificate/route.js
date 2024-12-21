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
        { error: "ไม่สามารถอัปเดตใบรับรองที่ดำเนินการไปแล้ว" },{ status: 400 }
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