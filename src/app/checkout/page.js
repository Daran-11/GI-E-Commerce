"use client";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter()
  if (status === 'unauthenticated') {
    console.log("No session found, redirecting to login...");
    Router.push("/login");
  } else {
    console.log("Session found:", session);
  }

  const userId = session.user.id;

  return (
    <div>
      <h1>Checkout</h1>
      <CheckoutClient userId={userId} />
    </div>
  );
}
