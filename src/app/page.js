"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/productcard";
import Skeleton from "../components/Skeleton"; // Import your Skeleton component
import debounce from "lodash.debounce"; // Import lodash debounce

async function fetchProducts(sortBy = '') {
  console.log('Fetching products...');
  try {
    const res = await fetch(`/api/product?sortBy=${sortBy}`);
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
  const [loading, setLoading] = useState(true); // Add loading state
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const router = useRouter();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Fetch products whenever sortBy changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true); // Start loading
      const { products, error } = await fetchProducts(sortBy);
      if (error) {
        setError(error);
      } else {
        setProducts(products);
      }
      setLoading(false); // End loading
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
      <div className="w-[95%] md:w-[80%] m-auto mt-[100px] md:mt-5 md:p-6 rounded-xl">
        <div className="hidden md:block image bg-pineapple w-auto h-[300px] mt-[50px] lg:h-[250px] bg-no-repeat bg-cover bg-scroll bg-center rounded-xl"></div>
        <div className="mb-5 md:mt-5 bg-white p-2 md:p-6 rounded-xl">
          ค้นหาจากราคา
          <div className="flex gap-2 md:gap-4 items-center ">
            {/* Min Price Input */}
            <input
              type="number"
              placeholder="30"
              onChange={handleMinPriceChange}
              className="border p-2 w-full md:w-[250px] rounded-xl"
            />
            <a className='text-center'>-</a>
            {/* Max Price Input */}
            <input
              type="number"
              placeholder="100 บาท"
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
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'newest' ? 'bg-[#4eac14] text-white' : 'bg-[#f1f1f1]'}`}
            >
              สับปะรดมาใหม่ 🍍
            </button>
            <button
              onClick={() => handleSortChange('oldest')}
              className={`btn p-1 md:p-2 hover:outline outline-2 outline-[#4eac14] rounded-xl ${sortBy === 'oldest' ? 'bg-[#4eac14] text-white' : 'bg-[#f1f1f1]'}`}
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
          {loading ? ( // Conditional rendering based on loading state
            <Skeleton />
          ) : error ? (
            <div className="alert alert-error justify-center flex items-center text-gray-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg"> {/* Background div for ProductCard */}
              <ProductCard products={filteredProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
