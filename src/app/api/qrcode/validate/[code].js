import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  try {
    // ค้นหารหัสใน database
    const qrCode = await prisma.qR_Code.findUnique({
      where: {
        qrcodeId: code
      }
    });

    if (!qrCode) {
      return res.status(404).json({ error: 'ไม่พบรหัสบรรจุภัณฑ์นี้ในระบบ' });
    }

    res.status(200).json(qrCode);

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัส' });
  }
}