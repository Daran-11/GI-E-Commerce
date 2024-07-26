"use client"
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuantityHandler from "../quantityhandler";

export default function CartItem({ initialItems }) {
  const { cartItems, setCartItems, removeItemFromCart, updateItemQuantity } = useCart();

  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();
  

  useEffect(() => {
    setCartItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    console.log('CartItems data:', cartItems);
  }, [cartItems]);

    // Function to select an item
    const selectItem = (item) => {
      setSelectedItem(selectedItem?.productId === item.productId ? null : item);
    };

  const handleUpdateQuantity = (productId, newQuantity) => {
    // Check if the new quantity exceeds available amount
    const item = cartItems.find(i => i.productId === productId);
    if (item && newQuantity <= item.productAmount) {
      updateItemQuantity(productId, newQuantity);
      console.log('update item')
    }
  };

  const handleDelete = (productId) => {
    removeItemFromCart(productId);
  };


  
  // Function to handle checkout
  const handleCheckout = () => {
    if (selectedItem) {
      const params = new URLSearchParams({
        productId: selectedItem.productId,
        productName: selectedItem.productName,
        productType: selectedItem.productType,
        productPrice: selectedItem.productPrice,
        quantity: selectedItem.quantity
      });

      router.push(`/checkout?${params.toString()}`);
    } else {
      alert("Please select an item to checkout.");
    }
  };

  
  return (
    <div className="top-container grid grid-cols-10">
      <div className="col-span-8">
        <table className="">
          <thead>
            <tr>
              <th className="pr-[50px]">เลือก</th>
              <th className="pr-[200px]">สินค้า</th>
              <th className="pr-[80px]">ราคาต่อกิโล</th>
              <th className="pr-[75px]">จำนวน</th>
              <th className="pr-[60px]">ราคารวม</th>
              <th className="pr-[100px]">แอ็คชั่น</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.productId}>
                  <td className="items-center justify-center ">
                  <input
                  type="radio"
                  checked={selectedItem?.productId === item.productId}
                  onChange={() => selectItem(item)}
                />                  
                  </td>

                  <td className="">{item.productName || item.product.ProductName} {item.productType || item.product.ProductType}</td>
                  <td>{item.productPrice || item.product.Price}</td>
                  <td><QuantityHandler 
                  productAmount={item.productAmount || item.product.Amount} 
                  productId={item.productId || item.product.ProductID} 
                  initialQuantity={item.quantity } 
                  onQuantityChange={handleUpdateQuantity} /></td>
                  <td>{item.quantity * (item.productPrice || item.product.Price)}</td>
                  <td>
                    <button onClick={() => handleDelete(item.productId)}>
                      
                      ลบ</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No items in the cart.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="col-span-2 border-2 border-black w-full h-[200px]">
      <button
        onClick={handleCheckout}
        disabled={!selectedItem}
        className="bg-blue-500 rounded w-[150px] mt-4"
      >
        Checkout
      </button>
      </div>
    </div>
  );
}