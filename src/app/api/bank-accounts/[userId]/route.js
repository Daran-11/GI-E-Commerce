import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Omise from 'omise';
import prisma from "../../../../../lib/prisma";

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function GET(request, { params }) {
  try {
    const session = await getServerSession({ request, ...authOptions });

    if (!session || session.user.id !== parseInt(params.userId)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId: parseInt(params.userId) },
      include: {
        bank: true,
      },
    });

    const bankAccountsWithStatus = await Promise.all(bankAccounts.map(async (account) => {
      if (account.recipientId) {
        try {
          const recipient = await omise.recipients.retrieve(account.recipientId);
          return {
            ...account,
            recipientVerified: recipient.verified,
            recipientActive: recipient.active,
          };
        } catch (error) {
          console.error("Error retrieving recipient:", error);
          return { ...account, recipientVerified: null, recipientActive: null };
        }
      } else {
        return { ...account, recipientVerified: null, recipientActive: null };
      }
    }));

    return new Response(JSON.stringify(bankAccountsWithStatus), { status: 200 });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch bank accounts" }),
      { status: 500 }
    );
  }
}


export async function POST(request, { params }) {
  try {
    const session = await getServerSession({ request, ...authOptions });

    if (!session || session.user.id !== parseInt(params.userId)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const { accountNumber, accountName, bankId, isDefault } = await request.json();

    if (isDefault) {
      await prisma.bankAccount.updateMany({
        where: { userId: parseInt(params.userId), isDefault: true },
        data: { isDefault: false },
      });
    }

    const farmer = await prisma.farmer.findUnique({
      where: { userId: parseInt(params.userId) }
    });

    const newBankAccount = await prisma.bankAccount.create({
      data: {
        accountNumber,
        accountName,
        bankId: parseInt(bankId, 10),
        userId: parseInt(params.userId),
        farmerId: farmer.id,
        isDefault,
      },
    });

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId: parseInt(params.userId) },
    });

    if (bankAccounts.length === 1) {
      await prisma.bankAccount.update({
        where: { id: newBankAccount.id },
        data: { isDefault: true },
      });
    }

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

      await prisma.bankAccount.update({
        where: { id: newBankAccount.id },
        data: {
          recipientId: recipient.id,
        },
      });

      return new Response(JSON.stringify(newBankAccount), { status: 201 });
    } catch (error) {
      console.error("Error creating Omise recipient:", error);
      await prisma.bankAccount.delete({
        where: { id: newBankAccount.id },
      });
      return new Response(
        JSON.stringify({ error: "Failed to create Omise recipient" }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating bank account:", error);
    return new Response(
      JSON.stringify({ error: "Unable to create bank account" }),
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession({ request, ...authOptions });

    if (!session || session.user.id !== parseInt(params.userId)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const { id, accountNumber, accountName, isDefault } = await request.json();

    if (isDefault) {
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
  } catch (error) {
    console.error("Error updating bank account:", error);
    return new Response(
      JSON.stringify({ error: "Unable to update bank account" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
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

    try {
      await omise.recipients.destroy(bankAccount.recipientId);
    } catch (error) {
      console.error("Failed to delete recipient:", error);
      return new Response(JSON.stringify({ error: "Failed to delete recipient in Omise" }), { status: 500 });
    }

    await prisma.bankAccount.delete({ where: { id } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return new Response(
      JSON.stringify({ error: "Unable to delete bank account" }),
      { status: 500 }
    );
  }
}
