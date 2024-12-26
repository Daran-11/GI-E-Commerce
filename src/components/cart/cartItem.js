"use client"
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
        console.log("selected item is: ", selectedItems)
        if(!session) {
          toast.warn("โปรดเข้าสู้ระบบก่อนสั่งซื้อ")
          router.push('/login');
        }
        router.push('/checkout');
      } else {
        toast.error("สินค้าที่เลือกไม่มีในตะกร้า");
      }
    } else {
      toast.warning("โปรดเลือกสินค้าอย่างน้อย1ชิ้นเพื่อดำเนินการต่อ");
    }
  };

  return (
    <div className="w-full xl:w-[80%] ml-auto mr-auto mt-[100px] ">

      <div className="xl:flex  lg:justify-start ">

        <div className="w-full xl:w-[60vw] bg-white xl:p-5 rounded-xl h-fit p-[16px]">
          <div className="text-4xl text-[#535353] pb-2 border-b-2 md:mb-2">
            <a>
              ตะกร้าสินค้า
            </a>
          </div>
          <div className="overflow-y-auto h-[40vh] sm:h-full ">
            <table className="min-w-full table-auto ">
              <thead className="">
                <tr className=" text-base lg:text-xl text-[#535353]">
                  <th className="hidden md:table-cell px-2 text-start">เลือก</th>
                  <th className="hidden md:table-cell  px-2 text-start">รูป</th>
                  <th className="hidden md:table-cell px-2 text-start">สินค้า</th>
                  <th className="hidden md:table-cell px-2 text-start">ราคา/กิโล</th>
                  <th className="hidden md:table-cell px-2 text-start">จำนวน</th>
                  <th className="hidden md:table-cell px-2 text-start">ราคารวม</th>
                  <th className="hidden md:table-cell px-2 text-right">แอ็คชั่น</th>
                </tr>
              </thead>
              <tbody className="flex-grow  w-full max-h-[300px]">
                <tr className="h-4"></tr>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <tr className="border-b-2 text-sm md:text-base " key={item.productId}>
                      <td className="cart-data items-center justify-center ">
                        {item.productAmount === 0 ? (
                          <span className="text-red-500">สินค้าหมด</span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.productId)}
                            onChange={() => selectItem(item.productId)}
                            disabled={item.productAmount === 0} // Disable checkbox if productAmount is 0
                          />
                        )}
                      </td>
                      <td className="cart-data px-2">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            width={25} // Adjust width as needed
                            height={25} // Adjust height as needed
                            sizes="30vw"
                            className='w-[75px] h-[75px] object-cover rounded-2xl'
                          />
                        ) : (
                          <img className="w-[75px] h-[75px] object-cover rounded-2xl" src="/phulae.jpg" alt="Card Image" />
                        )}</td>
                      <td className="cart-data px-2">
                        <div className="md:hidden text-base">

                          {item.farmerName}

                        </div>
                        <div className="hidden md:flex text-base">

                          {item.farmerName}


                        </div>
                        <div>
                          {item.productName || item.product.ProductName}{item.productType || item.product.ProductType}

                        </div>
                        <div className="md:hidden">
                          {item.productPrice || item.product.Price} บาท/กก.
                        </div>
                        <div className="md:hidden">
                          รวม {item.quantity * (item.productPrice || item.product.Price)} บาท
                        </div>


                      </td>
                      <td className="hidden md:table-cell">{item.productPrice || item.product.Price}</td>
                      <td className="cart-data ">
                        <QuantityHandler
                          productAmount={item.productAmount}
                          productId={item.productId || item.product.ProductID}
                          initialQuantity={item.quantity}
                          onQuantityChange={handleUpdateQuantity}
                        />
                      </td>
                      <td className="cart-data hidden md:table-cell">{item.quantity * (item.productPrice || item.product.Price)}</td>
                      <td className="cart-data text-right ">
                        <div className=" flex justify-end">
                          <button onClick={() => handleDelete(item.productId)} className=" text-red-500 hover:text-red-800 w-10 h-10">
                            ลบ
                          </button>
                        </div>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="bg-slate-100 text-gray-500 w-full px-4 py-2 rounded-lg text-center">-ยังไม่มีสินค้าในตะกร้า</td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

        </div>

        <div className=" flex justify-start  xl:justify-center w-fit  xl:w-[20vw] rounded-xl ">
          <div className="fixed bottom-2 xl:top-[100px] bg-white h-fit w-full   xl:w-[40vh] xl:h-[65vh] p-4 rounded-xl">

            <div className="flex flex-col " >
              <div className="text-4xl text-[#535353] border-b-2 mt-1 pb-2 mb-5 ">สินค้าที่เลือก </div>

              {selectedItems.length > 0 ? (
                <>
                  <div className="flex-grow w-full  px-4 py-2 rounded-md text-lg overflow-y-auto h-fit 2xl:h-[40vh] bg-slate-100  ">
                    {cartItems
                      .filter(item => selectedItems.includes(item.productId))
                      .map((item, index) => (
                        <div className=" flex justify-between text-base" key={item.productId}>
                          <div className="" key={item.productId}>
                            <span className="mr-2">{index + 1}. </span>
                            {item.productName || item.product.ProductName}{item.productType || item.product.ProductType}
                            <a className="text-gray-500">
                              &nbsp;
                            </a>
                          </div>
                          <div>
                            {item.productPrice * item.quantity || item.product.Price * item.quantity} บาท
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
                  <div className="flex justify-center items-center w-full  rounded-xl bg-slate-100 xl:h-[40vh] h-[10vh] ">
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