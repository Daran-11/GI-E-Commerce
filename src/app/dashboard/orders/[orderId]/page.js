"use client";
// pages/farmer/incoming-orders/[orderId].js
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const deliveryStatusTranslations = {
  Preparing: 'กำลังเตรียมสินค้า',
  Shipped: 'ระหว่างการจัดส่ง',
  OutForDelivery: 'กำลังจัดส่ง',
  Delivered: 'จัดส่งสำเร็จ',
  Canceled: 'ยกเลิก',
  Returned: 'ส่งคืน',
  FailedDelivery: 'การจัดส่งล้มเหลว',
  AwaitingPickup: 'รอการรับพัสดุ',
  RefundProcessed: 'คืนเงินเสร็จสิ้น',
};

const paymentStatusTranslations = {
  Pending: 'รอดำเนินการชำระเงิน',
  Completed: 'ชำระเงินแล้ว',
  Failed: 'ชำระเงินล้มเหลว',
  Refunded: 'คืนเงินแล้ว',
  Processing: 'กำลังดำเนินการ',
};

const statusColors = {
  Preparing: 'text-white bg-yellow-500 border-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500',
  Shipped: 'text-white bg-purple-500 border-2 border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500',
  OutForDelivery: 'text-white bg-orange-500 border-2 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500',
  Delivered: 'text-white bg-green-500 border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500',
  Canceled: 'text-white bg-red-500 border-2 border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500',
  Returned: 'text-white bg-purple-500 border-2 border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500',
  FailedDelivery: 'text-white bg-red-600 border-2 border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600',
  AwaitingPickup: 'text-white bg-gray-500 border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500',
  RefundProcessed: 'text-white bg-blue-600 border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
};

const paymentStatusColors = {
  Pending: 'text-white bg-yellow-500 border-2 border-yellow-500',
  Completed: 'text-[#4eac14]',
  Failed: 'text-white bg-red-600 border-2 border-red-600',
  Refunded: 'text-white bg-purple-500 border-2 border-purple-500',
  Processing: 'text-white bg-blue-600 border-2 border-blue-600',
};

export default function OrderDetails({ params }) {
  const { data: session, status } = useSession();
  const [order, setOrder] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { orderId } = params;

  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  useEffect(() => {
    if (status === 'authenticated' && orderId && userId) {
      fetchOrderDetails(orderId);
    }
  }, [session, status, orderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await fetch(`/api/users/${userId}/farmer/orders/?id=${orderId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await res.json();
      setOrder(data);
      setDeliveryStatus(data.deliveryStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryStatusChange = async (e) => {
    const newStatus = e.target.value;
    setDeliveryStatus(newStatus);

    try {
      const res = await fetch(`/api/users/${session.user.id}/farmer/orders/?order=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update delivery status');

      // Refetch the order details to reflect the updated status
      fetchOrderDetails(orderId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (status === 'loading' || loading || !orderId) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className='w-full h-fit space-y-5'>
      <div className="bg-white w-full h-fit p-4 md:p-6 rounded-xl">
        {/* Conditionally render the "Go Back" button if the user is an admin */}
        {userRole === 'admin' && (
          <div className="mb-4">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-white-100 text-black rounded-2xl border-2 border-\[\#d4d4d4\]  hover:border-[#4EAC14]"
            >
              กลับ
            </button>
          </div>
        )}

        <h1 className="page-header !text-[#4eac14]">
          รายละเอียดคำสั่งซื้อ ORDER#{order.id}
        </h1>

        <div className='flex justify-start space-x-4 mt-4'>
          <div className={`${paymentStatusColors[order.paymentStatus]} h-fit w-fit p-4 text-center border-2 border-transparent py-1 rounded-3xl`}>
            {paymentStatusTranslations[order.paymentStatus] === 'ชำระเงินแล้ว' ? (
              <div><CheckRoundedIcon /> {paymentStatusTranslations[order.paymentStatus]}</div>
            ) : (
              <div>{paymentStatusTranslations[order.paymentStatus]}</div>
            )}
          </div>

          {/* Delivery Status */}
          <div className=''>
            <select
              id="deliveryStatus"
              value={deliveryStatus}
              onChange={handleDeliveryStatusChange}
              className={`${statusColors[deliveryStatus]} border-r-8 border-transparent py-1 rounded-3xl`}
            >
              {Object.keys(deliveryStatusTranslations).map((status) => (
                <option key={status} value={status} className="text-black bg-white text-center">
                  {deliveryStatusTranslations[status]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white w-full h-fit p-4 md:p-6 rounded-xl">
        <p className="text-2xl border-b-2 pb-2 mb-3">ข้อมูลผู้ซื้อ</p>
        <p>ชื่อ {order.user.name}</p>
        <p>อีเมล {order.user.email}</p>
        <p>เบอร์โทร {order.user.phone}</p>
        <div className="my-2">
          <h3><strong>ที่อยู่สำหรับจัดส่ง</strong></h3>
          <p>{order.addressText}</p>
        </div>
      </div>

      <div className="bg-white w-full h-fit p-4 md:p-6 rounded-xl">
        <p className="text-2xl border-b-2 pb-2 mb-3">บริการขนส่ง</p>
        <p><strong>ชือบริษัท:</strong> {order.delivery?.deliveryService?.name || (
              <span className="text-gray-300">ไม่พบข้อมูลในตอนนี้</span>
            )} </p>
        <p><strong>รหัสพัสดุ:</strong> {order.delivery?.trackingNum || (
              <span className="text-gray-300">ไม่พบข้อมูลในตอนนี้</span>
            )} </p>

      </div>

      <div className='bg-white w-full h-fit p-3 md:p-5 rounded-xl'>
        <h3 className='text-2xl border-b-2 pb-2 mb-3'>รายละเอียดสินค้า</h3>
        <table className="min-w-full h-fit table-auto border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 md:px-2 md:py-2 text-left">ชื่อสินค้า</th>
              <th className="border border-gray-300 md:px-4 md:py-2">จำนวน</th>
              <th className="border border-gray-300 md:px-4 md:py-2">ราคา (บาท)</th>
              <th className="border border-gray-300 md:px-4 md:py-2 text-right">ราคารวม (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 md:px-2 md:py-2 text-left">
                  {item.product.ProductName}{item.product.ProductType}
                </td>
                <td className="border border-gray-300 md:px-4 md:py-2">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 md:px-4 md:py-2">
                  {item.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 md:px-4 md:py-2 text-right">
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 text-right">
              <td colSpan="3" className="border border-gray-300 md:px-4 md:py-2 font-bold">รวม:</td>
              <td className="border border-gray-300 md:px-4 md:py-2 font-bold">{order.totalPrice.toFixed(2)} บาท</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
