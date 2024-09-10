"use client"
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuantityHandler from "../quantityhandler";

export default function CartItem({ initialItems }) {
  const { cartItems, setCartItems, removeItemFromCart, updateItemQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setCartItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    console.log('CartItems data:', cartItems);
  }, [cartItems]);

  // Function to select or deselect an item
  const selectItem = (productId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(productId)) {
        // If already selected, deselect it
        return prevSelectedItems.filter(item => item !== productId);
      } else {
        // Otherwise, add it to the selected items
        return [...prevSelectedItems, productId];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const item = cartItems.find(i => i.productId === productId);
    if (item && newQuantity <= item.productAmount) {
      updateItemQuantity(productId, newQuantity);
    }
  };

  const handleDelete = (productId) => {
    removeItemFromCart(productId);
  };

  const handleCheckout = () => {
    if (selectedItems.length > 0) {
      const selectedItemData = cartItems.filter(item => selectedItems.includes(item.productId));
      
      if (selectedItemData.length > 0) {
        localStorage.setItem('selectedItems', JSON.stringify(selectedItemData));
        router.push('/checkout');
      } else {
        alert("Selected items not found in cart.");
      }
    } else {
      alert("Please select at least one item to checkout.");
    }
  };

  return (
    <div className="w-4/5 ml-auto mr-auto mt-[150px] grid grid-cols-10">
      <div className="col-span-8">
        <table>
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
                      type="checkbox"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => selectItem(item.productId)}
                    />
                  </td>
                  <td>{item.productName || item.product.ProductName} {item.productType || item.product.ProductType}</td>
                  <td>{item.productPrice || item.product.Price}</td>
                  <td>
                    <QuantityHandler 
                      productAmount={item.productAmount || item.product.Amount} 
                      productId={item.productId || item.product.ProductID} 
                      initialQuantity={item.quantity} 
                      onQuantityChange={handleUpdateQuantity} 
                    />
                  </td>
                  <td>{item.quantity * (item.productPrice || item.product.Price)}</td>
                  <td>
                    <button onClick={() => handleDelete(item.productId)}>
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No items in the cart.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="col-span-2 border-2 border-black w-full h-[200px]">
        <button 
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className="action-button bg-[#4EAC14] text-white font-light rounded-xl w-[150px] mt-4 disabled:bg-gray-300"
        >
          สั่งซื้อ
        </button>
      </div>
    </div>
  );
}
