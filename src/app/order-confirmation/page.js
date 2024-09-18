"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const orderId = sessionStorage.getItem('orderId');
    if (!orderId) {
      // Redirect to another page if orderId is not found in session storage
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const orderIdString = sessionStorage.getItem('orderId');
      const orderId = JSON.parse(orderIdString);
      if (orderId) {
        const fetchOrder = async () => {
          try {
            const response = await fetch(`/api/orders?id=${orderId}`);
            if (response.ok) {
              const data = await response.json();
              setOrder(data.order);

              sessionStorage.removeItem('orderId');
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
    }
  }, [status, router]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="top-container">
      <h1>Order Summary</h1>
      <div className="order-summary">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice}</p>
        <p><strong>Address:</strong> {order.addressText}</p>

        <h2>Order Items</h2>
        {order.orderItems.map((item) => (
          <div key={item.id} className="order-item">
            <p><strong>Product Name:</strong> {item.product.ProductName}{item.product.ProductType}</p>
            <p><strong>Farmer:</strong> {item.farmer.farmerName}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Total:</strong> ${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <p>Thank you for your purchase!</p>
    </div>
  );
}
