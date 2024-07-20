"use client"
import { useCart } from "@/context/cartContext";
import { useEffect } from "react";
import QuantityHandler from "../quantityhandler";

export default function CartItem({ initialItems }) {
  const { cartItems, setCartItems, removeItemFromCart, updateItemQuantity } = useCart();

  useEffect(() => {
    setCartItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    console.log('CartItems data:', cartItems);
  }, [cartItems]);



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

  
  return (
    <div className="top-container grid grid-cols-10">
      <div className="col-span-8">
        <table className="">
          <thead>
            <tr>
              <th className="pr-[200px]">สินค้า</th>
              <th className="pr-[150px]">ราคาต่อกิโล</th>
              <th className="pr-[75px]">จำนวน</th>
              <th className="pr-[60px]">ราคารวม</th>
              <th className="pr-[100px]">แอ็คชั่น</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName || item.product.ProductName} {item.productType || item.product.ProductType}</td>
                  <td>{item.productPrice || item.product.Price}</td>
                  <td><QuantityHandler 
                  productAmount={item.productAmount || item.product.Amount} 
                  productId={item.productId || item.product.ProductID} 
                  initialQuantity={item.quantity } 
                  onQuantityChange={handleUpdateQuantity} /></td>
                  <td>{item.quantity * (item.productPrice || item.product.Price)}</td>
                  <td>
                    <button onClick={() => handleDelete(item.productId)}>ลบ</button>
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
      <div className="col-span-2 bg-green-300 w-full h-[200px]">
        <button>
          hello
        </button>
      </div>
    </div>
  );
}