"use client";
import PaymentForm from "@/components/paymentForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [orderIds, setOrderIds] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);


  useEffect(() => {
    // Retrieve the order IDs and selected items from cart from sessionStorage)
    const storedOrderIds = sessionStorage.getItem('orderId');

    const storedItems = localStorage.getItem("selectedItems");


    if (!storedOrderIds) {
      // Redirect to another page if orderIds is not found in local storage
      router.push('/');
    }

    if (storedOrderIds) {
      const parsedOrderIds = JSON.parse(storedOrderIds);
      setOrderIds(parsedOrderIds);

      // Fetch total amount for these order IDs or perform any other operations
      fetchTotalAmount(parsedOrderIds);
    }
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
    }
  }, []);

  

  const fetchTotalAmount = async (orderIds) => {
    try {
      const res = await fetch(`/api/orders/total-amount?ids=${orderIds.join(',')}`);
      const data = await res.json();
      setTotalAmount(data.totalAmount);
    } catch (error) {
      console.error('Error fetching total amount:', error);
      setTotalAmount(0); // Handle error by setting total amount to 0 or showing a message
    }
  };

  const handlePaymentSuccess = async (orderIds) => {
    if (selectedItems.length) {
      setLoading(true);
      try {
        orderSelected = selectedItems.map(async (item) => {
          const response = await fetch('http://localhost:3000/api/auth/cart/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.productId  // Send the productId to the API for deletion
            }),
          });          
          if (response.ok) {
            localStorage.removeItem('selectedItems');
            console.log('Cart items deleted successfully');
            router.push(`/order-confirmation`);
          } else {
            console.error('Failed to delete cart items');
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
      {/* Pass the totalAmount and orderIds as props to the PaymentForm */}
      {orderIds.length > 0 && (
        <PaymentForm
          totalAmount={totalAmount}
          orderIds={orderIds}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
