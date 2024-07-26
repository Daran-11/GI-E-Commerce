"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const productId = searchParams.get('productId');
    const productName = searchParams.get('productName');
    const productType = searchParams.get('productType');
    const productPrice = searchParams.get('productPrice');
    const quantity = searchParams.get('quantity');

    if (productId) {
      setProductData({
        productId,
        productName,
        productType,
        productPrice,
        quantity,
      });
    }
  }, [searchParams]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='top-container'>
      <h1>Checkout Page</h1>
      <p>Product Name: {productData.productName}</p>
      <p>Product Type: {productData.productType}</p>
      <p>Price: ${productData.productPrice}</p>
      <p>Quantity: {productData.quantity}</p>
      <p>Total: ${productData.productPrice * productData.quantity}</p>
      <button className="bg-blue-500 rounded w-[150px] mt-4">
        Confirm Purchase
      </button>
    </div>
  );
}