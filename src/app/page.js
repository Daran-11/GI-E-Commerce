"use client";

import { useSearch } from "@/context/searchcontext";
import { useEffect, useState } from "react";
import ProductCard from "../components/productcard";
async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/product');
    if (!res.ok) {
    return {error:'ไม่สามรถเชื่อมต่อข้อมูลได้ในขณะนี้'};
    }
    const products = await res.json();
    return { products, error: null };
  } catch (error) {
    return { products: [], error: 'ไม่พบข้อมูล' };
  }
}

export default function Home() {
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      const { products, error } = await fetchProducts();
      if (error) {
        setError(error);
      } else {
        setProducts(products);
        setFilteredProducts(products);
      }
    }
    loadProducts();
  }, []);



  useEffect(() => {
    if (searchQuery) {
      const queryParts = searchQuery.toLowerCase().split(' ').filter(part => part);

      const filtered = products.filter(product => {
        return queryParts.every(part => {
        const nameMatch = product.ProductName && product.ProductName.toLowerCase().includes(part);
        const priceMatch = product.Price && product.Price.toString().includes(part);
        const typeMatch = product.ProductType && product.ProductType.toLowerCase().includes(part)
        return nameMatch || priceMatch || typeMatch;
        });
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);


  return (
    <div>

        <div className="image bg-pineapple w-auto h-[500px] bg-no-repeat bg-cover bg-scroll bg-center ">
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
            <ProductCard products={filteredProducts} />
          )}          
        </div>

      </div>
    </div>
  );
}