'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const deliveryStatusTranslations = {
  Preparing: 'กำลังเตรียมสินค้า',
  Shipped: 'บริษัทขนส่งรับสินค้าแล้ว',
  OutForDelivery: 'กำลังจัดส่ง',
  Delivered: 'สำเร็จ',
  Canceled: 'ยกเลิก',
  Returned: 'ส่งคืน',
  FailedDelivery: 'การจัดส่งล้มเหลว',
  RefundProcessed: 'คืนเงินเสร็จสิ้น',
};

const deliveryStatuses = ['Preparing', 'Shipped', 'OutForDelivery', 'Delivered'];

function OrderDetails({ params }) {
  const { orderId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    // Fetch order details if authenticated
    if (status === 'authenticated' && session?.user?.id && orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(
            `/api/users/${session.user.id}/purchases/${orderId}`
          );
          if (response.ok) {
            const data = await response.json();
            setOrderDetails(data.order);
          } else {
            setError('Failed to fetch order details');
          }
        } catch (error) {
          setError('An error occurred while fetching order details');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [status, session, router, orderId]);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

// Calculate current step based on delivery status, ensuring it only uses the defined deliveryStatuses array
const currentStepIndex = deliveryStatuses.includes(orderDetails.deliveryStatus)
  ? deliveryStatuses.indexOf(orderDetails.deliveryStatus)
  : deliveryStatuses.length - 1; // Default to the last step if the status is not found

  return (
    <div className="w-full h-screen bg-white p-6 rounded-xl">
      <h1>ข้อมูลคำสั่งซื้อ</h1>
      <div className="order-summary mb-6">
        <p><strong>หมายเลขคำสั่งซื้อ:</strong> {orderDetails.id}</p>
        <p><strong>ผู้ขาย:</strong> {orderDetails.farmer.farmerName}</p>
        <p><strong>สถานะ:</strong> {deliveryStatusTranslations[orderDetails.deliveryStatus]}</p>
        <p><strong>รวมทั้งสิ้น</strong> {orderDetails.totalPrice} บาท</p>
        <p><strong>ที่อยู่จัดส่ง:</strong> {orderDetails.addressText}</p>
        <p><strong>บริษัทขนส่ง:</strong> </p>
        <p><strong>รหัสพัสดุ:</strong> </p>

        {/* Progress bar */}
        <div className="progress-bar-container my-4   ">
          <div className='relative '>
            {/* Progress Bar Line */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2  w-[75%]   h-2  bg-gray-300 rounded-full"></div>

            <div
              className={` absolute top-3 left-0  h-2 rounded-full pulse`}
              style={{
                width: `${((currentStepIndex + 1) / deliveryStatuses.length) * 100 }%`,
                maxWidth: `87%` ,
                backgroundColor: '#4eac14',
              }}
            ></div>            
          </div>


          {/* Circles */}
          <div className="relative z-10 flex justify-between items-between mb-4">
            {deliveryStatuses.map((status, index) => (
              <div key={status} className="flex-1  text-center relative ">
                <div
                  className={` w-8 h-8 rounded-full flex mx-auto   ${
                    index <= currentStepIndex ? 'bg-[#4eac14]' : 'bg-gray-300'
                  }`}
                >

                </div>

                <p className=" mt-5 text-sm">{deliveryStatusTranslations[status]}</p>
              </div>
            ))}
          </div>
        </div>
        <h2>รายละเอียดสินค้า</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2">ชื่อสินค้า</th>
              <th className="border border-gray-300 px-2 py-2">ประเภทสินค้า</th>
              <th className="border border-gray-300 px-4 py-2">จำนวน</th>
              <th className="border border-gray-300 px-4 py-2 ">ราคา (บาท)</th>
              <th className="border border-gray-300 px-4 py-2 text-right">ราคารวม (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.orderItems.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 px-2 py-2">
                  {item.product.ProductName}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {item.product.ProductType}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.price.toFixed(2)} บาท
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {(item.quantity * item.price).toFixed(2)} บาท
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 text-right">
              <td colSpan="4" className="border border-gray-300 px-4 py-2 font-bold">
                รวม:
              </td>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                {orderDetails.totalPrice.toFixed(2)} บาท
              </td>
            </tr>
          </tfoot>
        </table>
        {/* Conditionally render the button based on deliveryStatus */}
        {orderDetails.deliveryStatus === 'OutForDelivery' && (
          <div className='w-full h-fit flex justify-end mt-5'>
            <button className='w-fit px-4 py-2 text-white bg-[#4eac14] hover:bg-[#316b0c] rounded-xl'>
              ยืนยันการได้รับสินค้า
            </button>
          </div>
        )}


      </div>
    </div>
  );
}

export default OrderDetails;
