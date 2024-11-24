import prisma from "../../../../../lib/prisma";

export async function DELETE(request) {
  const { id } = await request.json();
  
  try {
    await prisma.Users.delete({
      where: { id },
    });
    return new Response('User deleted', { status: 200 });
  } catch (error) {
    return new Response('Error deleting user', { status: 500 });
  }
}
