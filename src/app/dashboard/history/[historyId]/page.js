"use client";
// pages/farmer/incoming-orders/[orderId].js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HistoryDetail({ params }) {
  const { data: session, status } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { orderId } = params;

  useEffect(() => {
    if (status === 'authenticated' && orderId) {
      // Fetch order history details when the session is available and orderId is valid
      fetchOrderHistoryDetails(orderId);
    }
  }, [session, status, orderId]);

  const fetchOrderHistoryDetails = async (orderId) => {
    try {
      const res = await fetch(`/api/users/${session.user.id}/farmer/history?id=${orderId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch order history details');
      }
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle loading and undefined cases
  if (status === 'loading' || loading || !orderId) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <h1>Order History Details</h1>
      <h2>Order ID: {order.id}</h2>
      <p>Total Price: {order.totalPrice}</p>
      <p>Status: {order.status}</p>
      <p>Payment Status: {order.paymentStatus}</p>
      <p>Delivery Status: {order.deliveryStatus}</p>

      <h3>Order Items</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.product.ProductName}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
