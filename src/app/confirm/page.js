'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Confirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetch(`http://localhost:3000/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrderDetails(data))
        .catch((err) => console.error('Error fetching order details:', err));
    }
  }, [orderId]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='top-container'>
      <h1>Order Confirmation</h1>
      <p>Order ID: {orderDetails.id}</p>
      <p>Product: {orderDetails.product.ProductName}</p>
      <p>Quantity: {orderDetails.quantity}</p>
      <p>Total Price: {orderDetails.totalPrice}</p>
      <p>Address: {orderDetails.address.addressLine}, {orderDetails.address.tambon}, {orderDetails.address.amphoe}, {orderDetails.address.province}, {orderDetails.address.postalCode}</p>
    </div>
  );
}