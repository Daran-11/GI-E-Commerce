// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        plotCode: 'PC001',
        ProductName: 'มะเขือเทศ',
        ProductType: 'ผัก',
        Description: 'มะเขือเทศสีแดงสด',
        Price: 30,
        Amount: 100,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC002',
        ProductName: 'แตงกวา',
        ProductType: 'ผัก',
        Description: 'แตงกวากรอบสีเขียว',
        Price: 20,
        Amount: 150,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC003',
        ProductName: 'แครอท',
        ProductType: 'ผัก',
        Description: 'แครอทหวานกรอบ',
        Price: 25,
        Amount: 200,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC004',
        ProductName: 'แอปเปิ้ล',
        ProductType: 'ผลไม้',
        Description: 'แอปเปิ้ลสดและฉ่ำ',
        Price: 50,
        Amount: 120,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC005',
        ProductName: 'กล้วย',
        ProductType: 'ผลไม้',
        Description: 'กล้วยสุกหวาน',
        Price: 15,
        Amount: 180,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC006',
        ProductName: 'ส้ม',
        ProductType: 'ผลไม้',
        Description: 'ส้มเปรี้ยวสด',
        Price: 40,
        Amount: 130,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC007',
        ProductName: 'ผักกาด',
        ProductType: 'ผัก',
        Description: 'ผักกาดกรอบสด',
        Price: 10,
        Amount: 300,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC008',
        ProductName: 'ผักโขม',
        ProductType: 'ผัก',
        Description: 'ผักโขมสีเขียวสุขภาพดี',
        Price: 20,
        Amount: 250,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC009',
        ProductName: 'สตรอว์เบอร์รี',
        ProductType: 'ผลไม้',
        Description: 'สตรอว์เบอร์รีหวานแดง',
        Price: 60,
        Amount: 80,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC010',
        ProductName: 'บลูเบอร์รี',
        ProductType: 'ผลไม้',
        Description: 'บลูเบอร์รีสดและเปรี้ยว',
        Price: 70,
        Amount: 90,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC011',
        ProductName: 'พีช',
        ProductType: 'ผลไม้',
        Description: 'พีชฉ่ำและหวาน',
        Price: 55,
        Amount: 110,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC012',
        ProductName: 'สับปะรด',
        ProductType: 'ผลไม้',
        Description: 'สับปะรดเขตร้อนหวาน',
        Price: 90,
        Amount: 70,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC013',
        ProductName: 'มันฝรั่ง',
        ProductType: 'ผัก',
        Description: 'มันฝรั่งที่ใช้ทำอาหารหลากหลาย',
        Price: 35,
        Amount: 220,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC014',
        ProductName: 'หัวหอม',
        ProductType: 'ผัก',
        Description: 'หัวหอมที่มีกลิ่นฉุน',
        Price: 25,
        Amount: 150,
        status: 'มีสินค้า'
      },
      {
        plotCode: 'PC015',
        ProductName: 'กระเทียม',
        ProductType: 'ผัก',
        Description: 'กระเทียมที่มีกลิ่นหอม',
        Price: 40,
        Amount: 130,
        status: 'มีสินค้า'
      },
    ],
  });

  console.log("Seed data inserted");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
