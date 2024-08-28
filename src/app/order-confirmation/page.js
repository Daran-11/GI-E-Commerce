"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
          if (response.ok) {
            const data = await response.json();
            setOrder(data);
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
  }, [orderId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="top-container">
      <h1>สรุปรายการ</h1>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Product Name:</strong> {order.product.ProductName}{order.product.ProductType}</p>
      <p><strong>Quantity:</strong> {order.quantity}</p>
      <p><strong>Price:</strong> {order.totalPrice}</p>
      <p><strong>Total:</strong> {order.quantity}</p>
      <p><strong>Address:</strong> {order.addressText}</p>
      ขอบคุณครับ
    </div>
  );
}
