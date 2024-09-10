import { useSession } from "next-auth/react";

const submitOrder = async (orderData) => {
  const { data: session } = useSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`, // Replace with actual session token if needed
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit order");
    }

    const result = await response.json();
    return result; // Return result if needed for further processing
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};

export default submitOrder;
