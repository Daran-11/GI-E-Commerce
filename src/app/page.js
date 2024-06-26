

import ProductCard from "./components/productcard";

import prisma from "../../lib/prisma";

// หน้าหลัก
// fetchproduct ดึงข้อมูล ID Name Price ของสินค้ามา

async function fetchProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        ProductID: true,
        ProductName: true,
        Price: true,
      },
    });
    return products;
    
  } catch (error) {
    throw new Error('Failed to fetch data');
  } finally {
    await prisma.$disconnect();
  }
}


export default async function Home() {
  const products = await fetchProducts();
  return (
    
    <>
    <div className="">
          <div className="image bg-pineapple  w-full h-[460px] bg-no-repeat bg-cover bg-scroll bg-center ">
    </div>

    </div>

    
      <div className="container mt-10">
        
          
          <ProductCard products={products} />
        
      </div>
  </>
  )

}
