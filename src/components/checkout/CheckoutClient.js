"use client";
import AddressManagement from "@/components/AddressManagement";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutClient({userId}) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const storedItem = localStorage.getItem("selectedItem");
    if (storedItem) {
      setSelectedItem(JSON.parse(storedItem));
    }
  }, []);

  if (!selectedItem) {
    return <div>No item selected for checkout.</div>;
  }

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleConfirmOrder = async ({productId}) => { 
    if (selectedItem && selectedAddressId) {
      try {
        // Create the order
        const orderResponse = await fetch('http://localhost:3000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId, // Replace with dynamic user ID if needed
            productId: selectedItem.productId,
            quantity: selectedItem.quantity,
            productName: selectedItem.productName || selectedItem.product.ProductName,
            productPrice: selectedItem.productPrice || selectedItem.product.Price,
            addressId: selectedAddressId,
          }),
        });

        if (orderResponse.ok) {
          // Remove item from cart
          const removeFromCartResponse = await fetch('http://localhost:3000/api/auth/cart/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: selectedItem.productId }),
          });

          if (removeFromCartResponse.ok) {
            console.log('Order successful and item removed from cart');
            localStorage.removeItem('selectedItem');
            router.push('/order-confirmation');
          } else {
            console.error('Failed to remove item from cart');
          }
        } else {
          console.error('Failed to create order');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert("Please select an item and an address to checkout.");
    }
  };



  

  return (
    <div className="top-container">
      <h1>Checkout</h1>

{/* Product Summary */}
<h2>Product Summary</h2>
{selectedItem && (
  <div>
    <p><strong>Product Name:</strong> {selectedItem.productName || selectedItem.product.ProductName}</p>
    <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
    <p><strong>Price:</strong> {selectedItem.productPrice || selectedItem.product.Price}</p>
    <p><strong>Total:</strong> {(selectedItem.productPrice || selectedItem.product.Price) * selectedItem.quantity}</p>
  </div>
)}
      <h2>Delivery Address</h2>
        <AddressManagement onAddressSelect={handleAddressSelect}/>

        <button type="button" onClick={handleConfirmOrder}>
        Confirm and Pay
      </button>

    </div>
  );
}
