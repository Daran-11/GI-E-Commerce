"use client";
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
import { useCallback, useState } from "react";

// Styled Paper component
const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  height: "auto",
}));

const AddProductDialog = ({ open, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    plotCode: "",
    ProductName: "",
    ProductType: "",
    Price: "",
    Amount: "",
    status: "",
  });

  // Format price with commas
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
    if (name === "price") {
      const formattedValue = formatPrice(value);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert price with commas to float
    const formattedData = {
      ...formData,
      Price: parseFloat(formData.Price.replace(/,/g, "")).toFixed(2),
    };

    await onAddProduct(formattedData);
    handleClose();
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
    });
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
                label="สายพันธุ์"
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
