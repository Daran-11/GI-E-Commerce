// app/api/register_farmer/route.js

import { NextResponse } from "next/server";
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    // รับข้อมูลจาก request body
    const {
      title,
      name,
      lastname,
      address,
      subDistrict,
      district,
      province,
      zipCode,
      phone,
      contactLine,
    } = await request.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !name || !lastname || !address || !subDistrict || 
        !district || !province || !zipCode || !phone || !contactLine) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // ตรวจสอบรูปแบบเบอร์โทร
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)" },
        { status: 400 }
      );
    }

    // ตรวจสอบรูปแบบรหัสไปรษณีย์
    const zipCodeRegex = /^[0-9]{5}$/;
    if (!zipCodeRegex.test(zipCode)) {
      return NextResponse.json(
        { message: "กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (ตัวเลข 5 หลัก)" },
        { status: 400 }
      );
    }

    // บันทึกข้อมูลลงฐานข้อมูล
    const farmer = await prisma.farmer.create({
      data: {
        title,
        name,
        lastname,
        address,
        sub_district: subDistrict,
        district,
        province,
        zip_code: zipCode,
        phone,
        contact_line: contactLine,
      },
    });

    return NextResponse.json(
      { 
        message: "ลงทะเบียนเกษตรกรสำเร็จ",
        data: farmer 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลงทะเบียนเกษตรกร:", error);
    
    // ตรวจสอบ Prisma error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: "ข้อมูลนี้มีอยู่ในระบบแล้ว" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "เกิดข้อผิดพลาดในการลงทะเบียน",
        error: error.message 
      },
      { status: 500 }
    );
  }
}