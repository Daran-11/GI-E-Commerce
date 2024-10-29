export async function GET(req) {
  try {
    // ดึง id จาก URL path
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1]; // ดึง id จาก path สุดท้าย เช่น /api/farmer_certificates/1

    // Validate ID
    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ message: 'Invalid Users ID' }), { status: 400 });
    }

    const UsersId = parseInt(id);

    const certificates = await prisma.certificate_farmer.findMany({
      where: {
        UsersId: UsersId
      },
      orderBy: {
        approvalDate: 'desc'
      }
    });

    return new Response(JSON.stringify(certificates), { status: 200 });
  } catch (error) {
    console.error('Error fetching Users certificates:', error);
    return new Response(JSON.stringify({ message: 'Error fetching Users certificates' }), { status: 500 });
  }
}
