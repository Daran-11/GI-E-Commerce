import prisma from "../../../../../../lib/prisma";

export async function DELETE(request,{params}) {
  const { userId } = params;
  console.log("user id",userId)
  try {
    await prisma.user.delete({
      where: { id: parseInt(userId)},
    });
    return new Response('User deleted', { status: 200 });
  } catch (error) {
    return new Response('Error deleting user', { status: 500 });
  }
}
