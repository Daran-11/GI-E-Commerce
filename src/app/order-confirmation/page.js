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

  // Function to navigate back to the index page
  const navigateToHome = () => {
    router.push('/'); // Navigate to the index page
  };  

  if (error) {
    return <div>{error}</div>;
  }

  if (!orders) {
    return <div>Loading...</div>;
  }


  const totalSum = orders.reduce((sum, order) => {
    return sum + order.totalPrice;
  }, 0); // '0' is the initial value for the sum

  return (
    <div className="w-[95%] md:w-[65%]  ml-auto mr-auto mt-[100px] h-full  py-4 px-3 space-y-5 ">

      <div className="bg-white w-full h-fit p-4 md:p-6 rounded-xl">
        <h1 className="page-header  !text-[#4eac14] ">ชำระเงินสำเร็จ</h1>
        <p className="text-xl">คำสั่งซื้อของคุณถูกส่งให้ผู้ขายแล้ว ขอบคุณที่ใช้บริการค่ะ</p>
      </div>

      <div className="bg-white w-full h-fit p-4 md:p-6 rounded-xl ">
        <p className="text-2xl border-b-2 pb-2 mb-3">ข้อมูลผู้ซื้อ</p>
        <p>ชื่อ {session.user.name}</p>
        <p>อีเมล {session.user.email}</p>
        <p>เบอร์โทร {session.user.phone}</p>
      </div>

      <div className="bg-white w-full h-fit  p-3 md:p-5 rounded-xl ">
        <div className="flex justify-between items-center pt-3 text-2xl  border-b-2 pb-2 mb-3">
          <p className="">สรุปคำสั่งซื้อ</p>
          <p className="">รวมทั้งสิ้น {totalSum} บาท</p>
        </div>

        {orders.map((order , index) => (
        <div key={order.id} className="order border-2 p-3  md:p-5 my-5">
              
          <div>
            <p className="text-xl">รหัสคำสั่งซื้อ: {order.id}</p>
            <p>การชำระเงิน: {order.paymentStatus}</p>
            <p>ผู้ขาย: {order.farmer.farmerName}</p>
          </div>
          
          <div className="my-2">
            <h3><strong>ทีอยู่สำหรับจัดส่ง</strong></h3>
            <p>{order.addressText}</p>
          </div>

          <div>
            <h3><strong>รายละเอียดสินค้า</strong></h3>

            <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 md:px-2 md:py-2  text-left">ชื่อสินค้า</th>
                  <th className="border border-gray-300 md:px-4 md:py-2">จำนวน</th>
                  <th className="border border-gray-300 md:px-4 md:py-2 ">ราคา (บาท)</th>
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
                  <td colSpan="3" className="border border-gray-300 md:px-4 md:py-2 font-bold">
                    รวม:
                  </td>
                  <td className="border border-gray-300 md:px-4 md:py-2 font-bold">
                    {order.totalPrice.toFixed(2)} บาท
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
          ))} 
       {/* Add a Back to Home Button */}
      <div className="mt-8 text-center">
        <button
          onClick={navigateToHome}
          className="w-[200px] px-4 py-2 bg-[#4eac14] text-white rounded-md hover:bg-[#316b0c] transition duration-200"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
      </div>
    </div>
  );
}
