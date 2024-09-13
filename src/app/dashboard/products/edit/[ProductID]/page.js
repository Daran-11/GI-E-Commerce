// ตัวform/model ไว้แก้ไขข้อมูลในหน้productของfarmer
'use client' 
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
} from "@mui/material";
import Image from 'next/image';
import { useCallback, useEffect, useState } from "react";

import { useSession } from 'next-auth/react';

// Styled Paper component
const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  height: "auto",
}));

const DropZone = styled("div")(({ theme }) => ({
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: "#f5f5f5",
  marginTop: theme.spacing(2),
}));

const EditProductDialog = ({open,onClose ,ProductID,onSuccess,}) => {
  const { data: session, status } = useSession()
  
  const [formData, setFormData] = useState({
    plotCode: "",
    ProductName: "",
    ProductType: "",
    Price: "",
    Amount: "",
    status: "",
    Description: "",
    imageUrl: null, // File input for image
  });

  const [imagePreview, setImagePreview] = useState(null); // Image preview state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product with ID: ${ProductID}`); // Debugging line
        const response = await fetch(`/api/users/${session.user.id}/product/get?ProductID=${ProductID}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            plotCode: data.plotCode || "",
            ProductName: data.ProductName || "",
            ProductType: data.ProductType || "",
            Price: parseFloat(data.Price).toFixed(2) || "",
            Amount: data.Amount || "",
            status: data.status || "",
            Description: data.Description || "",
            imageUrl: data.imageUrl || null, // Fetch and set the existing image URL
          });
          if (data.imageUrl) {
            setImagePreview(data.imageUrl); // Set image preview URL
          }
        } else {
          const errorData = await response.text(); // Changed to text() to inspect raw response
          console.error("Error fetching product:", errorData);
          alert("Failed to fetch product in edit page");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("An error occurred while fetching the product data.");
      }
    };

    if (ProductID) {
      fetchProduct();
    }
  }, [ProductID]);


  //งดใช้ฟังชั่นนี้พังครับอ้าย เวลาพิม 2,000 บาท มันคิดเป็น 2 บาท เว็บเจ๊งแน่ครับอ้าย
  const formatPrice = (value) => {
    // Remove any non-numeric characters except for digits
    const cleanValue = value.replace(/[^0-9]/g, "");
  
    // Add commas for every thousand
    const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return formattedValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));
    
  };

  const handleFileChange = (file) => {
    if (file) {
      setFormData((prev) => ({ ...prev, imageUrl: file }));

      // Create a preview URL using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default drag behavior
    e.stopPropagation(); // Stop event from propagating
  };

  const handleDrop = (e) => {
    e.preventDefault(); // Prevent default drop behavior
    e.stopPropagation(); // Stop event from propagating
    const file = e.dataTransfer.files[0];
    handleFileChange(file); // Handle file change through drag-and-drop
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("ProductID", ProductID);
    formDataToSend.append("plotCode", formData.plotCode);
    formDataToSend.append("ProductName", formData.ProductName);
    formDataToSend.append("ProductType", formData.ProductType);
    formDataToSend.append("Price", formData.Price);
    formDataToSend.append("Amount", formData.Amount);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("Description", formData.Description);
  
    if (formData.imageUrl) {
      formDataToSend.append("imageUrl", formData.imageUrl);
    }
  
    try {
      const response = await fetch(`/api/users/${session.user.id}/product/${ProductID}/put`, {
        method: "PUT",
        body: formDataToSend,
      });
  
      if (response.ok) {
        const updatedProduct = await response.json();
        alert("Product updated successfully");
        handleClose();
        if (onSuccess) onSuccess(); // Notify parent component of success
      } else {
        const errorData = await response.json();
        alert(`Failed to update product: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  const handleClose = useCallback(() => {
    setFormData({
      plotCode: "",
      ProductName: "",
      ProductType: "",
      Price: "",
      Amount: "",
      status: "",
      Description: "",
      imageUrl: null,
    });
    setImagePreview(null); // Clear the image preview
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={CustomPaper}>
      <DialogTitle>แก้ไขสินค้า</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} marginTop={0}>
            <Grid item xs={12}>
              <TextField
                name="plotCode"
                label="รหัสแปลงปลูก"
                variant="outlined"
                fullWidth
                value={formData.plotCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="ProductName"
                label="ชื่อสินค้า"
                variant="outlined"
                fullWidth
                value={formData.ProductName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="ProductType"
                label="ประเภทสินค้า"
                variant="outlined"
                fullWidth
                value={formData.ProductType}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Price"
                label="ราคา"
                variant="outlined"
                fullWidth
                value={formData.Price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Amount"
                label="จำนวน"
                variant="outlined"
                type="number"
                fullWidth
                value={formData.Amount}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>สถานะ</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="สถานะ"
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Description"
                label="รายละเอียดสินค้า"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.Description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  border: "2px dashed #ccc",
                  borderRadius: "4px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  id="fileInput" // Added ID
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
                <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              </div>
            </Grid>
            <Grid item xs={12}>
                {imagePreview && (
                  <div style={{ position: 'relative', width: '100%', height: 'auto', marginTop: '10px' }}>
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      layout="responsive"
                      width={800} // Adjust the width as needed
                      height={600} // Adjust the height as needed
                      objectFit="cover"
                    />
                  </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                แก้ไขสินค้า
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
