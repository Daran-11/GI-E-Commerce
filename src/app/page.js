"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/productcard";

async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/product');
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const products = await res.json();
    return { products, error: null };
  } catch (error) {
    return { products: [], error: 'ไม่พบข้อมูล' };
  }
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      const { products, error } = await fetchProducts();
      if (error) {
        setError(error);
      } else {
        setProducts(products);
      }
    }
    loadProducts();
  }, []);

  return (
    <>
      <div className="">
        <div className="image bg-pineapple w-full h-[460px] bg-no-repeat bg-cover bg-scroll bg-center ">
        </div>
      </div>
      <div className="">

      </div>
      <div className="container mt-10">
        <div className="my-5">
          <p>
            filter here
          </p>          
        </div>
        <div>
          {error ? (
            <div className="alert alert-error justify-center flex items-center text-gray-500">
              <p>{error}</p>
            </div>
          ) : (
            <ProductCard products={products} />
          )}          
        </div>

      </div>
    </>
  );
}