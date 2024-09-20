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
      const selectedItemData = cartItems.filter(item => selectedItems.includes(item.productId));
      
      if (selectedItemData.length > 0) {
        localStorage.setItem('selectedItems', JSON.stringify(selectedItemData));
        console.log("selected item is: ",selectedItems)
        router.push('/checkout');
      } else {
        alert("Selected items not found in cart.");
      }
    } else {
      alert("Please select at least one item to checkout.");
    }
  };

  return (
<<<<<<< HEAD
    <div className=" w-[80%] ml-auto mr-auto mt-[100px] ">

    <div className="flex justify-between ">
      <div className="w-fit bg-white p-5 rounded-xl h-screen ">
        <div className="text-4xl text-[#535353] pb-2 border-b-2 mb-5">
          <a>
          ตะกร้าสินค้า
          </a>
        </div>

        <table className="">
          <thead className="">
            <tr className="text-xl  text-[#535353]">
              <th className=" pr-[50px]">เลือก</th>
              <th className=" pr-[200px]">สินค้า</th>
              <th className=" pr-[80px] ">ราคาต่อกิโล</th>
              <th className=" pr-[150px]">จำนวน</th>
              <th className=" pr-[60px]">ราคารวม</th>
              <th className=" pr-[60px]">แอ็คชั่น</th>
=======
    <div className="top-container grid grid-cols-10">
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
>>>>>>> parent of 93831e9 (pick from 58b13bcf new)
            </tr>
          </thead>
          <tbody className="">
          <tr className="h-4"></tr>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr className="border-b-2 text-lg " key={item.productId}>
                  <td className="cart-data items-center justify-center ">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => selectItem(item.productId)}
                    />
                  </td>
                  <td className="cart-data">{item.productName || item.product.ProductName} {item.productType || item.product.ProductType}</td>
                  <td className="cart-data ">{item.productPrice || item.product.Price}</td>
                  <td className="cart-data ">
                    <QuantityHandler 
                      productAmount={item.productAmount || item.product.Amount} 
                      productId={item.productId || item.product.ProductID} 
                      initialQuantity={item.quantity} 
                      onQuantityChange={handleUpdateQuantity} 
                    />
                  </td>
                  <td className="cart-data ">{item.quantity * (item.productPrice || item.product.Price)}</td>
                  <td className="cart-data ">
                    <button  onClick={() => handleDelete(item.productId)} className=" text-red-500 hover:text-red-800 w-10 h-10">
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
      <div className="bg-white h-screen flex justify-center  w-[470px] rounded-xl ">
      <div className="fixed bg-white w-fit h-screen p-4 rounded-xl">
          
          <div className="w-[380px] flex flex-col h-[600px]" >
          <div className="text-4xl text-[#535353] border-b-2 mt-1 pb-2 mb-5 ">สินค้าที่เลือก </div>
          
          {selectedItems.length > 0 ? (
            <>
            <div className="flex-grow overflow-y-auto w-full h-fit px-4 py-2 rounded-md bg-slate-100 text-lg ">
              {cartItems
                .filter(item => selectedItems.includes(item.productId))
                .map((item,index) => (
                  <div className=" flex justify-between">
                  <div className="" key={item.productId}>
                  <span className="mr-2">{index + 1}. </span> 
                    {item.productName || item.product.ProductName}{item.productType || item.product.ProductType}
                    <a className="text-gray-500">
                    &nbsp;
                    </a>
                    </div>
                  <div>
                    {item.productPrice*item.quantity || item.product.Price*item.quantity} บาท
                  </div>
                  </div>
          
                ))}              
            </div>

            <div className="flex justify-between mt-[15px] text-xl ">
                   <div className=" ">รวมทั้งหมด:</div> 
                   <div> {calculateTotalPrice()} บาท</div>
            </div>                  
            </>      
        ) : (
          <>
          <div className="flex justify-center items-center w-full  h-[600px] rounded-xl bg-slate-100">
          <div className=" text-gray-500  px-2 ">-ยังไม่ได้เลือกสินค้า-</div>
          </div>
          </>  
        )}
        </div>
        <div className="flex justify-center w-full">
        <button 
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className=" bg-[#4EAC14] text-xl text-white font-light rounded-xl w-full h-[40px] mt-4 disabled:bg-gray-300 hover:bg-[#4eac14b6] "
        >
          สั่งซื้อ
        </button>          
          </div>  
        </div>       
      </div>
 
    </div>
    
      </div>

  );
}
