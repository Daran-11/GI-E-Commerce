import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(request, { params }) {
    try {
      const { provinceId } = params;
        console.log('Received provinceId:', provinceId);
      // Validate provinceId
      if (!provinceId || isNaN(provinceId)) {
        return NextResponse.json({ error: 'Invalid or missing province ID' }, { status: 400 });
      }
  
      // Fetch amphoes by province ID
      const amphoes = await prisma.amphoe.findMany({
        orderBy: {
          name_th: 'asc' // Sort alphabetically by Thai name
        },
        where: {
          province_id: parseInt(provinceId, 10),
        },

      });
  
      return NextResponse.json(amphoes);
    } catch (error) {
      console.error('Error fetching amphoes:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }