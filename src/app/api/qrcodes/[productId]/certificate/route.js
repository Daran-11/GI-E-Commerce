import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
 try {
   const session = await getServerSession(authOptions);
   if (!session) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const { productId } = params;
   if (!productId) {
     return NextResponse.json(
       { error: "Product ID is required" },
       { status: 400 }
     );
   }

   // ดึงข้อมูล ProductCertificate พร้อมกับข้อมูล Certificate ที่เกี่ยวข้อง
   const productCertificate = await prisma.productCertificate.findFirst({
     where: {
       productId: parseInt(productId)
     },
     include: {
       certificate: {
         select: {
           id: true,
           type: true,
           variety: true,
           standards: true,
           status: true,
           expiryDate: true
         }
       }
     }
   });

   if (!productCertificate) {
     return NextResponse.json(
       { error: "Certificate not found for this product" },
       { status: 404 }
     );
   }

   return NextResponse.json(productCertificate);

 } catch (error) {
   console.error("Failed to fetch product certificate:", error);
   return NextResponse.json(
     { error: "Failed to fetch certificate", details: error.message },
     { status: 500 }
   );
 }
}

export async function PUT(request, { params }) {
 try {
   const session = await getServerSession(authOptions);
   if (!session) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const { productId } = params;
   const data = await request.json();

   if (!productId || !data.certificateId) {
     return NextResponse.json(
       { error: "Product ID and Certificate ID are required" },
       { status: 400 }
     );
   }

   // อัพเดทความสัมพันธ์ระหว่าง Product และ Certificate
   const updatedCertificate = await prisma.productCertificate.upsert({
     where: {
       productId_certificateId: {
         productId: parseInt(productId),
         certificateId: data.certificateId
       }
     },
     update: {},
     create: {
       productId: parseInt(productId),
       certificateId: data.certificateId
     },
     include: {
       certificate: true
     }
   });

   return NextResponse.json(updatedCertificate);

 } catch (error) {
   console.error("Failed to update product certificate:", error);
   return NextResponse.json(
     { error: "Failed to update certificate", details: error.message },
     { status: 500 }
   );
 }
}

export async function DELETE(request, { params }) {
 try {
   const session = await getServerSession(authOptions);
   if (!session) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const { productId } = params;
   if (!productId) {
     return NextResponse.json(
       { error: "Product ID is required" },
       { status: 400 }
     );
   }

   // ลบความสัมพันธ์ระหว่าง Product และ Certificate
   await prisma.productCertificate.deleteMany({
     where: {
       productId: parseInt(productId)
     }
   });

   return NextResponse.json(
     { message: "Product certificate relationship deleted successfully" },
     { status: 200 }
   );

 } catch (error) {
   console.error("Failed to delete product certificate:", error);
   return NextResponse.json(
     { error: "Failed to delete certificate relationship", details: error.message },
     { status: 500 }
   );
 }
}