import prisma from '../../../../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
 try {
   // ตรวจสอบ session
   const session = await getServerSession(authOptions);
   if (!session) {
     return new Response(JSON.stringify({ message: 'Unauthorized' }), {
       status: 401,
       headers: {
         'Content-Type': 'application/json',
       } 
     });
   }

   const orderId = parseInt(params.orderId);
   const userId = parseInt(params.userId);

   // ดึงข้อมูล order พร้อม qrCodes
   const order = await prisma.order.findUnique({
     where: {
       id: orderId,
     },
     include: {
       qrCodes: {
         select: {
           id: true,
           qrcodeId: true,
           orderId: true,
           productId: true, 
           farmerId: true,
           userId: true,
           createdAt: true
         }
       }
     }
   });

   if (!order) {
     return new Response(JSON.stringify({ message: 'Order not found' }), {
       status: 404, 
       headers: {
         'Content-Type': 'application/json'
       }
     });
   }

   console.log('Order:', order); // Log ข้อมูล order
   console.log('QR Codes:', order.qrCodes); // Log ข้อมูล QR codes

   // ส่งข้อมูล qrCodes กลับไป
   return new Response(JSON.stringify(order.qrCodes), {
     status: 200,
     headers: {
       'Content-Type': 'application/json'
     }
   });

 } catch (error) {
   console.error('Error fetching QR codes:', error);
   return new Response(JSON.stringify({ 
     message: 'Failed to fetch QR codes',
     error: error.message 
   }), {
     status: 500,
     headers: {
       'Content-Type': 'application/json'
     }
   });
 }
}