// pages/farmer/incoming-orders.js
"use client";
import Search from "@/app/ui/dashboard/search/search";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from "@/app/ui/dashboard/products/products.module.css";

export default function History() {
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
      const res = await fetch(`/api/users/${userId}/farmer/history`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'text-green-600';
      case 'Pending':
      case 'Preparing':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push("/login");
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาสินค้า..." />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className="border px-4 py-2">รหัสคำสั่งซื้อ</th>
            <th className="border px-4 py-2">ราคารวม</th>
            <th className="border px-4 py-2">สถานะคำสั่งซื้อ</th>
            <th className="border px-4 py-2">สถานะการชำระเงิน</th>
            <th className="border px-4 py-2">สถานะการจัดส่ง</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((history) => (
              <tr
                key={history.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push(`/dashboard/orders/${history.id}`)}
              >
                <td className="border px-4 py-2">{history.id}</td>
                <td className="border px-4 py-2">{history.totalPrice}</td>
                <td className={`border px-4 py-2 ${getStatusColor(history.status)}`}>
                  {history.status}
                </td>
                <td className={`border px-4 py-2 ${getStatusColor(history.paymentStatus)}`}>
                  {history.paymentStatus}
                </td>
                <td className={`border px-4 py-2 ${getStatusColor(history.deliveryStatus)}`}>
                  {history.deliveryStatus}
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
