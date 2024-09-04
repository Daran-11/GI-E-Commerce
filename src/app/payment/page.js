"use client";
import PaymentForm from "@/components/paymentForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderIds, setOrderIds] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const ids = searchParams.get('orderIds');
    if (ids) {
      const orderIdsArray = ids.split(',');
      setOrderIds(orderIdsArray);
      fetchTotalAmount(orderIdsArray); // Fetch total amount for these order IDs
    }
  }, [searchParams]);

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

  const handlePaymentSuccess = () => {
    router.push('/order-confirmation');
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
