import prisma from '../../../lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = params;
  const { action } = await req.json();

  if (action === 'approve') {
    await prisma.farmer.update({
      where: { id: Number(id) },
      data: { role: 'เกษตรกร' },
    });
  }

  return new Response(JSON.stringify({ message: 'User updated successfully' }), {
    status: 200,
  });
}
