import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { id: parseInt(id) },
        include: {
          farmer: true,
        },
      });

      if (certificate) {
        res.status(200).json(certificate);
      } else {
        res.status(404).json({ message: "Certificate not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certificate", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
