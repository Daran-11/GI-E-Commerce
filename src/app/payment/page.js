"use client";
import PaymentForm from "@/components/paymentForm";
import { useCart } from "@/context/cartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, clearCartItems, fetchCartItems } = useCart();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);


  useEffect(() => {
    const storedOrderId = sessionStorage.getItem('orderId'); // Expecting a single order ID now
    const storedItems = localStorage.getItem("selectedItems");
  
    if (!storedOrderId) {
      router.push('/');
      return; // Ensure you exit if no order ID is found
    }
  
    // Parse the order ID
    const parsedOrderId = JSON.parse(storedOrderId);
    console.log("order ID", parsedOrderId);
    setOrderId(parsedOrderId); // Set single order ID
    fetchTotalAmount(parsedOrderId); // Fetch total amount with the single ID
  
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
    }
  }, []);

  

  const fetchTotalAmount = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/total-amount?id=${orderId.join(',')}`);
      const data = await res.json();
      setTotalAmount(data.totalAmount);
    } catch (error) {
      console.error('Error fetching total amount:', error);
      setTotalAmount(0); // Handle error by setting total amount to 0 or showing a message
    }
  };

  const handlePaymentSuccess = async (orderId) => {
    if (selectedItems.length) {
      setLoading(true);
      try {
        orderSelected = selectedItems.map(async (item) => {
          if (selectedItems.length) {
            setLoading(true);
            try {
              for (const item of selectedItems) {
                await clearCartItems(item.productId);
              }
              localStorage.removeItem('selectedItems');
              router.push('/order-confirmation');
            } catch (error) {
              console.error('Error clearing cart items:', error);
            } finally {
              setLoading(false);
            }
          }       
        });

      } catch (error) {
        console.error('Error deleting cart items:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      {/* Pass the totalAmount and orderId as props to the PaymentForm */}
      {orderId.length > 0 && (
        <PaymentForm
          totalAmount={totalAmount}
          orderId={orderId}
          selectedItems={selectedItems} // Pass selected items to the PaymentForm
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
