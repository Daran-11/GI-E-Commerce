import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const ERROR_MESSAGES = {
  INVALID_ID: 'Invalid farmer ID',
  FETCH_ERROR: 'Error fetching certificates',
  NOT_FOUND: 'No certificates found for this farmer'
};

const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const createResponse = (data, status = STATUS_CODES.OK) => {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return createResponse(
        { message: ERROR_MESSAGES.INVALID_ID },
        STATUS_CODES.BAD_REQUEST
      );
    }

    const farmerId = parseInt(id);

    // Fetch certificates with related data
    const certificates = await prisma.certificate_farmer.findMany({
      where: {
        UsersId: farmerId,
      },
      select: {
        id: true,
        type: true,
        variety: true,
        standardName: true,
        certificateNumber: true,
        approvalDate: true,
        Users: {
          select: {
            farmerNameApprove: true,
          }
        }
      },
      orderBy: {
        approvalDate: 'desc'
      }
    });

    // Check if certificates exist
    if (!certificates || certificates.length === 0) {
      return createResponse(
        { message: ERROR_MESSAGES.NOT_FOUND },
        STATUS_CODES.NOT_FOUND
      );
    }

    // Format the response data
    const formattedCertificates = certificates.map(cert => ({
      id: cert.id,
      type: cert.type,
      variety: cert.variety,
      standardName: cert.standardName,
      certificateNumber: cert.certificateNumber,
      approvalDate: cert.approvalDate.toISOString(),
      farmerName: cert.Users?.farmerNameApprove || null
    }));

    return createResponse(formattedCertificates);

  } catch (error) {
    console.error('Error in farmer certificates API:', error);
    
    return createResponse(
      { 
        message: ERROR_MESSAGES.FETCH_ERROR,
        error: error.message 
      },
      STATUS_CODES.SERVER_ERROR
    );

  } finally {
    await prisma.$disconnect();
  }
}
