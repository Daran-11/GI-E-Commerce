import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name, email, phone, password } = await request.json();
    
    // ตรวจสอบว่าได้ข้อมูลครบถ้วนหรือไม่
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const farmer = await prisma.farmer.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'เกษตรกร',
      },
    });

    return NextResponse.json({ message: 'User created successfully', farmer: { id: farmer.id, name: farmer.name, email: farmer.email } }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error); // เพิ่มการพิมพ์ข้อผิดพลาดในคอนโซลเพื่อช่วยในการดีบัก
    return NextResponse.json({ message: 'Error creating user', error: error.message }, { status: 400 });
  }
}
