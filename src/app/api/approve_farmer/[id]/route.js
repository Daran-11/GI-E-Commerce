import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

// Utility function สำหรับ validate user ID
const validateUserId = (id) => {
 const parsedId = Number(id);
 if (isNaN(parsedId) || parsedId <= 0) {
   throw new Error('รหัสผู้ใช้ไม่ถูกต้อง');
 }
 return parsedId;
};

// GET endpoint
export async function GET(request, { params }) {
 try {
   const userId = validateUserId(params.id);

   const user = await prisma.user.findFirst({
     where: { 
       id: userId,
       role: 'customer',
       Farmer: {
         some: {}
       }
     },
     include: {
       Farmer: {
         select: {
           farmerName: true,
           address: true,
           sub_district: true,
           district: true,
           province: true,
           zip_code: true,
           phone: true,
           contactLine: true
         }
       }
     }
   });

   if (!user) {
     return NextResponse.json(
       { message: 'ไม่พบข้อมูลผู้ใช้หรือคำขอถูกอนุมัติไปแล้ว' },
       { status: 404 }
     );
   }

   const formattedUser = {
     id: user.id,
     email: user.email,
     name: user.name,
     phone: user.phone,
     role: user.role,
     Farmer: user.Farmer[0]
   };

   return NextResponse.json(formattedUser, {
     headers: {
       'Cache-Control': 'no-store, must-revalidate',
       'Pragma': 'no-cache'
     }
   });

 } catch (error) {
   console.error('GET Error:', error);
   return NextResponse.json(
     { 
       message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
       error: error.message 
     },
     { status: error.message === 'รหัสผู้ใช้ไม่ถูกต้อง' ? 400 : 500 }
   );
 }
}

// PUT endpoint สำหรับอนุมัติคำขอ
export async function PUT(request, { params }) {
 try {
   const userId = validateUserId(params.id);

   // ตรวจสอบว่า user มีสถานะถูกต้องหรือไม่
   const existingUser = await prisma.user.findFirst({
     where: {
       id: userId,
       role: 'customer',
       Farmer: {
         some: {}
       }
     }
   });

   if (!existingUser) {
     return NextResponse.json(
       { message: 'ไม่พบข้อมูลผู้ใช้หรือคำขอถูกอนุมัติไปแล้ว' },
       { status: 404 }
     );
   }

   // ดำเนินการอัพเดทสถานะ
   const updatedUser = await prisma.$transaction(async (tx) => {
     // อัพเดทสถานะผู้ใช้เป็น farmer
     const user = await tx.user.update({
       where: { id: userId },
       data: { role: 'farmer' },
       include: {
         Farmer: {
           select: {
             farmerName: true,
             address: true,
             sub_district: true,
             district: true,
             province: true,
             zip_code: true,
             phone: true,
             contactLine: true
           }
         }
       }
     });

     return user;
   });

   const formattedUser = {
     id: updatedUser.id,
     email: updatedUser.email,
     name: updatedUser.name,
     phone: updatedUser.phone,
     role: updatedUser.role,
     Farmer: updatedUser.Farmer[0]
   };

   return NextResponse.json(formattedUser, {
     headers: {
       'Cache-Control': 'no-store, must-revalidate',
       'Pragma': 'no-cache'
     }
   });

 } catch (error) {
   console.error('PUT Error:', error);
   return NextResponse.json(
     { 
       message: 'เกิดข้อผิดพลาดในการอนุมัติคำขอ',
       error: error.message 
     },
     { status: error.message === 'รหัสผู้ใช้ไม่ถูกต้อง' ? 400 : 500 }
   );
 }
}