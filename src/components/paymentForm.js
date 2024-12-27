"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentForm({ totalAmount, orderId, onPaymentSuccess, selectedItems }) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [expiryDate, setExpiryDate] = useState(''); // Combined expiry date
  const [securityCode, setSecurityCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  


  
  useEffect(() => {
    console.log("Environment Public Key:", process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY);
  
    const loadOmiseScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.omise.co/omise.js";
        script.defer = true;
        script.onload = () => {
          if (window.Omise) {
            const publicKey = 'pkey_test_60uf39ytmwkbsecb4rs';
            console.log("Loaded Omise.js with Public Key:", publicKey);
  
            if (publicKey) {
              window.Omise.setPublicKey(publicKey);
              resolve(window.Omise);
            } else {
              reject(new Error("Public Key is undefined"));
            }
          } else {
            reject(new Error("Failed to load Omise.js"));
          }
        };
        script.onerror = () => reject(new Error("Failed to load Omise.js"));
        document.body.appendChild(script);
      });
    };
  
    loadOmiseScript().catch((error) => {
      console.error("Omise.js initialization error:", error);
    });
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const [expiryMonth, expiryYear] = expiryDate.split('/');
    
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
    console.log('Order IDs:', orderId); // Log order IDs to ensure they are correct
    console.log('Total Amount:', totalAmount); // Log total amount

    const res = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        orderId,
        totalAmount,
              // Assuming you want to send quantities and product IDs as well
          quantity: selectedItems.map(item => item.quantity),
          productId: selectedItems.map(item => item.productId),
      }),
    });

    const data = await res.json();
    console.log('Response from process-payment API:', data); // Log the response from your API

    if (data.success) {
      console.log("order Id:",orderId);
      onPaymentSuccess(orderId);

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


const handleCardNumberChange = (e) => {
  let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
  if (value.length > 16) {
    value = value.slice(0, 16); // Limit to 16 digits
  }

  // Format the card number with dashes
  const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';

  setCardNumber(formattedValue);
};

const handleExpiryDateChange = (e) => {
  let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
  if (value.length > 2) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Insert "/" after the month
  }
  setExpiryDate(value);
};






  return (
    <div className="max-w-[90%] mt-[120px] md:mt-[150px] ml-auto mr-auto   flex justify-center bg-white border-2 w-[450px] lg:max-w-[60%] h-[600px] rounded-2xl shadow-lg ">
    <div className="w-[90%] sm:[320px]  md:[350px]">
    
    <form onSubmit={handleSubmit} className="mt-[80px] mx-4">
      <div className="flex">
        <div className="text-5xl text-[#4eac14] mb-1">
          ชำระเงิน
        </div>     
      </div>

      <div className="text-xl mb-[30px] pb-3 text-gray-600 border-b-2 border-gray-300 ">
        Secured by Opn Payments
      </div>
      <div>
      <label>เลขบัตรเครดิต/บัตรเดบิต</label>
      <input
          className="input-box w-full h-[45px] p-2"
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          maxLength="19" // Max length to handle the dashes
          placeholder="XXXX-XXXX-XXXX-XXXX"
          required
        />
      </div>

      <div className="">
        <label>ชื่อบนบัตร</label>
        <input
          className="input-box w-full h-[45px] p-2"
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>


      <div  className="flex ">
        <div className="mr-3">
          <label>วันที่หมดอายุ</label>
            <input
              className="input-box w-full h-[45px] p-2"
              type="text"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="ดด/ปป"
              maxLength="5" // Max length to handle MM/YY format
              required
              />
        </div>
        <div>
          <label>รหัสความปลอดภัย</label>
          <input
            className="input-box w-full h-[45px] p-2  "
            type="password"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            placeholder="XXX"
            maxLength="3"
            required
          />
        </div>                
      </div>




      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading} className="mt-4 w-full hover:bg-blue-500 h-[45px] bg-blue-600 text-white rounded-xl ">
        {loading ? "Processing..." : `ชำระเงิน ${totalAmount} THB`}
      </button>

    </form>      
    </div>      
    </div>


  );
}
