"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentForm({ totalAmount, orderIds, onPaymentSuccess }) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOmiseScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdn.omise.co/omise.js";
        script.defer = true;
        script.onload = () => {
          if (window.Omise) {
            window.Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY);
            console.log('Omise.js loaded:', window.Omise); 
            resolve(window.Omise);
          } else {
            reject(new Error('Failed to load Omise.js'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Omise.js'));
        document.body.appendChild(script);
      });
    };

    loadOmiseScript().catch(error => {
      console.error('Omise.js initialization error:', error);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const omise = window.Omise;
      if (!omise) {
        throw new Error('Omise.js is not loaded');
      }
  
      // Create a token using Omise.js
      omise.createToken('card', {
        name: cardName,
        number: cardNumber,
        expiration_month: expiryMonth,
        expiration_year: expiryYear,
        security_code: securityCode,
      }, (statusCode, response) => {
        console.log('Omise token creation statusCode:', statusCode); // Log the status code
        console.log('Omise token creation response:', response); // Log the entire response
  
        if (statusCode === 200 && response.id) {
          const token = response.id;
          console.log('Token ID:', token); // Log the token ID
  
          // Proceed with the payment processing
          handlePayment(token);
        } else {
          setError('Failed to create payment token.');
          console.error('Token creation failed:', response);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error during payment processing:', error);
      setError('An error occurred during payment processing. Please try again.');
      setLoading(false);
    }
  };

  // Separate function to handle the payment processing
const handlePayment = async (token) => {
  try {
    console.log('Order IDs:', orderIds); // Log order IDs to ensure they are correct
    console.log('Total Amount:', totalAmount); // Log total amount

    const res = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        orderIds,
        totalAmount,
      }),
    });

    const data = await res.json();
    console.log('Response from process-payment API:', data); // Log the response from your API

    if (data.success) {
      onPaymentSuccess();
    } else {
      setError(data.message || "Payment failed. Please try again.");
    }
  } catch (error) {
    console.error('Error during payment processing:', error);
    setError('An error occurred during payment processing. Please try again.');
  } finally {
    setLoading(false);
  }
};
  
  

  return (
    <form onSubmit={handleSubmit} className="top-container">
      <div>
        <label>Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Name on Card</label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Expiry Month</label>
        <input
          type="text"
          value={expiryMonth}
          onChange={(e) => setExpiryMonth(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Expiry Year</label>
        <input
          type="text"
          value={expiryYear}
          onChange={(e) => setExpiryYear(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Security Code (CVC)</label>
        <input
          type="text"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : `Pay ${totalAmount} THB`}
      </button>
    </form>
  );
}
