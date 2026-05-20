"use client";

import SearchBar from "@/components/searchbar";
import { mockProducts } from "../../lib/mockData";
import debounce from "lodash.debounce";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/productcard";
import Skeleton from "../components/Skeleton";

async function fetchProducts(sortBy = '') {
  console.log('Fetching products...');
  try {
    const res = await fetch(`/api/product?sortBy=${sortBy}`);
    if (!res.ok) {
      console.log('Database unavailable, using mock data');
      return { products: mockProducts, error: null, isMockData: true };
    }
    const products = await res.json();
    return { products, error: null, isMockData: false };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: mockProducts, error: null, isMockData: true };
  }
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const router = useRouter();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const { products, error, isMockData } = await fetchProducts(sortBy);
      if (error) {
        setError(error);
      } else {
        setProducts(products);
        setIsMockData(isMockData);
      }
      setLoading(false);
    };

    loadProducts();
  }, [sortBy]);

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  // Debounced handler for min and max price
  const handleMinPriceChange = debounce((e) => {
    setMinPrice(e.target.value);
  }, 300); // Debounce with 300ms

  const handleMaxPriceChange = debounce((e) => {
    setMaxPrice(e.target.value);
  }, 300); // Debounce with 300ms

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
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
  }, [products, minPrice, maxPrice, query]); // Depend on products, minPrice, maxPrice, and query

  return (
    <div className=''>
         <div className="hidden md:block image bg-pineapple w-auto h-[300px] mt-[50px] lg:h-[250px] bg-no-repeat bg-cover bg-scroll bg-center "></div>
      <div className="w-[95%] md:w-[80%] m-auto mt-[50px] md:mt-2 md:p-3 rounded-xl">
     
        
        
        <div className="pb-5 mt-[120px] md:mt-0 rounded-xl ">
        <div className="w-fit bg-white flex m-auto p-3 rounded-xl">
          <div className="flex justify-center items-center gap-x-4 ">
            <div className="  hidden md:block md:ml-2 w-full  2xl:w-[800px]  xl:w-[450px] lg:w-[300px] md:w-[300px]">
            <h1>ค้นหา</h1>
              <SearchBar />              
            </div>
            <div className="">
                <h2>หาจากช่วงราคา</h2>
                <div className="flex gap-2 md:gap-2 items-center ">
              
                {/* Min Price Input */}
                <input
                  type="number"
                  placeholder="30"
                  onChange={handleMinPriceChange}
                  className="border p-2 w-full md:w-[100px] rounded-3xl"
                />
                <a className='text-center'>-</a>
                {/* Max Price Input */}
                <input
                  type="number"
                  placeholder="100 บาท"
                  onChange={handleMaxPriceChange}
                  className="border p-2 w-full md:w-[100px] rounded-3xl"
                />
              </div>              
              </div>

          </div>
        </div>


          <div>

          </div>
 



          {/* Sorting Buttons */}
          <div className="mt-5 flex justify-center gap-1 md:gap-4">
            <button
              onClick={() => handleSortChange('')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === '' ? 'bg-[#4eac14] text-white' : 'bg-[#ffffff]'}`}
            >
              ทั้งหมด 😯
            </button>
            <button
              onClick={() => handleSortChange('newest')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'newest' ? 'bg-[#4eac14] text-white' : 'bg-[#ffffff]'}`}
            >
              สับปะรดมาใหม่ 🍍
            </button>
            <button
              onClick={() => handleSortChange('oldest')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'oldest' ? 'bg-[#4eac14] text-white' : 'bg-[#ffffff]'}`}
            >
              สับปะรดรุ่นเก๋า 🕰️
            </button>
            <button
              onClick={() => handleSortChange('highest-review')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'highest-review' ? 'bg-[#4eac14] text-white' : 'bg-[#ffffff]'}`}
            >
              รีวิวปังที่สุด ⭐️
            </button>
            <button
              onClick={() => handleSortChange('lowest-review')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'lowest-review' ? 'bg-[#4eac14] text-white' : 'bg-[#ffffff]'}`}
            >
              รีวิวเบาๆ 🤔
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <div className='p-4'>
              <Skeleton />
            </div>
          ) : error ? (
            <div className="alert alert-error justify-center flex items-center text-gray-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg">
              {isMockData && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                  ⚠️ แสดงข้อมูลตัวอย่าง - ฐานข้อมูลไม่พร้อมใช้งาน (Demo Data)
                </div>
              )}
              <ProductCard products={filteredProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
