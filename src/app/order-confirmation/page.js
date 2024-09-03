"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIds = searchParams.get("ids");
  const { data: session, status } = useSession()

  useEffect(() => {

    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      if (orderIds) {
        const fetchOrders = async () => {
          try {
            const response = await fetch(`/api/orders?ids=${orderIds}`);
            if (response.ok) {
              const data = await response.json();
              setOrders(data);
            } else {
              setError("Orders not found");
            }
          } catch (error) {
            setError("Failed to fetch order details");
          }
        };
        fetchOrders();
      } else {
        setError("No order IDs provided");
      }      
    }


  }, [status ,orderIds]);

  if (error) {
    return <div>{error}</div>;
  }

  if (orders.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="top-container">
      <h1>Order Summary</h1>
      {orders.map((order) => (
        <div key={order.id} className="order-summary">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Product Name:</strong> {order.product.ProductName} {order.product.ProductType}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Price:</strong> {order.product.Price}</p>
          <p><strong>Total:</strong> {order.quantity * order.product.Price}</p>
          <p><strong>Address:</strong> {order.addressText}</p>
        </div>
      ))}
      <p>Thank you for your purchase!</p>
    </div>
  );
}
