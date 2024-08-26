import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    const products = await prisma.product.findMany();
    console.log(products);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
