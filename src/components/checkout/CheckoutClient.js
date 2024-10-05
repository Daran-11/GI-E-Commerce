"use client";
import AddressManagement from "@/components/AddressManagement";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutClient({ userId }) {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${userId}/default-address`);
        if (res.ok) {
          const data = await res.json();
          setSelectedAddressId(data.id); // Set default address ID
        } else {
          console.error('Failed to fetch default address');
        }
      } catch (error) {
        console.error('Error fetching default address:', error);
      }
    };

    const storedItems = localStorage.getItem("selectedItems");
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
    }

    fetchDefaultAddress(); // Fetch default address when component mounts
  }, [userId]);

  if (!selectedItems.length) {
    return <div>No items selected for checkout.</div>;
  }

  const handleConfirmOrder = async () => {
    if (selectedItems.length && selectedAddressId) {
      try {
        // Group selected items by farmerId
        const itemsByFarmer = selectedItems.reduce((acc, item) => {
          const { farmerId } = item;
          if (!acc[farmerId]) {
            acc[farmerId] = [];
          }
          acc[farmerId].push(item);
          return acc;
        }, {});

        // Send each group of items as a separate order
        const orderPromises = Object.entries(itemsByFarmer).map(async ([farmerId, items]) => {
          const orderResponse = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              items,  // Send grouped items for each farmer
              addressId: selectedAddressId,
              farmerId: parseInt(farmerId),  // Pass the farmerId explicitly
            }),
          });

          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            return orderData.order.id;  // Return the orderId for further use
          } else {
            throw new Error('Failed to create order');
          }
        });

        const orderIds = await Promise.all(orderPromises);  // Wait for all orders to be created

        // Store the order IDs in sessionStorage for later use
        sessionStorage.setItem("orderId", JSON.stringify(orderIds));

        // Redirect to payment page with the order IDs
        router.push('/payment');
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert("Please select items and an address to checkout.");
    }
  };




  return (
    <div className="w-[65%]  ml-auto mr-auto mt-[100px]">
      <div className="bg-white w-full h-fit p-5 rounded-xl text-[#535353] ">
        <h1 className="text-4xl pb-2 border-b-2 mb-5">เช็คเอาท์</h1>
        <h1 className="text-2xl mb-2"> ที่อยู่สำหรับจัดส่ง</h1>
        <AddressManagement />
      </div>


      <div className="bg-white w-full h-fit p-5 rounded-xl mt-5 text-[#535353]">
        <h2 className="text-2xl mb-2 ">สรุปสินค้า</h2>

        <table className="w-full">
          <thead>
            <tr className="text-base lg:text-xl  text-start">
              <th className="w-[200px]  text-start">สินค้า</th>
              <th className="w-[150px]  text-start">จำนวน</th>
              <th className="w-[100px]  text-start">ราคา</th>
              <th className="w-[50px]  text-right">รวม</th>
            </tr>
          </thead>
          <tbody className="text-base lg:text-lg">
            <tr className="h-4"></tr>
            {selectedItems.map((item, index) => (
              <tr key={item.productId || index} className="">
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
          <tfoot className="  ">
            <tr className="text-base lg:text-xl  border-t-2 ">
              <td colSpan="3" className="text-right font-bold pr-2 pt-2">รวมทั้งหมด  :</td>
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
        <button className="w-[200px] h-[50px] mt-5 font-light rounded-xl text-white bg-[#4EAC14] hover:bg-[#84d154]" type="button" onClick={handleConfirmOrder}>
          ชำระเงิน
        </button>
      </div>

    </div>
  );
}
