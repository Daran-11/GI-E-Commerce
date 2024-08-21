"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditProductPage = ({ params }) => {
  const [formData, setFormData] = useState({
    plotCode: "",
    productName: "",
    variety: "",
    price: "",
    amount: "",
    status: "",
  });

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/add?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            plotCode: data.plotCode,
            productName: data.productName,
            variety: data.variety,
            price: data.price,
            amount: data.amount,
            status: data.status,
          });
        } else {
          alert("Failed to fetch product");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/product/add", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...formData }),
    });

    if (response.ok) {
      alert("Certificate updated successfully");
      router.push("/dashboard/products");
    } else {
      alert("Failed to update product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="plotCode"
        type="text"
        placeholder="รหัสแปลงปลูก"
        value={formData.plotCode}
        onChange={handleChange}
        required
      />
      <input
        name="productName"
        type="text"
        placeholder="ชื่อสินค้า"
        value={formData.productName}
        onChange={handleChange}
        required
      />
      <input
        name="variety"
        type="text"
        placeholder="สายพันธุ์"
        value={formData.variety}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        placeholder="ราคา"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <input
        name="amount"
        type="number"
        placeholder="จำนวน"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <input
        name="status"
        type="text"
        placeholder="สถานะ"
        value={formData.status}
        onChange={handleChange}
        required
      />
      <button type="submit">แก้ไขสินค้า</button>
    </form>
  );
};

export default EditProductPage;
