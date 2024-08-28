import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const farmer = await prisma.farmer.create({
    data: {
      name: "Somchai",
      location: "Chiang Rai",
      certificates: {
        create: [
          {
            variety: "นางแล",
            plotCode: "65B01002",
            registrationDate: new Date("2024-01-12"),
            expiryDate: new Date("2026-01-12"),
            status: "done",
            imageUrl: "/path/to/image1.jpg",
          },
          {
            variety: "ภูแล",
            plotCode: "65B01003",
            registrationDate: new Date("2024-01-12"),
            expiryDate: new Date("2026-01-12"),
            status: "pending",
            imageUrl: "/path/to/image2.jpg",
          },
        ],
      },
    },
  });

  await prisma.product.createMany({
    data: [
      {
        plotCode: "PLOT001",
        productName: "Apple",
        variety: "Gala",
        price: 120,
        amount: 50,
        status: "Available",
      },
      {
        plotCode: "PLOT002",
        productName: "Orange",
        variety: "Navel",
        price: 80,
        amount: 100,
        status: "Available",
      },
      {
        plotCode: "PLOT003",
        productName: "Banana",
        variety: "Cavendish",
        price: 60,
        amount: 150,
        status: "Out of Stock",
      },
    ],
  });
  console.log({ farmer });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
