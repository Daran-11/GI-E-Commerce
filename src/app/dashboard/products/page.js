// components/Product.js
"use client";
import AddProductDialog from "@/app/dashboard/products/add/page";
import EditProductDialog from "@/app/dashboard/products/edit/[ProductID]/page";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import styles from "@/app/ui/dashboard/products/products.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Button from "@mui/material/Button";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Product = () => {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const router = useRouter()

  const fetchProducts = async () => {
    
    try {
      const response = await fetch(`/api/users/${session.user.id}/product`);
      const data = await response.json();
      const formattedData = data.map((product) => ({
        ...product,
        Price: formatPrice(product.Price),
      }));
      setProducts(formattedData);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false); // Even on error, stop loading
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      try {
        if (session?.user?.id) {
          fetchProducts();
        }
      } catch (error) {
        setError("An error occurred while fetching products");        
      }
    }
  }, [status, session ,router]);

  const formatPrice = (Price) => {
    return Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDelete = async (ProductID) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/users/${session.user.id}/product/${ProductID}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          setProducts(
            products.filter((product) => product.ProductID !== ProductID)
          );
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

  const handleOpenEditDialog = (ProductID) => {
    setSelectedProductId(ProductID);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedProductId(null);
    setOpenEditDialog(false);
  };

  const handleAddProduct = async (productData) => {
    const response = await fetch(`/api/users/${session.user.id}/product`, {
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

  const handleEditProduct = async (ProductID, productData) => {
    const response = await fetch(`/api/users/${session.user.id}/product/edit?ProductID=${ProductID}`, {
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

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a more sophisticated loading UI
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาผู้ใช้..." />
        <Button
          sx={{
            color: "var(--text)",
            backgroundColor: "var(--background-add)",
            padding: "var(--padding)",
            fontSize: "var(--font-size)",
            "&:hover": {
              backgroundColor: "var(--background-hover)",
            },
          }}
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
              <tr key={product.ProductID}>
                <td>{product.ProductID}</td>
                <td>{product.plotCode}</td>
                <td>{product.ProductName}</td>
                <td>{product.ProductType}</td>
                <td>{product.Price}</td>
                <td>{product.Amount}</td>
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
                      sx={{
                        color: "var(--text)",
                        backgroundColor: "var(--background-view)",
                        padding: "var(--padding)",
                        fontSize: "var(--font-size)",
                        "&:hover": {
                          backgroundColor: "var(--background-hover)",
                        },
                      }}
                      onClick={() => handleOpenEditDialog(product.ProductID)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      sx={{
                        color: "var(--text)",
                        backgroundColor: "var(--background-delete)",
                        padding: "var(--padding)",
                        fontSize: "var(--font-size)",
                        "&:hover": {
                          backgroundColor: "var(--background-hover)",
                        },
                      }}
                      onClick={() => handleDelete(product.ProductID)}
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
          ProductID={selectedProductId}
          onSuccess={fetchProducts} // Pass the fetchProducts function as onSuccess
        />
      )}
    </div>
  );
};

export default Product;
