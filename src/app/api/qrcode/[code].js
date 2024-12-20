import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  try {
    // ดึงข้อมูล QR Code พร้อมความสัมพันธ์ที่เกี่ยวข้อง
    const qrCode = await prisma.qR_Code.findUnique({
      where: {
        qrcodeId: code
      },
      include: {
        farmer: true,
        certificate: true,
        product: true,
        order: true
      }
    });

    if (!qrCode) {
      return res.status(404).json({ error: 'ไม่พบข้อมูล QR Code' });
    }

    res.status(200).json(qrCode);

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
}