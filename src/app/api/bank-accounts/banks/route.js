import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    const banks = await prisma.bank.findMany();
    return new Response(JSON.stringify(banks), { status: 200 });
  } catch (error) {
    console.error("Error fetching banks:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch banks" }),
      { status: 500 }
    );
  }
}