"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const orderId = sessionStorage.getItem('orderId');
    if (!orderId) {
      // Redirect to another page if orderId is not found in session storage
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const orderIdString = sessionStorage.getItem('orderId');
      const orderId = JSON.parse(orderIdString);
      if (orderId && orderId.length > 0) {
        const fetchOrder = async () => {
          try {
            const response = await fetch(`/api/orders?id=${orderId.join(',')}`);
            if (response.ok) {
              const data = await response.json();
              console.log('data is:',data); // Add this to inspect the API response
              setOrders(data.orders);

              sessionStorage.removeItem('orderId');
            } else {
              setError("Order not found");
            }
          } catch (error) {
            setError("Failed to fetch order details");
          }
        };
        fetchOrder();
      } else {
        setError("No order ID provided");
      }
    }
  }, [status, router]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!orders) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[65%]  ml-auto mr-auto mt-[100px] h-full bg-white p-6 rounded-xl">
      <h1 className="page-header  !text-[#4eac14] ">สั่งซื้อสำเร็จ</h1>
      <div className="order-summary text-xl space-y-5">
        <p>ออเดอร์ของคุณถูกส่งให้ผู้ขายแล้ว ขอบคุณที่ใช้บริการค่ะ</p>

        {/* Loop through each order */}


        <div className="">
              <h2><strong>ผู้ซื้อ</strong></h2>
              <p>{session.user.name}</p>
              <p>{session.user.email}</p>
              <p>{session.user.phone}</p>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="order">
            
            <div>
              <p>รหัสออเดอร์: {order.id}</p>
              <p>สถานะขนส่ง: {order.deliveryStatus}</p>
              <p>สถานะการโอนเงิน: {order.paymentStatus}</p>

            </div>



            <div>
              <h3><strong>ทีอยู่สำหรับจัดส่ง</strong></h3>
              <p>{order.addressText}</p>
            </div>

            <div>
              <h3><strong>รายละเอียดสินค้า</strong></h3>

              {/* Loop through each order's items */}
              {order.orderItems.map((item) => (
                <div key={item.id} className="order-item">
                  <p>ชื่อสินค้า {item.product.ProductName} {item.product.ProductType}</p>
                  <p>ผู้ขาย {item.farmer.farmerName}</p>
                  <p>จำนวน {item.quantity} กิโลกรัม</p>
                  <p>ราคา {item.price} บาท</p>
                  <p><strong>รวม</strong> {order.totalPrice} บาท</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p>ขอบคุณสำหรับคำสั่งซื้อค่ะ</p>
      </div>
    </div>
  );
}
