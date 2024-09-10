"use client";
import { useCart } from '@/context/cartContext';
import { useEffect, useState } from 'react';

export default function QuantityHandler({ productAmount, productId, initialQuantity, onQuantityChange }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const {updateItemQuantity} = useCart();

  useEffect(() => {
    console.log('Initializing quantity with:', initialQuantity);
    console.log('Prop changes:', { initialQuantity, quantity });
    setQuantity(initialQuantity);
    
  }, [initialQuantity]);


  useEffect(() => {
    console.log('QuantityHandler props:', { productAmount, productId, initialQuantity, onQuantityChange });
  }, [productAmount, productId, initialQuantity, onQuantityChange]);


  useEffect(() => {
    if (quantity !== initialQuantity) {
      onQuantityChange(productId, quantity);
    }
  }, [quantity]);


  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= productAmount)
    console.log('newQuantity',newQuantity, 'product',productId);
    setQuantity(newQuantity);
    updateItemQuantity(productId, newQuantity);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
    } else {
      let newQuantity = parseInt(value, 10);
      if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
      } else if (newQuantity > productAmount) {
        newQuantity = productAmount;
      }
      handleQuantityChange(newQuantity);
    }
  };

  const handleBlur = () => {
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
      updateItemQuantity(productId, 1);
    }
  };


  

  const increment = () => {
    if (quantity < productAmount) {
      console.log("+ triggered")
      handleQuantityChange(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <div>
      <div className='flex items-center'>
        <button className='btn w-10 h-10 border-2 text-center' onClick={decrement}>
          -
        </button>
        <div className='w-10 h-10 border-2 flex items-center justify-center'>
        <input
          type="number"
          className="w-10 h-10 border-2 text-center appearance-none"
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min="1"
          max={productAmount}
        />
        </div>
        <button className='btn w-10 h-10 border-2' onClick={increment}>
          +
        </button>
      </div>
      <style jsx>{`
        /* Chrome, Safari, Edge, Opera */
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}