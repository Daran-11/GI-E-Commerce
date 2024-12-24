import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
 try {
   const { code } = params;
   
   // ดึงข้อมูล QR Code และ relations ที่เกี่ยวข้อง
   const qrCodeData = await prisma.qR_Code.findUnique({
     where: {
       qrcodeId: code
     },
     include: {
       product: {
         select: {
           ProductID: true,
           DateCreated: true,
           Price: true,
           HarvestedAt: true,
           images: {
             select: {
               imageUrl: true
             }
           },
           certificates: {
             include: {
               certificate: true
             }
           }
         }
       }
     }
   });

   if (!qrCodeData) {
     return NextResponse.json(
       { error: 'ไม่พบข้อมูล QR Code' },
       { status: 404 }
     );
   }

   // หา certificate จาก productcertificate
   let certificateData = null;
   if (qrCodeData.product?.certificates?.length > 0) {
     certificateData = qrCodeData.product.certificates[0].certificate;

     // ถ้ามี standards ใน certificate
     if (certificateData?.standards) {
       try {
         // แปลง JSON string เป็น object
         const standardsData = JSON.parse(certificateData.standards);
         certificateData.standards = standardsData;
       } catch (error) {
         console.error('Error parsing standards JSON:', error);
         certificateData.standards = [];
       }
     }
   }

   // สร้าง response object ใหม่
   const responseData = {
     ...qrCodeData,
     certificate: certificateData
   };

   return NextResponse.json({
     success: true,
     data: responseData
   });

 } catch (error) {
   console.error('Error fetching data:', error);
   return NextResponse.json(
     { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}