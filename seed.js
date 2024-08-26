import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // สร้างฟาร์มเมอร์พร้อมใบรับรอง
  const farmer = await prisma.farmer.create({
    data: {
      name: "Somchai",
      location: "Chiang Rai",
      certificates: {
        create: [
          {
            type: "GI",
            variety: "นางแล",
            plotCode: "65B01002",
            latitude: 19.9105,
            longitude: 99.8266,
            productionQuantity: 2000,
            hasCertificate: true,
            imageUrl: "/path/to/image1.jpg",
            registrationDate: new Date("2024-01-12"),
            expiryDate: new Date("2026-01-12"),
            status: "done",
          },
          {
            type: "GI",
            variety: "ภูแล",
            plotCode: "65B01003",
            latitude: 19.9205,
            longitude: 99.8366,
            productionQuantity: 1500,
            hasCertificate: true,
            imageUrl: "/path/to/image2.jpg",
            registrationDate: new Date("2024-01-12"),
            expiryDate: new Date("2026-01-12"),
            status: "pending",
          },
        ],
      },
    },
  });

  // สร้างข้อมูลสินค้าหลายรายการ
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
