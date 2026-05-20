export const mockProducts = [
  {
    ProductID: 1,
    ProductName: "ผักบุ้ง",
    ProductType: "สดใหม่",
    Amount: 100,
    Price: 25,
    Description: "ผักบุ้งสดใหม่ปลูกแบบออร์แกนิก ไม่มีสารเคมี",
    Details: "ผักบุ้งปลูกจากฟาร์มชาวไร่ที่ใช้วิธีการเกษตรแบบตามธรรมชาติ ทำให้ได้ผลผลิตที่มีคุณภาพสูง อร่อย และปลอดภัยต่อสุขภาพ",
    HarvestedAt: "2024-05-15T10:00:00Z",
    images: [
      { imageUrl: "/images/vegetable1.jpg" },
      { imageUrl: "/images/vegetable2.jpg" }
    ],
    farmer: {
      id: 1,
      farmerName: "สมชาย ทำนายดี",
      province: "นครปฐม",
      contactLine: "081-234-5678"
    },
    certificates: [
      {
        certificate: {
          id: 1,
          standards: JSON.stringify([
            {
              name: "มาตรฐาน GI",
              certNumber: "ORG-2024-001",
              certDate: "2024-01-15T00:00:00Z",
              logo: "/certificates/GI.jpeg"
            }
          ]),
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z"
        }
      }
    ],
    reviews: [
      {
        id: 1,
        rating: 5,
        review: "สดใหม่มากค่ะ ได้กลิ่นหอมชอบมาก",
        createdAt: "2024-05-10T10:00:00Z",
        user: {
          id: 1,
          name: "สุดา ใจเย็น"
        }
      },
      {
        id: 2,
        rating: 4,
        review: "ดีค่ะ แต่ราคาสูงหน่อย",
        createdAt: "2024-05-09T15:30:00Z",
        user: {
          id: 2,
          name: "เอมิลี่ วงษ์"
        }
      }
    ]
  },
  {
    ProductID: 2,
    ProductName: "มะเขือเทศ",
    ProductType: "หนึ่งจำหน่าย",
    Amount: 50,
    Price: 40,
    Description: "มะเขือเทศสีแดงสดใหม่ ตาข่ายหนา เอาใจช่วงกำหนดเก็บเกี่ยว",
    Details: "มะเขือเทศปลูกในสภาพภูมิอากาศที่เหมาะสม ไม่ใช้สารเคมีพิษ รสชาติหวาน มีกรดไขมันธรรมชาติ",
    HarvestedAt: "2024-05-18T08:00:00Z",
    images: [
      { imageUrl: "/tomatoes/tomato1.jpg" },
      { imageUrl: "/tomatoes/tomato2.jpg" }
    ],
    farmer: {
      id: 2,
      farmerName: "นายวิทยา สุขสงคราม",
      province: "สระบุรี",
      contactLine: "089-876-5432"
    },
    certificates: [
      {
        certificate: {
          id: 2,
          standards: JSON.stringify([
            {
              name: "มาตรฐาน GI",
              certNumber: "GI-2024-002",
              certDate: "2024-02-20T00:00:00Z",
              logo: "/certificates/GI.jpeg"
            }
          ]),
          createdAt: "2024-02-20T00:00:00Z",
          updatedAt: "2024-02-20T00:00:00Z"
        }
      }
    ],
    reviews: [
      {
        id: 3,
        rating: 5,
        review: "ยอดเยี่ยมค่ะ รสชาติหวาน แนะนำเลย",
        createdAt: "2024-05-16T14:20:00Z",
        user: {
          id: 3,
          name: "กิติยา ประเสริฐ"
        }
      }
    ]
  },
  {
    ProductID: 3,
    ProductName: "สับปะรด",
    ProductType: "ภูแล",
    Amount: 30,
    Price: 60,
    Description: "น้อยหน่าหวาน สดใจ เก็บตั้งแต่เช้าที่มดได้บ่ายเพศรี",
    Details: "ปลูกแบบเกษตรยั่งยืน มีการดูแลเต่อทุก ๆ วัน รสชาติหวาน เนื้อหนา น้ำมาก",
    HarvestedAt: "2024-05-19T06:00:00Z",
    images: [
      { imageUrl: "/pineapple/pineapple1.jpg" },
      { imageUrl: "/pineapple/pineapple2.jpg" }
    ],
    farmer: {
      id: 3,
      farmerName: "พวงรัตน์ เพชรศรี",
      province: "ชลบุรี",
      contactLine: "092-345-6789"
    },
    certificates: [
      {
        certificate: {
          id: 3,
          standards: JSON.stringify([
            {
              name: "มาตรฐาน GI",
              certNumber: "GI-2024-003",
              certDate: "2024-03-10T00:00:00Z",
              logo: "/certificates/GI.jpeg"
            }
          ]),
          createdAt: "2024-03-10T00:00:00Z",
          updatedAt: "2024-03-10T00:00:00Z"
        }
      }
    ],
    reviews: []
  }
];

export const getMockProduct = (productId) => {
  return mockProducts.find(p => p.ProductID === productId) || null;
};

export const getMockProductParams = () => {
  return mockProducts.map(p => ({
    ProductID: p.ProductID.toString()
  }));
};
