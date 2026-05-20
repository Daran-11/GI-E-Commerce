import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const { userId } = params;
    const { id } = await req.json();

    const account = await prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    await prisma.bankAccount.updateMany({
      where: { userId: parseInt(userId), isDefault: true },
      data: { isDefault: false },
    });

    const updatedAccount = await prisma.bankAccount.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error setting default bank account:", error);
    return NextResponse.json(
      { error: "Unable to set default bank account" },
      { status: 500 }
    );
  }
}