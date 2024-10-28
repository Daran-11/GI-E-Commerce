"use client";
import AddressManagement from "@/components/AddressManagement";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutClient({ userId }) {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [addressUpdated, setAddressUpdated] = useState(false);
  const [clicked, setClicked] = useState(false); // New state for button click
  const [checkoutData, setCheckoutData] = useState(null);

  // Function to fetch the default address
  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/default-address`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setAddressId(data.id);
        } else {
          setError("กรุณาตั้งค่าที่อยู่จัดส่งเริ่มต้น"); // "Please set a default shipping address"
        }
      } else {
        console.error("Failed to fetch default address");
        setError("ไม่สามารถดึงที่อยู่เริ่มต้นได้"); // "Unable to fetch default address"
      }
    } catch (error) {
      console.error("Error fetching default address:", error);
      setError("เกิดข้อผิดพลาดในการดึงที่อยู่"); // "An error occurred while fetching the address"
    }
  };

  const refetchCheckoutData = async () => {
    const res = await fetch('/api/checkout');
    if (res.ok) {
      const data = await res.json();
      setCheckoutData(data);
    } else {
      console.error('Failed to fetch checkout data');
    }
  };

  useEffect(() => {
    fetchDefaultAddress();
  }, [userId, addressUpdated]); // Re-fetch address when userId or addressUpdated changes

  useEffect(() => {
    const storedItems = localStorage.getItem("selectedItems");
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
      console.log("storedItems found");
    } else {
      setError("ไม่พบสินค้าที่เลือก"); // "No selected items found"
    }
  }, []);

  const handleConfirmOrder = async () => {
    if (loading || !addressId || clicked) return; // Prevent if clicked or no address

    setLoading(true);
    setClicked(true); // Set clicked state to true

    try {
      const itemsByFarmer = selectedItems.reduce((acc, item) => {
        const { farmerId } = item;
        if (!acc[farmerId]) {
          acc[farmerId] = [];
        }
        acc[farmerId].push(item);
        return acc;
      }, {});

      const orderPromises = Object.entries(itemsByFarmer).map(async ([farmerId, items]) => {
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            items,
            addressId,
            farmerId: parseInt(farmerId),
          }),
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          return orderData.order.id;
        } else {
          throw new Error('Failed to create order');
        }
      });

      const orderIds = await Promise.all(orderPromises);
      sessionStorage.setItem("orderId", JSON.stringify(orderIds));
      router.push('/payment');
    } catch (error) {
      console.error('Error creating order:', error);
      setError("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ"); // "An error occurred while creating the order"
    } finally {
      setLoading(false);
    }
  };

  // Reset loading state on component mount
  useEffect(() => {
    setLoading(false); // Reset loading state
  }, []); // This runs once when the component mounts

  return (
    <div className="w-[95%] lg:w-[65%] ml-auto mr-auto mt-[100px]">
      {error && <div className='bg-red-500 text-sm text-white py-1 px-3'>{error}</div>}
      <div className="bg-white w-full h-fit p-5 rounded-xl text-[#535353] ">
        <h1 className="text-4xl pb-2 border-b-2 mb-5">เช็คเอาท์</h1>
        <h1 className="text-2xl mb-2">ที่อยู่สำหรับจัดส่ง</h1>
        <AddressManagement onSave={refetchCheckoutData} onUpdateAddress={() => setAddressUpdated(prev => !prev)} />
      </div>

      {addressId === null && (
        <div className="bg-yellow-200 p-4 rounded mt-4">
          <p>กรุณาตั้งค่าที่อยู่จัดส่งเริ่มต้นเพื่อดำเนินการต่อ</p>
        </div>
      )}

      <div className="bg-white w-full h-fit p-5 rounded-xl mt-5 text-[#535353]">
        <h2 className="text-2xl mb-2">สรุปสินค้า</h2>

        <table className="w-full">
          <thead>
            <tr className="text-base lg:text-xl text-start">
              <th className="w-[200px] text-start">สินค้า</th>
              <th className="w-[150px] text-start">จำนวน</th>
              <th className="w-[100px] text-start">ราคา</th>
              <th className="w-[50px] text-right">รวม</th>
            </tr>
          </thead>
          <tbody className="text-base lg:text-lg">
            <tr className="h-4"></tr>
            {selectedItems.map((item, index) => (
              <tr key={item.productId || index}>
                <td className="pb-[5px]">
                  {index + 1}. {item.productName || item.product?.ProductName}{' '}
                  {item.productType || item.product?.ProductType}
                </td>
                <td className="pb-[5px]">{item.quantity} กิโลกรัม</td>
                <td className="pb-[5px]">{item.productPrice || item.product?.Price} บาท</td>
                <td className="pb-[5px] text-right">
                  {(item.productPrice || item.product?.Price) * item.quantity} บาท
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="text-base lg:text-xl border-t-2">
              <td colSpan="3" className="text-right font-bold pr-2 pt-2">รวมทั้งหมด:</td>
              <td className="text-right font-semibold pt-2">
                {
                  selectedItems.reduce((total, item) =>
                    total + ((item.productPrice || item.product.Price) * item.quantity),
                    0
                  ).toFixed(2)
                } บาท
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          className={`w-[200px] h-[50px] mt-5 font-light rounded-xl text-white ${loading || clicked || addressId === null ? 'bg-gray-500' : 'bg-[#4EAC14] hover:bg-[#84d154]'}`}
          type="button"
          onClick={handleConfirmOrder}
          disabled={loading || clicked || addressId === null} // Disable if loading, clicked, or no address
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-white mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z" />
              </svg>
              ชำระเงิน
            </span>
          ) : (
            'ชำระเงิน'
          )}
        </button>
      </div>
    </div>
  );
}
