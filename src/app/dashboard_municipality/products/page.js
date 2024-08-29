// components/Product.js
"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/products/products.module.css";
import Button from "@mui/material/Button";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import AddProductDialog from "@/app/dashboard/products/add/page";
import EditProductDialog from "@/app/dashboard/products/edit/[id]/page";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product/add");
      const data = await response.json();
      const formattedData = data.map((product) => ({
        ...product,
        price: formatPrice(product.price),
      }));
      setProducts(formattedData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/product/add?id=${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
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

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const handleOpenEditDialog = (id) => {
    setSelectedProductId(id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedProductId(null);
    setOpenEditDialog(false);
  };

  const handleAddProduct = async (productData) => {
    const response = await fetch("/api/product/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert("Product added successfully");
      fetchProducts(); // Refetch products after adding a new product
      handleCloseAddDialog();
    } else {
      alert("Failed to add product");
    }
  };

  const handleEditProduct = async (id, productData) => {
    const response = await fetch(`/api/product/add?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert("Product updated successfully");
      fetchProducts(); // Refetch products after editing
      handleCloseEditDialog();
    } else {
      alert("Failed to update product");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาผู้ใช้..." />
        <Button
          className={styles.addButton}
          color="primary"
          onClick={handleOpenAddDialog}
        >
          เพิ่มสินค้า
        </Button>
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
                    <Button
                      className={`${styles.button} ${styles.view}`}
                      onClick={() => handleOpenEditDialog(product.id)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      className={`${styles.button} ${styles.cancelled}`}
                      onClick={() => handleDelete(product.id)}
                    >
                      ลบ
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No products available</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />

      {/* Add Product Dialog */}
      <AddProductDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onAddProduct={handleAddProduct}
      />

      {/* Edit Product Dialog */}
      {selectedProductId && (
        <EditProductDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          onEditProduct={handleEditProduct}
          productId={selectedProductId}
          onSuccess={fetchProducts} // Pass the fetchProducts function as onSuccess
        />
      )}
    </div>
  );
};

export default Product;
