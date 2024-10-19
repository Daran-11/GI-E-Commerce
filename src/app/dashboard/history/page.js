"use client";
import Search from "@/app/ui/dashboard/search/search";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from "@/app/ui/dashboard/products/products.module.css";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Tooltip } from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

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
      console.log("This is the data from history", data)
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <tr className='text-xs 2xl:text-base  bg-gray-100'>
            <th className="border px-4 py-2">รหัสคำสั่งซื้อ</th>
            <th className="border px-4 py-2">ราคารวม</th>
            <th className="border px-4 py-2">สถานะคำสั่งซื้อ</th>
            <th className="border px-4 py-2">สถานะการชำระเงิน</th>
            <th className="border px-4 py-2">สถานะการจัดส่ง</th>
            <th className="border px-4 py-2">วันที่เสร็จสิ้น</th> 
            <th className="border px-4 py-2">แอ็คชั่น</th> 
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((history) => (
              <tr
                key={history.id}
                className=" hover:bg-gray-100"
                
              >
                <td className="border px-4 py-2 text-center">{history.orderId}</td>
                <td className="border px-4 py-2 text-center">{history.totalPrice}</td>
                <td className={`border px-4 py-2 text-center ${getStatusColor(history.status)}`}>
                  {history.status}
                </td>
                <td className={`border px-4 py-2 text-center ${getStatusColor(history.paymentStatus)}`}>
                  {history.paymentStatus}
                </td>
                <td className={`border px-4 py-2 text-center ${getStatusColor(history.deliveryStatus)}`}>
                  {history.deliveryStatus}
                </td>
                <td className="border px-4 py-2 text-center">
                  {new Date(history.completedAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td> {/* Display completedAt with time */}

                <td className="border-b border-r px-2  md:py-2 text-center">
            <Tooltip title="ดูรายละเอียด" arrow>
              <IconButton
                aria-label="view"
                color="primary"
                onClick={() => router.push(`/dashboard/orders/${history.orderId}`)}
              >
                <div className="border-2 text-sm md:px-2 py-1 rounded-xl">
                  <VisibilityRoundedIcon /> ดูเพิ่มเติม
                </div>
              </IconButton>
            </Tooltip>
            </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border px-4 py-2 text-center">
                ไม่พบประวัติคำสั่งซื้อ
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}
