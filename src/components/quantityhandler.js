"use client";
import { useCart } from '@/context/cartContext';
import { useState } from 'react';

export default function QuantityHandler({ productAmount, productId}) {
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const increment = () => {
    if (quantity < productAmount) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


    // Add to cart handler
    const handleAddToCart = async () => {
      const productResponse = await fetch(`http://localhost:3000/api/product/${productId}`);
      const productData = await productResponse.json();
  
      const item = {
        productId,
        quantity,
        productName: productData.ProductName,
        productType: productData.ProductType,
        productPrice: productData.Price,
      };
  
      addItemToCart(item); // Update cart context
      alert('Product added to cart');
    };

  return (
    <div>
        <div className=' flex items-center'>
            <button className='btn w-10 h-10 border-2  text-center' onClick={decrement}>
                -
            </button>
            <div className='w-10 h-10 border-2 flex items-center justify-center'>
                <p>
                {quantity}        
                </p>
            </div>
            <button className='btn w-10 h-10 border-2' onClick={increment}>
                +
            </button>            
        </div>


      <button className='bg-green-500 rounded w-[100px]'onClick={handleAddToCart} >
        สั่งซื้อ
      </button>
    </div>
  );
}

