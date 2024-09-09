// register/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the request body
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
      password
    } = await request.json();

    // Validate input
    if (!title || !name || !lastname || !address || !subDistrict || !district || !province || !zipCode || !phone  || !password) {
      return NextResponse.json({ message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new farmer in the database
    const farmer = await prisma.farmer.create({
      data: {
        title, // Ensure that title is included here
        name,
        lastname,
        address,
        sub_district: subDistrict,
        district,
        province,
        zip_code: zipCode,
        phone,
        password: hashedPassword,
        role: 'ผู้ใช้'
      },
    });

    // Respond with success message
    return NextResponse.json({ message: 'User created successfully', farmer: { id: farmer.id, name: farmer.name } }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error); // Log error for debugging
    return NextResponse.json({ message: 'Error creating user', error: error.message }, { status: 400 });
  }
}