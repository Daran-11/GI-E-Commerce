import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          // Only get users who are still customers
          { role: 'customer' },
          // And have Farmer records (pending applications)
          {
            Farmer: {
              some: {}
            }
          }
        ]
      },
      include: {
        Farmer: {
          select: {
            farmerName: true,
            address: true,
            sub_district: true,
            district: true,
            province: true,
            zip_code: true,
            phone: true,
            contactLine: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      Farmer: user.Farmer[0] || null
    }));

    return new Response(JSON.stringify(formattedUsers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch users',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}