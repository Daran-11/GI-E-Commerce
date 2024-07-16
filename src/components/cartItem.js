"use client"
import { useEffect, useState } from "react";

export default function CartItem({initialItems, session}) {

    const [items, setItems] = useState(initialItems);

  const fetchCartItems = async () => {
    if (session) {
      const response = await fetch('http://localhost:3000/api/auth/cart');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch cart items');
      }
    }
  };
  
  useEffect(() => {
    // Fetch items if user is logged in
    fetchCartItems();
  }, [session]);

    useEffect(() => {
      const fetchLocalCartItems = () => {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setItems(localCart);
      };
  
      fetchLocalCartItems();
    }, []);
  
    const handleDelete = async (productId) => {
      if (session) {
        const response = await fetch('http://localhost:3000/api/auth/cart/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });

        
  
        if (response.ok) {
          alert('Item deleted from cart');
          setItems(prevItems => prevItems.filter(item => item.productId !== productId));
        } else {
          alert('Failed to delete item');
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = localCart.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setItems(updatedCart);
        alert('Item deleted from cart');
      }
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
            {items.length > 0 ? (
              items.map((item) => (
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