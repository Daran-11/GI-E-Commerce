// pages/farmer/incoming-orders.js
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function IncomingOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch orders only when the session is available and the user is authenticated
      fetchOrders(session.user.id);
    }
  }, [session, status]);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}/farmer/orders`);
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push("/login");
    return null;
  }

  const viewOrderDetails = (orderId) => {
    if (orderId)
    {
      router.push(`/dashboard/orders/${orderId}`); // Redirect to order details page      
    } else{
      console.log("no orderId found");
    }

  };

  return (
    <div>
      <h1>Incoming Orders</h1>
      {orders.length === 0 ? (
        <p>No incoming orders at the moment</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Payment Status</th>
              <th className="border px-4 py-2">Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push(`/dashboard/orders/${order.id}`)}
              >
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.totalPrice}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">{order.paymentStatus}</td>
                <td className="border px-4 py-2">{order.deliveryStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
