"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/products/products.module.css";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/add");
        const data = await response.json();
        console.log("Fetched products:", data); // Debug log
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/product/add?id=${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        console.log("Delete response:", response); // Debug log
        if (response.ok) {
          setProducts(products.filter((product) => product.id !== id));
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาผู้ใช้..." />
        <Link href="/dashboard/products/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>รหัส</td>
            <td>รหัสแปลงปลูก</td>
            <td>ชื่อสินค้า</td>
            <td>สายพันธุ์</td>
            <td>ราคา</td>
            <td>จำนวน</td>
            <td>สถานะ</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.plotCode}</td>
                <td>{product.productName}</td>
                <td>{product.variety}</td>
                <td>{product.price}</td>
                <td>{product.amount}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      styles[product.status.replace(/ /g, "-")]
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/products/edit/${product.id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        Edit
                      </button>
                    </Link>
                    <button
                      className={`${styles.button} ${styles.cancelled}`}
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>No products available</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default Product;
