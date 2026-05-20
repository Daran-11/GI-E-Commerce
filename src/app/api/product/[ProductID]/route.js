// app/api/product/[ProductID]/route.js
import { NextResponse } from 'next/server';
import { getMockProduct } from '../../../../../lib/mockData';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { ProductID } = params;

  if (!ProductID) {
    return NextResponse.json({ error: 'ProductID is required' }, { status: 400 });
  }

  // ---- Mock fallback ----
  if (process.env.USE_MOCK_DATA === 'true') {
    const product = getMockProduct(parseInt(ProductID, 10));

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  }
  // ---- End mock fallback ----

  try {
    const product = await prisma.product.findUnique({
      where: {
        ProductID: parseInt(ProductID, 10),
      },
      include: {
        images: true,
        certificates: {
          include: {
            certificate: {
              select: {
                id: true,
                standards: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        farmer: {
          select: {
            farmerName: true,
            province: true,
            contactLine: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}