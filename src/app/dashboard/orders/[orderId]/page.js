"use client";
// pages/farmer/incoming-orders/[orderId].js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetails({params}) {
  const { data: session, status } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { orderId } = params;

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

  useEffect(() => {
    if (status === 'authenticated' && orderId) {
      // Fetch order details when orderId is available
      fetchOrderDetails(orderId);
    }
  }, [session, status, orderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await fetch(`/api/users/${session.user.id}/farmer/orders/?id=${orderId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch order details');
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
  <h1 className=" px-4 text-2xl p-3  md:p-5 my-5 font-medium">รายละเอียดคำสั่งซื้อ</h1>
    <div className=" text-lg " >  
      <div className=" border border-zinc-800">
      <h2 className=" px-4 py-2 ">รหัสคำสั่งซื้อ: {order.id}</h2>
      <p className=" px-4 py-2 ">ราคารวม: {order.totalPrice}</p>
      <p className={` px-4 py-2 ${getStatusColor(order.status)}`}>สถานะคำสั่งซื้อ: {order.status}</p>
      <p className={` px-4 py-2 ${getStatusColor(order.paymentStatus)}`}>สถานะการชำระเงิน: {order.paymentStatus}</p>
      <p className={` px-4 py-2 ${getStatusColor(order.deliveryStatus)}`}>สถานะการจัดส่ง: {order.deliveryStatus}</p>
      </div>
      <h1 className=" p-4  md:p-5 my-5 text-2xl font-medium" >รายการที่สั่งซื้อ</h1>
      <table className="  border table-auto w-full text-lg border-zinc-800">
        <thead>
          <tr>
            <th className="border border-zinc-800 px-4 py-2">ชื่อสินค้า</th>
            <th className="border border-zinc-800 px-4 py-2">จำนวน</th>
            <th className="border border-zinc-800 px-4 py-2">ราคา</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2 border-zinc-800">{item.product.ProductName}</td>
              <td className="border px-4 py-2 border-zinc-800">{item.quantity}</td>
              <td className="border px-4 py-2 border-zinc-800">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
