"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIds = searchParams.get("id")?.split(',') || [];
  const { data: session, status } = useSession();

  useEffect(() => {
    const orderIds = localStorage.getItem('orderIds');
    if (!orderIds) {
      // Redirect to another page if orderIds is not found in local storage
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      if (orderIds) {
        console.log("OrderId:",orderIds);
        const idsQueryParam = orderIds.join(',');
        console.log("idsQueryParam:",idsQueryParam);
        const fetchOrders = async () => {
          try {
            const response = await fetch(`/api/orders?ids=${idsQueryParam}`);
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
  }, [status, router]);


  useEffect(() => {
    // Remove orderIds from localStorage after successful confirmation
    if (orders.length > 0) {
      localStorage.removeItem('orderIds');
    }
  }, [orders]);

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
          <p><strong>Product Name:</strong> {order.product?.ProductName} {order.product?.ProductType}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Price:</strong> {order.product?.Price}</p>
          <p><strong>Total:</strong> {order.quantity * (order.product?.Price || 0)}</p>
          <p><strong>Address:</strong> {order.addressText}</p>
        </div>
      ))}
      <p>Thank you for your purchase!</p>
    </div>
  );
}
