// This file should be a server component to use `getServerSession`
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Adjust path if necessary

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // Redirect to login if no session or user found
    redirect("/login");
  }

  const userId = session.user.id;

  return (
    <div>
      <h1>Checkout</h1>
      <CheckoutClient userId={userId} />
    </div>
  );
}
