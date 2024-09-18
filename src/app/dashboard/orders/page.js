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

  const fetchProducts = async (page = 1) => {
    setLoading(false); // Set loading to true before fetching
    try {
      const response = await fetch(
        `/api/product/farmer/get?query=${query}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`
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
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    fetchTotalCount(); // Fetch total count initially
  }, [query, sortOrder, page]); // Refetch products and total count when query, sort order, or page changes

  const formatPrice = (Price) => {
    return Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDelete = async (ProductID) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `/api/product/farmer/delete?ProductID=${ProductID}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          // After successful deletion, refetch the products and total count
          fetchProducts(page);
          fetchTotalCount(); // Fetch total count separately
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
    fetchProducts(page);
    fetchTotalCount(); // Fetch total count separately
    handleCloseAddDialog();
  };



  const handlePageChange = (newPage) => {
    // Update the URL with the new page number
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleEditProduct = async (ProductID, productData) => {
    try {
      const response = await fetch(`/api/product/farmer/put?ProductID=${ProductID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        alert("Product updated successfully");
        fetchProducts(page);
        fetchTotalCount(); // Fetch total count separately
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
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาสินค้า..." />

        <Tooltip
          title="เพิ่มสินค้า"
          arrow
          sx={{
            typography: 'body2',
            fontSize: '2rem', // Adjust the font size as needed
            '.MuiTooltip-tooltip': {
              fontSize: '2rem', // Ensure this is correct
            },
          }}
        >
          <IconButton aria-label="add" variant="contained" onClick={handleOpenAddDialog} size="large">
            <AddBoxIcon fontSize="inherit" style={{ color: "#388e3c" }} />
          </IconButton>
        </Tooltip>


      </div>

      <div className={styles.filterButtons}>

        <Button
          onClick={() => setFilter("แสดงทั้งหมด")}
          variant={filter === "แสดงทั้งหมด" ? "contained" : "outlined"}
          style={{ backgroundColor: filter === "แสดงทั้งหมด" ? "#98de6d" : "#ffffff", color: filter === "แสดงทั้งหมด" ? "black" : "#388e3c" }}
        >
          แสดงทั้งหมด
        </Button>
        <Button
          onClick={() => setFilter("หมดสต็อก")}
          variant={filter === "หมดสต็อก" ? "contained" : "outlined"}
          style={{ backgroundColor: filter === "หมดสต็อก" ? "#98de6d" : "#ffffff", color: filter === "หมดสต็อก" ? "black" : "#388e3c" }}
        >
          หมดสต็อก
        </Button>
        <Button
          onClick={() => setFilter("มีสินค้า")}
          variant={filter === "มีสินค้า" ? "contained" : "outlined"}
          style={{ backgroundColor: filter === "มีสินค้า" ? "#98de6d" : "#ffffff", color: filter === "มีสินค้า" ? "black" : "#388e3c" }}
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
            <td>รูปภาพ</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.ProductID}>
                <td>{product.ProductID}</td>
                <td>{product.plotCode}</td>
                <td>{product.ProductName}</td>
                <td>{product.ProductType}</td>
                <td>{product.Price}</td>
                <td>{product.Amount}</td>
                <td>
                  <span
                    className={`${styles.status} ${styles[product.status.replace(/ /g, "-")]
                      }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.ProductName}
                      width={200} // Adjust width as needed
                      height={200} // Adjust height as needed
                      style={{
                        objectFit: "cover",
                        marginTop: "10px",
                      }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>
                  <div className={styles.buttons}>
                    <Tooltip title="แก้ไขสินค้า"
                      arrow>
                      <IconButton aria-label="edit" color="success" variant="contained" onClick={() => handleOpenEditDialog(product.ProductID)} size="large">
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="ลบสินค้า"
                      arrow>
                      <IconButton aria-label="delete" color="error" variant="contained" onClick={() => handleDelete(product.ProductID)} size="large">
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
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

      <Pagination
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
      />

      <AddProductDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onAddProduct={handleAddProduct}
      />

      {selectedProductId && (
        <EditProductDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          onEditProduct={handleEditProduct}
          ProductID={selectedProductId}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default Product;