// หน้าหลักของproduct-farmer completed
"use client";

import AddProductDialog from "@/app/dashboard/products/add/page";
import EditProductDialog from "@/app/dashboard/products/edit/[ProductID]/page";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import Button from "@mui/material/Button";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const router = useRouter()
  const [filter, setFilter] = useState("แสดงทั้งหมด"); // Add state for filtering




  const fetchProducts = async (page = 1) => {
    setLoading(false); // Set loading to true when fetching starts
    try {
      const response = await fetch(`/api/users/${session.user.id}/product/get?query=${query}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error fetching products:", errorMessage);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data structure matches what is expected
      if (data.products && Array.isArray(data.products)) {
        const formattedData = data.products.map((product) => {
          const firstImage = product.images?.[0]?.imageUrl || ""; // Get the first image URL
          return {
            ...product,
            Price: formatPrice(product.Price), // Format the price
            status: product.Amount === 0 ? "หมดสต็อก" : "มีสินค้า", // Set status based on amount
            imageUrl: firstImage, // Include the first image URL
          };
        });

        setProducts(formattedData); // Set the formatted products
        setTotalItems(data.totalItems); // Extract totalItems directly from the response
      } else {
        console.error("Invalid product data:", data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };





  const fetchTotalCount = async () => {
    try {
      const response = await fetch(
        `/api/users/${session.user.id}/product/get?query=${query}&sortOrder=${sortOrder}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // console.log("Total count response:", data); // Log the response
      setTotalItems(data.totalItems); // Make sure this line corresponds to the correct property
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  };


  const filteredProducts = products.filter((product) => {
    if (filter === "แสดงทั้งหมด") return true;
    if (filter === "มีสินค้า") return product.status === "มีสินค้า";
    if (filter === "หมดสต็อก") return product.status === "หมดสต็อก";
    return false;
  });


  // console.log(`In Stock: ${inStockCount}, Out of Stock: ${outOfStockCount}`);



  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchTotalCount(); // First fetch total count
      fetchProducts(page); // Then fetch products
    }
  }, [query, sortOrder, page, status, session, router]);



  const formatPrice = (Price) => {
    return Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };



  const handleDelete = async (ProductID) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/users/${session.user.id}/product/${ProductID}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
        }
        );

        if (response.ok) {
          // After successful deletion, refetch the products and total count
          fetchProducts(page);
          fetchTotalCount(); // Fetch total count separately
          setProducts(products.filter((product) => product.ProductID !== ProductID));
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    params.set("query", query);
    params.set("sortOrder", sortOrder);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    replace(newUrl);
    fetchProducts(newPage); // Fetch products for the new page
  };


  const handleEditProduct = async (ProductID, productData) => {
    const response = await fetch(`/api/users/${session.user.id}/product/${ProductID}/put`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert("Product updated successfully");
      fetchProducts(); // Refetch products after editing
      fetchTotalCount(); // Fetch total count separately
      handleCloseEditDialog();
    } else {
      alert("Failed to update product");
    }
  };


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
              <td colSpan={9}>ไม่มีสินค้า</td>
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