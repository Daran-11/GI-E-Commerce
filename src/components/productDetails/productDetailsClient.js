"use client";
import QuantityHandler from '@/components/quantityhandler';
import { useCart } from '@/context/cartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantity(newQuantity);
  };

  const addToCart = async () => {
    const productResponse = await fetch(`http://localhost:3000/api/product/${product.ProductID}`);
    const productData = await productResponse.json();

    const item = {
      productId: productData.ProductID,
      quantity: quantity,
      productName: productData.ProductName,
      productType: productData.ProductType,
      productPrice: productData.Price,
      productAmount: productData.Amount,
    };

    try {
      await addItemToCart(item);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const buyNow = async () => {
    const productResponse = await fetch(`http://localhost:3000/api/product/${product.ProductID}`);
    const productData = await productResponse.json();

    const item = {
      productId: productData.ProductID,
      quantity: quantity,
      productName: productData.ProductName,
      productType: productData.ProductType,
      productPrice: productData.Price,
      productAmount: productData.Amount,
    };

    try {
      await addItemToCart(item);
      router.push('/cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };




  return (
    <>
      <h1>Product ID: {product.ProductID}</h1>
      <p>Product Name: {product.ProductName}</p>
      <p>ราคา: ${product.Price}</p>
      <p>มีสินค้า: {product.Amount}</p>
      <QuantityHandler
        initialQuantity={quantity}
        productAmount={product.Amount}
        productId={product.ProductID}
        onQuantityChange={handleQuantityChange}
      />
  <div className=''>
      <button 
      className='action-button bg-[#4EAC14] rounded-xl text-white w-[150px] h-[50px] font-light'
      onClick={buyNow}
      >
        ซื้อเลย
      </button>

      
        <button 
          className='action-button ml-4 text-[#4EAC14] border-2  border-gray-500 rounded-xl  ' 
          onClick={addToCart}>
          เพิ่มในตะกร้า
        </button>        
 
  </div>

    </>
  );
}


