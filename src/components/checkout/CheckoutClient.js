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
        const orderIds = orders.map(order => order.order.id);
        
        // Store the order IDs in localStorage for later use
        sessionStorage.setItem("orderIds", JSON.stringify(orderIds));

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
    <div className="top-container">
      <h1>Checkout</h1>

      {/* Product Summary */}
      <h2>Product Summary</h2>
      {selectedItems.map(item => (
        <div key={item.productId}>
          <p><strong>Product Name:</strong> {item.productName || item.product.ProductName}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Price:</strong> {item.productPrice || item.product.Price}</p>
          <p><strong>Total:</strong> {(item.productPrice || item.product.Price) * item.quantity}</p>
        </div>
      ))}

      <h2>Delivery Address</h2>
      <AddressManagement />

      <button className="w-[200px] h-[50px] font-light rounded-xl text-white bg-[#4EAC14] hover:bg-[#84d154]" type="button" onClick={handleConfirmOrder}>
        ชำระเงิน
      </button>
    </div>
  );
}
