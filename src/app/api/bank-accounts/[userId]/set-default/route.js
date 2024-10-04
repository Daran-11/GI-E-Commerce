import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma'; // เชื่อมต่อ Prisma

export async function PATCH(req, { params }) {
  const { userId } = params;
  const { id } = await req.json();

  // ค้นหาบัญชีที่ต้องการอัปเดต
  const account = await prisma.bankAccount.findUnique({
    where: { id },
  });

  if (!account) {
    return NextResponse.json({ message: 'Account not found' }, { status: 404 });
  }

  // อัปเดตบัญชีที่เลือกให้เป็นบัญชีหลัก
  await prisma.bankAccount.updateMany({
    where: { userId: parseInt(userId), isDefault: true },
    data: { isDefault: false }, // ตั้งบัญชีหลักเป็น false ก่อน
  });

  const updatedAccount = await prisma.bankAccount.update({
    where: { id },
    data: { isDefault: true },
  });

  return NextResponse.json(updatedAccount);
}