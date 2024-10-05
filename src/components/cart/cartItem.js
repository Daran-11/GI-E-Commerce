"use client";
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuantityHandler from "../quantityhandler";

export default function CartItem({ initialItems }) {
  const { cartItems, setCartItems, removeItemFromCart, updateItemQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (initialItems) {
      setCartItems(initialItems);
    }
  }, [initialItems]);

  const selectItem = (productId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((item) => item !== productId)
        : [...prevSelectedItems, productId]
    );
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (item && newQuantity <= item.productAmount) {
      updateItemQuantity(productId, newQuantity);
    }
  };

  const handleDelete = (productId) => {
    removeItemFromCart(productId);
  };

  const calculateTotalPrice = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.productId))
      .reduce((total, item) => {
        const price = item.productPrice || item.product.Price;
        const quantity = item.quantity;
        return total + price * quantity;
      }, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length > 0) {
      const selectedItemData = cartItems.filter((item) =>
        selectedItems.includes(item.productId)
      );
      if (selectedItemData.length > 0) {
        localStorage.setItem("selectedItems", JSON.stringify(selectedItemData));
        router.push("/checkout");
      } else {
        alert("Selected items not found in cart.");
      }
    } else {
      alert("Please select at least one item to checkout.");
    }
  };

  return (
    <div className="w-full xl:w-[80%] ml-auto mr-auto mt-[100px]">
      <div className="xl:flex lg:justify-start">
        <div className="w-full xl:w-[60vw] bg-white xl:p-5 rounded-xl h-fit p-[16px]">
          <div className="text-4xl text-[#535353] pb-2 border-b-2 mb-5">ตะกร้าสินค้า</div>
          <table className="w-full xl:w-[57vw]">
            <thead>
              <tr className="text-base lg:text-xl text-[#535353]">
                <th className="w-[50px] text-start">เลือก</th>
                <th className="w-[100px] text-start">รูป</th>
                <th className="w-[120px] text-start">สินค้า</th>
                <th className="w-[100px] text-start">ราคา/กิโล</th>
                <th className="w-[80px] text-start">จำนวน</th>
                <th className="w-[100px] text-start">ราคารวม</th>
                <th className="w-[60px] text-right">แอ็คชั่น</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <tr className="border-b-2 text-base lg:text-lg" key={item.productId}>
                    <td className="cart-data items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.productId)}
                        onChange={() => selectItem(item.productId)}
                      />
                    </td>
                    <td className="cart-data pr-[35px]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName || item.product?.ProductName || "Product Image"}
                          width={75}
                          height={75}
                          className="w-[75px] h-[75px] object-cover rounded-2xl"
                        />
                      ) : (
                        <img
                          className="w-[75px] h-[75px] object-cover rounded-2xl"
                          src="/phulae.jpg"
                          alt="Default Image"
                        />
                      )}
                    </td>
                    <td className="cart-data">
                      {item.productName || item.product.ProductName} {item.productType || item.product.ProductType}
                    </td>
                    <td className="cart-data">{item.productPrice || item.product.Price}</td>
                    <td className="cart-data">
                      <QuantityHandler
                        productAmount={item.productAmount || item.product.Amount}
                        productId={item.productId || item.product.ProductID}
                        initialQuantity={item.quantity}
                        onQuantityChange={handleUpdateQuantity}
                      />
                    </td>
                    <td className="cart-data">
                      {item.quantity * (item.productPrice || item.product.Price)}
                    </td>
                    <td className="cart-data text-right">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(item.productId)}
                          className="text-red-500 hover:text-red-800 w-10 h-10"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="bg-slate-100 text-gray-500 w-full px-4 py-2 rounded-lg text-center">
                    -ยังไม่มีสินค้าในตะกร้า-
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-start xl:justify-center w-fit xl:w-[20vw] rounded-xl">
          <div className="fixed bottom-2 xl:top-[100px] bg-white h-fit w-full xl:w-[40vh] xl:h-[65vh] p-4 rounded-xl">
            <div className="text-[#535353] font-light text-2xl mb-4">สรุปรายการ</div>
            <div className="text-xl mb-4">
              {cartItems.filter((item) => selectedItems.includes(item.productId)).map((item, index) => (
                <div key={item.productId} className="flex justify-between">
                  <span className="mr-2">{index + 1}. </span>
                  <span>{item.productName || item.product.ProductName} {item.productType || item.product.ProductType}</span>
                  <span>{item.productPrice * item.quantity || item.product.Price * item.quantity} บาท</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="flex justify-between items-center text-xl mt-2">
              <span>ราคารวม</span>
              <span>{calculateTotalPrice()} บาท</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className={`bg-[#4EAC14] text-xl text-white font-light rounded-xl w-full h-[40px] mt-4 
                ${selectedItems.length === 0 ? "bg-gray-300" : "hover:bg-[#4eac14b6]"}`}
            >
              สั่งซื้อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
