"use server";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
 
  if ( !session) {
    console.log("No session found, redirecting to login...");
  } else {
    console.log("Session found:", session);
  }

  const userId = session?.user?.id;

  return (
    <div>
      <h1>Checkout</h1>
      <CheckoutClient userId={userId} session={session} />
    </div>
  );
}
