"use client";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  Paper,
} from "@mui/material";

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

const AddProductDialog = ({ open, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    plotCode: "",
    ProductName: "",
    ProductType: "",
    Price: "",
    Amount: "",
    status: "",
    description: "",
    imageUrl: null, // File input for image
  });

  const [imagePreview, setImagePreview] = useState(null); // Image preview state

  // Format Price with commas
  const formatPrice = (value) => {
    const cleanValue = value.replace(/[^0-9.]/g, "");
    const [integerPart, decimalPart] = cleanValue.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Price") {
      const formattedValue = formatPrice(value);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file upload change and generate preview
  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, imageUrl: file }));

    // Create a preview URL using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set image preview URL
    };
    if (file) {
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  // Handle file input change
  const handleInputFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert Price with commas to float
    const formattedData = {
      ...formData,
      Price: parseFloat(formData.Price.replace(/,/g, "")).toFixed(2),
    };

    // Create a FormData object to handle both text fields and file upload
    const formDataToSend = new FormData();
    formDataToSend.append("plotCode", formData.plotCode);
    formDataToSend.append("ProductName", formData.ProductName);
    formDataToSend.append("ProductType", formData.ProductType);
    formDataToSend.append("Price", formattedData.Price);
    formDataToSend.append("Amount", formData.Amount);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("description", formData.description);

    if (formData.imageUrl) {
      formDataToSend.append("imageUrl", formData.imageUrl);
    }

    try {
      const response = await fetch("/api/product/farmer/post", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Error creating product");
      }

      const result = await response.json();
      console.log("Product added:", result);
      await onAddProduct(formattedData);
      handleClose(); // Close the dialog after successful submission
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Handle dialog close and reset form
  const handleClose = useCallback(() => {
    setFormData({
      plotCode: "",
      ProductName: "",
      ProductType: "",
      Price: "",
      Amount: "",
      status: "",
      description: "",
      imageUrl: null,
    });
    setImagePreview(null); // Clear the image preview
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={CustomPaper}>
      <DialogTitle>เพิ่มสินค้า</DialogTitle>
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
                name="description"
                label="รายละเอียดสินค้า"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DropZone
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  hidden
                  onChange={handleInputFileChange}
                />
                <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              </DropZone>
            </Grid>
            <Grid item xs={12}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    marginTop: "10px",
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                เพิ่มสินค้า
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

export default AddProductDialog;
