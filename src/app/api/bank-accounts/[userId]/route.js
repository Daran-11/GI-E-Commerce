import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "../../../../../lib/prisma";

export async function GET(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });
  
  if (!session || session.user.id !== parseInt(params.userId)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  const bankAccounts = await prisma.bankAccount.findMany({
    where: { userId: parseInt(params.userId) },
  });

  return new Response(JSON.stringify(bankAccounts), { status: 200 });
}

export async function POST(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });
  
  if (!session || session.user.id !== parseInt(params.userId)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  const { accountNumber, accountName, bankId, isDefault } = await request.json();

  if (isDefault) {
    // Unset other default accounts
    await prisma.bankAccount.updateMany({
      where: { userId: parseInt(params.userId), isDefault: true },
      data: { isDefault: false },
    });
  }

  const newBankAccount = await prisma.bankAccount.create({
    data: {
      accountNumber,
      accountName,
      bankId: parseInt(bankId, 10),
      userId: parseInt(params.userId),
      isDefault,
    },
  });

    // Check if this is the only bank account for the user
    const bankAccounts = await prisma.bankAccount.findMany({
        where: { userId: parseInt(params.userId) },
      });
    
      // If this is the only bank account, set it as default
      if (bankAccounts.length === 1) {
        await prisma.bankAccount.update({
          where: { id: newBankAccount.id },
          data: { isDefault: true },
        });
      }

  return new Response(JSON.stringify(newBankAccount), { status: 201 });
}

export async function PUT(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });

  if (!session || session.user.id !== parseInt(params.userId)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  const { id, accountNumber, accountName, isDefault } = await request.json();

  if (isDefault) {
    // Unset other default accounts
    await prisma.bankAccount.updateMany({
      where: { userId: parseInt(params.userId), isDefault: true },
      data: { isDefault: false },
    });
  }

  const updatedBankAccount = await prisma.bankAccount.update({
    where: { id },
    data: { accountNumber, accountName, isDefault },
  });

  return new Response(JSON.stringify(updatedBankAccount), { status: 200 });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });

  if (!session || session.user.id !== parseInt(params.userId)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  const { id } = await request.json();

  const bankAccount = await prisma.bankAccount.findUnique({ where: { id } });

  if (bankAccount.isDefault) {
    return new Response(
      JSON.stringify({ error: "Cannot delete default account" }),
      { status: 400 }
    );
  }

  await prisma.bankAccount.delete({ where: { id } });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
