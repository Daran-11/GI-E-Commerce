"use client";
import { getSession } from 'next-auth/react';
import { useState } from 'react';

export default function QuantityHandler({ productAmount, productId}) {
  const [quantity, setQuantity] = useState(1);

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
    const session = await getSession();
    
    const productResponse = await fetch(`http://localhost:3000/api/product/${productId}`);
    const productData = await productResponse.json();

    let cart = JSON.parse(localStorage.getItem('cart')) || []; // User is not logged in, store cart in local storage
    const existingItem = cart.find(item => item.productId === productId);



    if (session) {
      // User is logged in, store cart in database
      const response = await fetch('http://localhost:3000/api/auth/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });



      if (response.ok) {
        alert('Product added to cart');
      } else {
        alert('Failed to add product to cart');
      }
    } else {

      //store it in local if not logged in
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ productId , 
                    quantity , 
                    productName: productData.ProductName , 
                    productType: productData.ProductType,
                    productPrice: productData.Price,
                  });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart');
    }
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


      <button className='bg-green-500 rounded w-[100px]'onClick={handleAddToCart}>
        สั่งซื้อ
      </button>
    </div>
  );
}

