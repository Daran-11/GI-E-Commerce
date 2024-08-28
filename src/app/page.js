"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import ProductCard from "../components/productcard";

async function fetchProducts() {
  console.log('Fetching products...');
  try {
    const res = await fetch('http://localhost:3000/api/product');
    if (!res.ok) {
      return { error: 'ไม่สามารถเชื่อมต่อข้อมูลได้ในขณะนี้' };
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
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const router = useRouter();

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

  const filteredProducts = products.filter(product => {
    if (!query) {
      return true; // Return all products if no query is provided
    }

    const queryParts = query.toLowerCase().split(' ').filter(part => part);
    return queryParts.every(part => {
      const nameMatch = product.ProductName && product.ProductName.toLowerCase().includes(part);
      const priceMatch = product.Price && product.Price.toString().includes(part);
      const typeMatch = product.ProductType && product.ProductType.toLowerCase().includes(part);
      return nameMatch || priceMatch || typeMatch;
    });
  });

  return (
    <div>
      <div className="image bg-pineapple w-auto h-[500px] bg-no-repeat bg-cover bg-scroll bg-center"></div>
      <div className="container mt-10">
        <div className="my-5">
          <p>Filter products here:</p>
        </div>
        <div>
          {error ? (
            <div className="alert alert-error justify-center flex items-center text-gray-500">
              <p>{error}</p>
            </div>
          ) : (
            <ProductCard products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
}
