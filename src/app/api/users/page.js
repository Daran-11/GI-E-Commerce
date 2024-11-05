import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const users = await prisma.Users.findMany();
  res.status(200).json(users);
}
