"use client";
import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
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
import Image from "next/image";

const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  width: "1600px",
  height: "750px",
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
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    defaultValues: {
      plotCode: "",
      ProductName: "",
      ProductType: "",
      Price: "",
      Amount: "",
      status: "",
      Description: "",
    },
    mode: "onChange"
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleFileChange = (files) => {
    const fileArray = Array.from(files);
    setImageFiles(prev => [...prev, ...fileArray]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files);
    }
  };

  const handleInputFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileChange(files);
    }
  };

  const handleImageRemove = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
   
    const userConfirmed = window.confirm("คุณแน่ใจหรือว่าต้องการเพิ่มสินค้านี้?");
    if (!userConfirmed) {
      return;
    }
  
    const formattedData = {
      ...data,
      Price: parseFloat(data.Price.replace(/,/g, "")).toFixed(2),
    };
  
    const formDataToSend = new FormData();
    formDataToSend.append("plotCode", formattedData.plotCode);
    formDataToSend.append("ProductName", formattedData.ProductName);
    formDataToSend.append("ProductType", formattedData.ProductType);
    formDataToSend.append("Price", formattedData.Price);
    formDataToSend.append("Amount", formattedData.Amount);
    formDataToSend.append("status", formattedData.status);
    formDataToSend.append("Description", formattedData.Description);
  
    imageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });
  
    try {
      const response = await fetch("/api/product/farmer/post", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error adding product:", errorData);
        throw new Error("Error adding product");
      }
  
      const result = await response.json();
      console.log("Product added:", result);
      onAddProduct(result); // Pass the new product data to the parent
      handleClose();
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product: " + error.message);
    }
  };
  
  const handleClose = useCallback(() => {
    reset();
    setImageFiles([]);
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={CustomPaper} maxWidth="lg">
      <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <DropZone
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  hidden
                  multiple
                  onChange={handleInputFileChange}
                />
                <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              </DropZone>

              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                {imageFiles.map((file, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    sm={imageFiles.length === 1 ? 12 : 6}
                    style={{ position: "relative" }}
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Image Preview"
                      layout="responsive"
                      width={imageFiles.length === 1 ? 800 : 400}
                      height={imageFiles.length === 1 ? 600 : 300}
                      objectFit="cover"
                    />
                    <Button
                      onClick={() => handleImageRemove(index)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        minWidth: "unset",
                        padding: 0,
                        fontSize: "18px",
                        lineHeight: "30px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </Button>
                  </Grid>
                ))}
              </Grid>

            </Grid>

            <Grid item xs={12} sm={5}>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={12}>
                  <Controller
                    name="plotCode"
                    control={control}
                    rules={{ required: "รหัสแปลงปลูก is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="รหัสแปลงปลูก"
                        variant="outlined"
                        fullWidth
                        error={!!errors.plotCode}
                        helperText={errors.plotCode?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="ProductName"
                    control={control}
                    rules={{ required: "ชื่อสินค้า is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="ชื่อสินค้า"
                        variant="outlined"
                        fullWidth
                        error={!!errors.ProductName}
                        helperText={errors.ProductName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>ประเภทสินค้า</InputLabel>
                    <Controller
                      name="ProductType"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="ประเภทสินค้า">
                          <MenuItem value="นางแล">นางแล</MenuItem>
                          <MenuItem value="ภูแล">ภูแล</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="Price"
                    control={control}
                    rules={{ required: "ราคา is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="ราคา"
                        variant="outlined"
                        fullWidth
                        error={!!errors.Price}
                        helperText={errors.Price?.message}
                        onChange={(e) => {
                          const formattedPrice = e.target.value.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          field.onChange(formattedPrice);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="Amount"
                    control={control}
                    rules={{
                      required: "จำนวน is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "จำนวน must be a valid integer",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="จำนวน"
                        variant="outlined"
                        fullWidth
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        error={!!errors.Amount}
                        helperText={errors.Amount?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>สถานะสินค้า</InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="สถานะสินค้า">
                          <MenuItem value="มีสินค้า">มีสินค้า</MenuItem>
                          <MenuItem value="หมดสต็อก">หมดสต็อก</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="Description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="คำอธิบาย"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained">ยกเลิก</Button>
        <Button onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }} color="success" variant="contained" >
          เพิ่มสินค้า
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
