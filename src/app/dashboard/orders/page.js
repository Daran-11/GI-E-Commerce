// pages/farmer/incoming-orders.js
"use client";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/products/products.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function IncomingOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  const changeDeliveryStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}/farmer/orders/updateDeliveryStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          deliveryStatus: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update delivery status');
      }

      fetchOrders(session.user.id);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
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
    if (orderId) {
      router.push(`/dashboard/orders/${orderId}`);
    } else {
      console.log("No orderId found");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาสินค้า..." />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Payment Status</th>
            <th className="border px-4 py-2">Delivery Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (orders.map((order) => (
            <tr
              key={order.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => viewOrderDetails(order.id)}
            >
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.totalPrice}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{order.paymentStatus}</td>
              <td className="border px-4 py-2">{order.deliveryStatus}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    changeDeliveryStatus(order.id, 'Delivered');
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Mark as Delivered'}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    changeDeliveryStatus(order.id, 'Preparing');
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Mark as Preparing'}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="border px-4 py-2 text-center">
              ไม่มีประวัติคำสั่งซื้อ
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}
