import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

// Helper function to generate QR Code ID
function generateQRCodeId(farmerId, productId, variety = '') {
  const farmerIdPadded = farmerId.toString().padStart(4, '0');
  const varietyCode = variety?.toLowerCase() === 'นางแล' ? 'PN' : 
                     variety?.toLowerCase() === 'ภูแล' ? 'PP' : 'XX';
  const productIdPadded = productId.toString().padStart(5, '0');
  return `${farmerIdPadded}${varietyCode}${productIdPadded}`;
}

export async function GET(request, { params }) {
  const { ProductID } = params;

  if (!ProductID) {
    return NextResponse.json({ error: 'ProductID is required' }, { status: 400 });
  }

  try {
    // Find product with related data
    const product = await prisma.product.findUnique({
      where: {
        ProductID: parseInt(ProductID),
      },
      include: {
        farmer: {
          select: {
            id: true,
          },
        },
        certificates: {
          include: {
            certificate: {
              select: {
                id: true,
                variety: true,
              },
            },
          },
        },
        qrCodes: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get existing QR Code or create new one
    let qrCode = product.qrCodes[0];
    
    if (!qrCode) {
      // Get variety from certificate if exists
      const variety = product.certificates[0]?.certificate?.variety || '';
      const qrcodeId = generateQRCodeId(product.farmer.id, product.ProductID, variety);

      // Create new QR Code
      qrCode = await prisma.qR_Code.create({
        data: {
          qrcodeId,
          farmerId: product.farmer.id,
          productId: product.ProductID,
          certificateId: product.certificates[0]?.certificate?.id,
        }
      });
    }

    // Determine variety code from qrcodeId
    const varietyCode = qrCode.qrcodeId.substring(4, 6); // Extract PP or PN from QR code

    // Return QR Code data
    return NextResponse.json({
      qrcodeId: qrCode.qrcodeId,
      varietyCode,
      certificateId: qrCode.certificateId,
      productId: qrCode.productId,
      farmerId: qrCode.farmerId,
      createdAt: qrCode.createdAt
    }, { status: 200 });

  } catch (error) {
    console.error('Error handling QR code:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}