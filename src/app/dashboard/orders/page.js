"use client";

import AddProductDialog from "@/app/dashboard/products/add/page";
import EditProductDialog from "@/app/dashboard/products/edit/[ProductID]/page";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SortSelect from "@/app/ui/dashboard/sort/dropdown";
import styles from "@/app/ui/dashboard/products/products.module.css";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Tooltip from '@mui/material/Tooltip';

const Product = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const query = searchParams.get("query") || ""; // Get the search query
  const sortOrder = searchParams.get("sortOrder") || "asc"; // Get the sort order
  const page = parseInt(searchParams.get("page")) || 1; // Current page
  const pageSize = 10; // Number of items per page

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [filter, setFilter] = useState("แสดงทั้งหมด"); // Add state for filtering

  // Fetch products based on query, sort order, and page
  const fetchProducts = async (currentPage = page) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch(
        `/api/product/farmer/get?query=${query}&sortOrder=${sortOrder}&page=${currentPage}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const formattedData = data.products.map((product) => {
        const firstImage = product.images[0]?.imageUrl || ""; // Get the first image URL
        return {
          ...product,
          Price: formatPrice(product.Price),
          status: product.Amount === 0 ? "หมดสต็อก" : "มีสินค้า",
          imageUrl: firstImage, // Use only the first image URL
        };
      });
      setProducts(formattedData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchTotalCount = async () => {
    try {
      const response = await fetch(
        `/api/product/farmer/count?query=${query}&sortOrder=${sortOrder}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Total Products Count:", data.total); // Debugging line
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  };
  

  // Effect to fetch products and total count on params change
  useEffect(() => {
    fetchProducts(page); // Fetch products based on the current page
    fetchTotalCount(); // Fetch total count initially
  }, [query, sortOrder, page]); // Refetch products and total count when query, sort order, or page changes

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `/api/product/farmer/delete?ProductID=${productId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          fetchProducts(page); // Refresh product list after deletion
          fetchTotalCount(); // Refresh total count after deletion
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // Handlers for opening/closing dialogs
  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);
  const handleOpenEditDialog = (productId) => {
    setSelectedProductId(productId);
    setOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => {
    setSelectedProductId(null);
    setOpenEditDialog(false);
  };

  // Handle adding a new product
  const handleAddProduct = async (productData) => {
    const formData = new FormData();
    formData.append("plotCode", productData.plotCode);
    formData.append("ProductName", productData.ProductName);
    formData.append("ProductType", productData.ProductType);
    formData.append("Price", productData.Price);
    formData.append("Amount", productData.Amount);
    formData.append("status", productData.status);
    if (productData.imageUrl) {
      formData.append("imageUrl", productData.imageUrl);
    }

    alert("Product added successfully");
    fetchProducts(page); // Refresh product list after adding
    fetchTotalCount(); // Refresh total count after adding
    handleCloseAddDialog();
  };

  const handlePageChange = (newPage) => {
    if (newPage > Math.ceil(totalItems / pageSize)) {
      newPage = Math.ceil(totalItems / pageSize); // Reset to last page if out of bounds
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    replace(newUrl); // Update URL with new page number
    fetchProducts(newPage); // Fetch products for the new page
  };
  

  // Handle editing a product
  const handleEditProduct = async (productId, productData) => {
    try {
      const response = await fetch(`/api/product/farmer/put?ProductID=${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        alert("Product updated successfully");
        fetchProducts(page); // Refresh product list after updating
        fetchTotalCount(); // Refresh total count after updating
        handleCloseEditDialog();
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // Filter products based on the selected filter
  const filteredProducts = products.filter((product) => {
    if (filter === "แสดงทั้งหมด") return true;
    return product.status === filter;
  });

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาสินค้า..." />
        <Tooltip title="เพิ่มสินค้า" arrow>
          <IconButton
            aria-label="add"
            onClick={handleOpenAddDialog}
            size="large"
          >
            <AddBoxIcon fontSize="inherit" style={{ color: "#388e3c" }} />
          </IconButton>
        </Tooltip>
      </div>

      <div className={styles.filterButtons}>
        <Button
          onClick={() => setFilter("แสดงทั้งหมด")}
          variant={filter === "แสดงทั้งหมด" ? "contained" : "outlined"}
        >
          แสดงทั้งหมด
        </Button>
        <Button
          onClick={() => setFilter("หมดสต็อก")}
          variant={filter === "หมดสต็อก" ? "contained" : "outlined"}
        >
          หมดสต็อก
        </Button>
        <Button
          onClick={() => setFilter("มีสินค้า")}
          variant={filter === "มีสินค้า" ? "contained" : "outlined"}
        >
          มีสินค้า
        </Button>
        <SortSelect currentSortOrder={sortOrder} />
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
            <td>จัดการ</td>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.ProductID}>
              <td>{product.ProductID}</td>
              <td>{product.plotCode}</td>
              <td>
                <Image
                  src={product.imageUrl}
                  alt={product.ProductName}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                />
                {product.ProductName}
              </td>
              <td>{product.ProductType}</td>
              <td>{product.Price}</td>
              <td>{product.Amount}</td>
              <td>{product.status}</td>
              <td>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleOpenEditDialog(product.ProductID)}
                  size="large"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(product.ProductID)}
                  size="large"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={page}
        count={Math.ceil(totalItems / pageSize)}
        onPageChange={handlePageChange}
      />

      {openAddDialog && (
        <AddProductDialog
          onClose={handleCloseAddDialog}
          onAddProduct={handleAddProduct}
        />
      )}

      {openEditDialog && (
        <EditProductDialog
          productId={selectedProductId}
          onClose={handleCloseEditDialog}
          onEditProduct={handleEditProduct}
        />
      )}
    </div>
  );
};

export default Product;
