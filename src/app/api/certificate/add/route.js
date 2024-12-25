import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// POST - สร้างใบรับรองใหม่
export async function POST(request) {
 try {
   const data = await request.json();

   if (!data.userId) throw new Error("Users ID is required");
   if (!data.latitude || !data.longitude) throw new Error("Invalid coordinates");

   const farmer = await prisma.farmer.findFirst({
     where: {
       userId: parseInt(data.userId)
     }
   });

   if (!farmer) {
     return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
   }

   const certificateData = {
     type: data.type,
     variety: data.variety,
     latitude: data.latitude,
     longitude: data.longitude,
     productionQuantity: parseInt(data.productionQuantity),
     standards: JSON.stringify(data.standards),
     status: 'รอตรวจสอบใบรับรอง',
     registrationDate: new Date(),
     expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
     Users: {
       connect: { id: farmer.id },
     },
   };

   const certificate = await prisma.certificate.create({
     data: certificateData,
   });

   return NextResponse.json(certificate, { status: 201 });
 } catch (error) {
   console.error("Failed to add certificate:", error);
   return NextResponse.json(
     { error: error.message || "Failed to add certificate" },
     { status: 500 }
   );
 }
}

// PUT - อัปเดตใบรับรอง
export async function PUT(request) {
 try {
   const { searchParams } = new URL(request.url);
   const id = searchParams.get('id');
   const data = await request.json();

   const updatedCertificate = await prisma.certificate.update({
     where: { id: parseInt(id, 10) },
     data: {
       type: data.type,
       variety: data.variety,
       latitude: parseFloat(data.latitude),
       longitude: parseFloat(data.longitude),
       productionQuantity: parseInt(data.productionQuantity),
       standards: JSON.stringify(data.standards),
       status: "รอตรวจสอบใบรับรอง",
       municipalComment: ""
     },
   });
   return NextResponse.json(updatedCertificate, { status: 200 });
 } catch (error) {
   console.error("Failed to update certificate:", error);
   return NextResponse.json(
     { error: "Failed to update certificate" },
     { status: 500 }
   );
 }
}

// DELETE - ลบใบรับรอง
export async function DELETE(request) {
 try {
   const { searchParams } = new URL(request.url);
   const id = searchParams.get("id");

   if (!id) {
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

// GET - ดึงข้อมูลใบรับรอง
export async function GET(request) {
 const { searchParams } = new URL(request.url);
 const UsersId = searchParams.get('UsersId');
 const id = searchParams.get('id');

 try {
   if (id) {
     const certificate = await prisma.certificate.findUnique({
       where: { id: parseInt(id, 10) },
       include: {
         Users: true
       }
     });
     return NextResponse.json(certificate);
   } else if (UsersId && !isNaN(parseInt(UsersId))) {
     const farmer = await prisma.farmer.findFirst({
       where: {
         userId: parseInt(UsersId)
       }
     });

     if (!farmer) {
       return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
     }

     const certificates = await prisma.certificate.findMany({
       where: {
         farmerId: farmer.id
       },
       include: {
         Users: true
       }
     });
     return NextResponse.json(certificates);
   }

   return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
 } catch (error) {
   console.error("Error fetching certificates:", error);
   return NextResponse.json({ error: "Error fetching certificates" }, { status: 500 });
 }
}