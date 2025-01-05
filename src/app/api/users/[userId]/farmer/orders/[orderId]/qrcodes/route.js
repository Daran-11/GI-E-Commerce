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
    
    // ดึง orderItems เพื่อหา productIds
    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: orderId
      },
      select: {
        productId: true
      }
    });

    // แปลง orderItems เป็น array ของ productIds
    const productIds = orderItems.map(item => item.productId);

    // ดึง QR codes ที่เกี่ยวข้องกับ productIds จากออเดอร์นี้
    const qrCodes = await prisma.qR_Code.findMany({
      where: {
        productId: {
          in: productIds
        }
      },
      select: {
        id: true,
        qrcodeId: true,
        productId: true,
        farmerId: true,
        userId: true,
        orderId: true,
        createdAt: true
      }
    });

    // ส่งข้อมูลกลับ
    return new Response(JSON.stringify(qrCodes), {
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