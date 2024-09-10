"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Purchases() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // Fetch user purchases if authenticated
    if (status === "authenticated") {
      const fetchPurchases = async () => {
        try {
          if (session?.user?.id) {
            const response = await fetch(
              `http://localhost:3000/api/users/${session.user.id}/purchases`,
            );
            if (response.ok) {
              const data = await response.json();
              setPurchases(data);
            } else if (response.status === 403) {
              setError("You are not authorized to view this content.");
            } else {
              setError("Failed to fetch purchases");
            }
          }
        } catch (error) {
          setError("An error occurred while fetching purchases");
        } finally {
          setLoading(false);
        }
      };

      fetchPurchases();
    }
  }, [status, session, router]);

  if (loading) {
    return <div>Loading your purchases...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Purchases</h1>
      {purchases.length === 0 ? (
        <p>You have not made any purchases yet.</p>
      ) : (
        <ul className="space-y-4">
          {purchases.map((purchase) => (
            <li key={purchase.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">Order ID: {purchase.id}</h2>
              <p>
                <strong>Product Name:</strong> {purchase.product.ProductName}
              </p>
              <p>
                <strong>Quantity:</strong> {purchase.quantity}
              </p>
              <p>
                <strong>Total Price:</strong> {purchase.totalPrice}
              </p>
              <p>
                <strong>Address:</strong> {purchase.addressText}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Purchases;
