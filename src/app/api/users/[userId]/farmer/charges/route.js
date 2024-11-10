import { NextResponse } from 'next/server';
import Omise from 'omise';
const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
});

// Helper function to check session and permissions
async function checkPermissions(session, userId) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    if (session.user.id !== parseInt(userId) && session.user.role !== "farmer" && session.user.role !== "admin") {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    return null; // No errors
  }

export async function GET(req, { params }) {
    const session = await getServerSession({ req, ...authOptions });
    const { userId } = params;
  
    const permissionError = await checkPermissions(session, userId);
    if (permissionError) return permissionError;
  
    const farmer = await prisma.farmer.findUnique({
      where: {
        userId: parseInt(userId),
      },
    });
  
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }
  
    try {
      // Fetch all charges from Omise
      const { data: allCharges } = await omise.charges.list({
        limit: 100, // Increase if necessary to fetch more data
        order: 'reverse_chronological', // Order by creation date, newest first
      });
  
      // Filter charges to only include those associated with the farmer
      const farmerCharges = allCharges.filter((charge) => {
        // Example condition: check if the metadata or description has the farmer ID
        return charge.metadata?.farmerId === farmer.id || charge.description.includes(`Farmer ID: ${farmer.id}`);
      });
  
      return NextResponse.json({ success: true, charges: farmerCharges });
    } catch (error) {
      console.error('Error fetching charges:', error);
      return NextResponse.json({ error: 'Failed to fetch charges' }, { status: 500 });
    }
  }