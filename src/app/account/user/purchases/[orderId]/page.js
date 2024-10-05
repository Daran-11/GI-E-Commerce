'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const deliveryStatusTranslations = {
  Preparing: 'กำลังเตรียมสินค้า',
  Shipped: 'ส่งให้บริษัทขนส่งแล้ว',
  OutForDelivery: 'กำลังจัดส่ง',
  Delivered: 'สำเร็จ',
  Canceled: 'ยกเลิก',
  Returned: 'ส่งคืน',
  FailedDelivery: 'การจัดส่งล้มเหลว',
  //AwaitingPickup: 'รอการรับ',
  RefundProcessed: 'คืนเงินเสร็จสิ้น',
};

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
   if (status === 'authenticated' && session?.user?.id && orderId)  {
      const fetchOrderDetails = async () => {
        try {
         
            const response = await fetch(
              `/api/users/${session.user.id}/purchases/${orderId}`);
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

  return (
    <div className="w-full h-screen bg-white p-6 rounded-xl">
      <h1>Order Summary</h1>
      <div className="order-summary">
        <p><strong>Order ID:</strong> {orderDetails.id}</p>
        <p><strong>Delivery Status:</strong> {orderDetails.deliveryStatus}</p>
        <p><strong>Total Price:</strong> ${orderDetails.totalPrice}</p>
        <p><strong>Address:</strong> {orderDetails.addressText}</p>

        <h2>Order Items</h2>
        {orderDetails.orderItems.map((item) => (
          <div key={item.id} className="order-item">
            <p><strong>Product Name:</strong> {item.product.ProductName}{item.product.ProductType}</p>
            <p><strong>Farmer:</strong> {item.farmer.farmerName}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Total:</strong> ${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetails;
