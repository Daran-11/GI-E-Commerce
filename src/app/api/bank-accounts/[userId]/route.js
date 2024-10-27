import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Omise from 'omise';
import prisma from "../../../../../lib/prisma";

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function GET(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });
  
  if (!session || session.user.id !== parseInt(params.userId)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
  }

  const bankAccounts = await prisma.bankAccount.findMany({
    where: { userId: parseInt(params.userId) },
  });

  // Fetch recipient status from Omise for each bank account
  const bankAccountsWithStatus = await Promise.all(bankAccounts.map(async (account) => {
    if (account.recipientId) {
      const recipient = await omise.recipients.retrieve(account.recipientId);
      return {
        ...account,
        recipientVerified: recipient.verified,
        recipientActive: recipient.active,
      };
    } else {
      return { ...account, recipientVerified: null, recipientActive: null };
    }
  }));

  return new Response(JSON.stringify(bankAccountsWithStatus), { status: 200 });
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

  // Create recipient on Omise
  try {
    const recipient = await omise.recipients.create({
      name: accountName,
      email: session.user.email,
      type: "individual",
      bank_account: {
        brand: (await prisma.bank.findUnique({ where: { id: bankId } })).brand,
        number: accountNumber,
        name: accountName,
      },
    });

    // Update the bank account with the Omise recipient ID
    await prisma.bankAccount.update({
      where: { id: newBankAccount.id },
      data: {
        recipientId: recipient.id,
      },
    });

    return new Response(JSON.stringify(newBankAccount), { status: 201 });
  } catch (error) {
    console.error("Error creating Omise recipient:", error);

    // Rollback the bank account creation in case of error
    await prisma.bankAccount.delete({
      where: { id: newBankAccount.id },
    });

    return new Response(
      JSON.stringify({ error: "Failed to create Omise recipient" }),
      { status: 500 }
    );
  }
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

  // ลบ recipient ID จาก Omise
  try {
    await omise.recipients.destroy(bankAccount.recipientId); // ใช้ recipientId ที่ถูกเก็บไว้ใน bankAccount
  } catch (error) {
    console.error("Failed to delete recipient:", error);
    return new Response(JSON.stringify({ error: "Failed to delete recipient in Omise" }), { status: 500 });
  }

  // ลบบัญชีธนาคารจากฐานข้อมูล
  await prisma.bankAccount.delete({ where: { id } });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
