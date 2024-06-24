

import ProductCard from "./components/productcard";

// หน้าหลัก
// fetchproduct ดึงข้อมูล ID Name Price ของสินค้ามา
async function fetchProducts() {
  const res = await fetch('http://localhost:3000/api/product?fields=ProductID,ProductName,Price');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const products = await res.json();
  return products;
}


export default async function Home() {
  const products = await fetchProducts();
  return (
    
    <>
    
    <div className="image bg-pineapple w-full h-[430px] bg-no-repeat bg-cover bg-scroll bg-center ">
    </div>

    
      <div className="container mt-10">
        
          
          <ProductCard products={products} />
        
      </div>
  </>
  )

}
