"use client"
import { useCart } from "@/context/cartContext";
import { useEffect } from "react";

export default function CartItem({initialItems, session}) {
    const { cartItems, setCartItems, removeItemFromCart } = useCart();
    //const [items, setItems] = useState(initialItems);

    useEffect(() => {
      setCartItems(initialItems);
    }, [initialItems]);
  
    const handleDelete = async (productId) => {
      removeItemFromCart(productId);
    };

  
    return (
      <div className="top-container">
        <table>
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
                  <td>{item.productName || item.product.ProductName}{item.productType || item.product.ProductType}</td>
                  <td>{item.productPrice || item.product.Price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.quantity * item.productPrice || item.product.Price }</td>
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
    );
}