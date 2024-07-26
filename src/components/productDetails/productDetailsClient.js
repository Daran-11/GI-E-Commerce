"use client";
import QuantityHandler from '@/components/quantityhandler';
import { useCart } from '@/context/cartContext';
import { useState } from 'react';

export default function ProductDetailsClient({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantity(newQuantity);
  };

  const addToCart = async () => {
    const item = {
      productId: product.ProductID,
      quantity: quantity,
      productName: product.ProductName,
      productType: product.ProductType,
      productPrice: product.Price,
      productAmount: product.Amount,
    };

    try {
      await addItemToCart(item);
      alert('Product added to cart');
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
      <button className='bg-blue-500 rounded w-[100px]' onClick={addToCart}>
        เพิ่มในตะกร้า
      </button>
      <button className='bg-green-500 rounded w-[150px]'>
        สั่งซื้อ
      </button>
    </>
  );
}


