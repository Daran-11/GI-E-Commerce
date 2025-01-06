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

    // ตรวจสอบว่า order มีอยู่จริง
    const orderExists = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    });

    if (!orderExists) {
      return new Response(JSON.stringify({ message: 'Order not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // ดึง orderItems
    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: orderId
      },
      select: {
        productId: true
      }
    });

    const productIds = orderItems.map(item => item.productId);

    // ดึง QR codes
    const qrCodes = await prisma.qR_Code.findMany({
      where: {
        AND: [
          { orderId: orderId },
          { productId: { in: productIds } }
        ]
      },
      select: {
        id: true,
        qrcodeId: true,
        orderId: true,
        productId: true,
        farmerId: true,
        userId: true,
        createdAt: true
      }
    });

    // ส่งคืนอาร์เรย์เปล่าถ้าไม่พบ QR codes แทนที่จะส่ง 404
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