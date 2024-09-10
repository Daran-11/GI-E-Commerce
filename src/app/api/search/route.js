// pages/api/search.js
import prisma from "../../../../lib/prisma";


export default async function handler(req, res) {
  const { query } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        ProductName: {
          contains: query,
          mode: 'insensitive', // Optional: makes the search case-insensitive
        },
      },
      select: {
        ProductID: true,
        ProductName: true,
        Price: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
