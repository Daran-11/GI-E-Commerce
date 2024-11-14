// app/api/product/[ProductID]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  const { ProductID } = params;

  if (!ProductID) {
    return NextResponse.json({ error: 'ProductID is required' }, { status: 400 });
  }

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
                standards: true, // Include standards JSON field
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

    // Ensure that certificate data is properly fetched and returned


    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
