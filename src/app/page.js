import ProductCard from "./components/productcard";


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
    /* อย่าลบตัว main ไม่งั้น navbar จะไม่ขึ้น เพราะตั้งเอาไว้ใน layout.js */
    <>     
    
    <div className="image bg-pineapple w-full h-[430px] bg-no-repeat bg-cover bg-scroll bg-center ">
    </div>

    
      <div className="container mt-10">
        
          
          <ProductCard products={products} />
        
      </div>
  </>
  )

}
