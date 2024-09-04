"use client";
import { useState, useCallback, useEffect } from "react";
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

const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: "20px",
  backgroundColor: "#f5f5f5",
}));

const EditProductDialog = ({
  open,
  onClose,
  onEditProduct,
  ProductID,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    plotCode: "",
    ProductName: "",
    ProductType: "",
    price: "",
    amount: "",
    status: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/add?ProductID=${ProductID}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            plotCode: data.plotCode,
            ProductName: data.ProductName,
            ProductType: data.ProductType,
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

    if (ProductID) {
      fetchProduct();
    }
  }, [ProductID]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const formattedValue = formatPrice(value);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle dialog close and reset form
  const handleClose = useCallback(() => {
    setFormData({
      plotCode: "",
      ProductName: "",
      ProductType: "",
      price: "",
      amount: "",
      status: "",
    });
    onClose();
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
    };

    try {
      const response = await fetch(`/api/product/add?ProductID=${ProductID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: ProductID, // Include the id in the request body
          ...formattedData,
        }),
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

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={CustomPaper}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} marginTop={0}>
            <Grid item xs={12}>
              <TextField
                name="plotCode"
                label="Plot Code"
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
                label="Product Name"
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
                label="Variety"
                variant="outlined"
                fullWidth
                value={formData.ProductType}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="price"
                label="Price"
                variant="outlined"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="amount"
                label="Amount"
                variant="outlined"
                type="number"
                fullWidth
                value={formData.amount}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                บันทึก
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
