import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await prisma.Product.findMany({
      where: {
        isDeleted: false,
        OR: [
          {
            ProductName: {
              contains: query,
            },
          },
          !isNaN(parseFloat(query)) && isFinite(query) ? {
            Price: {
              equals: parseFloat(query),
            },
          } : null,
          {
            ProductType: {
              contains: query,
            },
          },
        ].filter(Boolean),
      },
      select: {
        ProductName: true,
        ProductType: true,
        Price: true,
      },
      take: 5, // limit the number of suggestions returned
    });
    console.log('Suggestions:', suggestions); 

    return NextResponse.json({
      suggestions: suggestions.map(s => ({
        name: s.ProductName,
        type: s.ProductType,
        price: s.Price,
      })),
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ suggestions: [] });
  }
}