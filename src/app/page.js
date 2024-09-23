"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import ProductCard from "../components/productcard";

async function fetchProducts(sortBy = '') {
  console.log('Fetching products...');
  try {
    const res = await fetch(`http://localhost:3000/api/product?sortBy=${sortBy}`);
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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    async function loadProducts() {
      const { products, error } = await fetchProducts(sortBy);
      if (error) {
        setError(error);
      } else {
        setProducts(products);
      }
    }
    loadProducts();
  }, [sortBy]); // Refetch products when sortBy changes

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };


  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const productPrice = parseFloat(product.Price);

    // Price filtering
    const isPriceInRange =
      (!minPrice || productPrice >= parseFloat(minPrice)) &&
      (!maxPrice || productPrice <= parseFloat(maxPrice));

    // Name, type, and price match (existing logic)
    if (!query) return isPriceInRange;

    const queryParts = query.toLowerCase().split(' ').filter(part => part);
    const matchesQuery = queryParts.every(part => {
      const nameMatch = product.ProductName?.toLowerCase().includes(part);
      const priceMatch = product.Price?.toString().includes(part);
      const typeMatch = product.ProductType?.toLowerCase().includes(part);
      return nameMatch || priceMatch || typeMatch;
    });

    return matchesQuery && isPriceInRange;
  });

  return (
    <div className=''>
     
      <div className=" w-[95%] md:w-[80%] m-auto md:ml-auto md:mr-auto mt-5 md:mt-5  md:p-6 rounded-xl">
      <div className="image bg-pineapple w-auto h-[300px] lg:h-[250px] mt-[50px] bg-no-repeat bg-cover bg-scroll bg-center rounded-xl"></div>
        <div className="mb-5 md:mt-5 bg-white p-2 md:p-6 rounded-xl ">
          ค้นหาจากราคา
          <div className="flex gap-2 md:gap-4 items-center ">

            {/* Min Price Input */}
            <input
              type="number"
              placeholder="30"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="border p-2 w-full md:w-[250px] rounded-xl"
            />
              <a className='text-center'>
              -
              </a>

            {/* Max Price Input */}
            <input
              type="number"
              placeholder="100 บาท"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="border p-2 w-full md:w-[250px] rounded-xl"
            />
          </div>

          {/* Sorting Buttons */}
          <div className="mt-5 flex gap-1 md:gap-4">
          <button
              onClick={() => handleSortChange('')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === '' ? 'bg-[#4eac14] text-white' : 'bg-[#f1f1f1]'}`}
            >
              ทั้งหมด 😯
          </button>
          <button
              onClick={() => handleSortChange('newest')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl  ${sortBy === 'newest' ? 'bg-[#4eac14] text-white' : 'bg-[#f1f1f1]'}`}
            >
              สับปะรดมาใหม่ 🍍
            </button>
            <button
              onClick={() => handleSortChange('oldest')}
              className={`btn p-1  md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'oldest' ? 'bg-[#4eac14] text-white' : 'bg-[#f1f1f1]'}`}
            >
              สับปะรดรุ่นเก๋า 🕰️
            </button>
            <button
              onClick={() => handleSortChange('highest-review')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'highest-review' ? 'bg-[#4eac14] text-white' : 'bg-[#f1f1f1]'}`}
            >
              รีวิวปังที่สุด ⭐️
            </button>
            <button
              onClick={() => handleSortChange('lowest-review')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'lowest-review' ? 'bg-[#4eac14] text-white' : 'bg-[#f1f1f1]'}`}
            >
              รีวิวเบาๆ 🤔
            </button>
          </div>
          
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
