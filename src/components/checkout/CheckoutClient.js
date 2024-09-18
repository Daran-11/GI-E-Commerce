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
        const orderPromises = selectedItems.map(async (item) => {
          const productDetails = item.product ? item.product : item;
          const orderResponse = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              productId: productDetails.ProductID || productDetails.productId,
              quantity: item.quantity,
              productName: productDetails.ProductName || item.productName,
              productPrice: productDetails.Price || item.productPrice,
              addressId: selectedAddressId,
              farmerId: productDetails.farmerId || item.farmerId  // Get `farmerId` from the correct structure
            }),
          });

          if (orderResponse.ok) {
            return await orderResponse.json();
          } else {
            throw new Error('Failed to create order');
          }
        });

        const orders = await Promise.all(orderPromises);
        const orderId = orders.map(order => order.order.id);
        
        // Store the order IDs in localStorage for later use
        sessionStorage.setItem("orderId", JSON.stringify(orderId));

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
          {selectedItems.map((item,index )=> (
            <tr className="">
              <td className="pb-[5px]">{index + 1}.{item.productName || item.product.ProductName}{item.productType || item.product.ProductType}</td>
              <td className="pb-[5px]">{item.quantity} กิโลกรัม</td>
              <td className="pb-[5px]">{item.productPrice || item.product.Price} บาท</td>
              <td className="pb-[5px] text-right">{(item.productPrice || item.product.Price) * item.quantity} บาท</td>
            </tr>
                    ))}
          </tbody>
          <tfoot>
                <tr className="text-base lg:text-xl ">
                  <td colSpan="3" className="text-right font-bold pr-2">รวมทั้งหมด  :</td>
                  <td className="text-right font-semibold">
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
