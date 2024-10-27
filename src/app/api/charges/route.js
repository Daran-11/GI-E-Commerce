import { NextResponse } from 'next/server';
import Omise from 'omise';
const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function GET(request) {
    try {
        const charges = await omise.charges.list({
            limit: 5,  // Number of charges to retrieve (e.g., the latest 5 records)
            order: 'reverse_chronological',  // Order by creation date, newest first
          });
  
      return NextResponse.json(charges);
    } catch (error) {
      console.error('Error fetching charges:', error);
      return NextResponse.json({ error: 'Failed to fetch charges' }, { status: 500 });
    }
  }