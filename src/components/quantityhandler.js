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
        <span>{quantity}</span>
        </div>
        <button className='btn w-10 h-10 border-2' onClick={increment}>
          +
        </button>
      </div>
    </div>
  );
}