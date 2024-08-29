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
  ProductID,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    PlotCode: "",
    ProductName: "",
    ProductType: "",
    Price: "",
    Amount: "",
    Status: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/add?ProductID=${ProductID}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            PlotCode: data.PlotCode || "",
            ProductName: data.ProductName || "",
            ProductType: data.ProductType || "",
            Price: data.Price !== null && data.Price !== undefined ? data.Price.toString() : "", // Ensure Price is a string
            Amount: data.Amount !== null && data.Amount !== undefined ? data.Amount.toString() : "",
            Status: data.Status || "",
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
    if (typeof value === 'number') {
      return value.toLocaleString(); // Format as integer with commas
    } else if (typeof value === 'string') {
      const cleanValue = value.replace(/[^0-9.]/g, ""); // Clean non-numeric characters
      const [integerPart, decimalPart] = cleanValue.split(".");
      const formattedIntegerPart = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );
      return decimalPart
        ? `${formattedIntegerPart}.${decimalPart}`
        : formattedIntegerPart;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Price") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClose = useCallback(() => {
    setFormData({
      PlotCode: "",
      ProductName: "",
      ProductType: "",
      Price: "",
      Amount: "",
      Status: "",
    });
    onClose();
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      Price: parseInt(formData.Price.replace(/[^0-9]/g, ""), 10), // Convert to integer
    };

    try {
      const response = await fetch(`/api/product/add?ProductID=${ProductID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ProductID: ProductID,
          ...formattedData,
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        alert("Product updated successfully");
        handleClose();
        if (onSuccess) onSuccess();
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
                name="PlotCode"
                label="Plot Code"
                variant="outlined"
                fullWidth
                value={formData.PlotCode || ""}
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
                value={formData.ProductName || ""}
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
                value={formData.ProductType || ""}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Price"
                label="Price"
                variant="outlined"
                fullWidth
                value={formatPrice(formData.Price)} // Format for display
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Amount"
                label="Amount"
                variant="outlined"
                type="number"
                fullWidth
                value={formData.Amount || ""}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="Status"
                  value={formData.Status || ""}
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
                Save
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
