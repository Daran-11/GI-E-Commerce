"use client";
import { useState, useCallback, useEffect } from "react";
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
import { useSession } from "next-auth/react";

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

const EditProductDialog = ({ open, onClose, ProductID, onSuccess }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      plotCode: "",
      ProductName: "",
      ProductType: "",
      Price: "",
      Cost: "",
      Amount: "",
      status: "",
      Description: "",
    },
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [initialImages, setInitialImages] = useState([]);
  const { data: session, status } = useSession();
  const [hasFetched, setHasFetched] = useState(false);

  
useEffect(() => {
  const fetchProduct = async () => {
    if (!session || !ProductID || hasFetched) return;

    try {
      const response = await fetch(`/api/users/${session.user.id}/product/get?ProductID=${ProductID}`);
      if (!response.ok) {
        console.error("Error fetching product:", await response.text());
        alert("Failed to fetch product data. Please try again.");
        return;
      }

      const data = await response.json();
      reset({
        plotCode: data.plotCode || "",
        ProductName: data.ProductName || "",
        ProductType: data.ProductType || "",
        Price: data.Price ? parseFloat(data.Price).toFixed(2) : "",
        Cost: data.Cost || "",
        Amount: data.Amount || "",
        status: data.status || "",
        Description: data.Description || "",
      });

      const imageUrls = Array.isArray(data.images) ? data.images.map(img => img.imageUrl) : [];
      setInitialImages(imageUrls);
      setImagePreviews(imageUrls);

      // Set `hasFetched` to true after successfully fetching and setting data
      setHasFetched(true);
    } catch (error) {
      console.error("Error occurred while fetching product:", error);
      alert("An error occurred while fetching the product data.");
    }
  };

  // Fetch product only if `ProductID` is available and it hasn't been fetched yet
  if (ProductID && !hasFetched) {
    fetchProduct();
  }
}, [ProductID, reset, session, hasFetched]);

  const handleFileChange = (files) => {
    const fileArray = Array.from(files);
    const imageUrls = fileArray.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...fileArray]);
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
    const imageToRemove = imagePreviews[index];
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (initialImages.includes(imageToRemove)) {
      setImagesToDelete(prev => [...prev, imageToRemove]);
    }
  };

  const onSubmit = async (data) => {
    if (!window.confirm("คุณแน่ใจหรือว่าต้องการอัปเดตสินค้านี้?")) {
      return;
    }

    const formattedData = {
      ...data,
      Price: parseFloat(data.Price.replace(/,/g, "")).toFixed(2),
    };

    const formDataToSend = new FormData();
    formDataToSend.append("ProductID", ProductID);
    formDataToSend.append("plotCode", formattedData.plotCode);
    formDataToSend.append("ProductName", formattedData.ProductName);
    formDataToSend.append("ProductType", formattedData.ProductType);
    formDataToSend.append("Price", formattedData.Price);
    formDataToSend.append("Cost", formattedData.Cost);
    formDataToSend.append("Amount", formattedData.Amount);
    formDataToSend.append("status", formattedData.status);
    formDataToSend.append("Description", formattedData.Description);

    imagePreviews.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("images", file);
      }
    });

    imagesToDelete.forEach((imageUrl) => {
      formDataToSend.append("imagesToDelete", imageUrl);
    });

    try {
      const response = await fetch(`/api/users/${session.user.id}/product/${ProductID}/put`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Error updating product");
      }

      await onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product: " + error.message);
    }
  };

  const handleClose = useCallback(() => {
    reset({
      plotCode: "",
      ProductName: "",
      ProductType: "",
      Price: "",
      Cost: "",
      Amount: "",
      status: "",
      Description: "",
    });
    setImagePreviews([]);
    setImagesToDelete([]);
    setInitialImages([]);
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={CustomPaper} maxWidth="lg">
      <DialogTitle>แก้ไขสินค้า</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <DropZone onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => document.getElementById("fileInput").click()}>
                <input type="file" id="fileInput" hidden multiple onChange={handleInputFileChange} />
                <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              </DropZone>
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                {imagePreviews.map((image, index) => (
                  <Grid item key={index} xs={12} sm={imagePreviews.length === 1 ? 12 : 6} style={{ position: "relative" }}>
                    <Image src={image instanceof File ? URL.createObjectURL(image) : image} alt="Image Preview" layout="responsive" width={imagePreviews.length === 1 ? 800 : 400} height={imagePreviews.length === 1 ? 600 : 300} objectFit="cover" />
                    <Button onClick={() => handleImageRemove(index)} style={{
                      position: "absolute", top: 0, right: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white", borderRadius: "50%", width: "30px", height: "30px", minWidth: "unset", padding: 0, fontSize: "18px", lineHeight: "30px", cursor: "pointer",
                    }}>
                      X
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={12}>
                  <Controller name="plotCode" control={control} rules={{ required: "รหัสแปลงปลูก is required" }} render={({ field }) => (
                    <TextField {...field} label="รหัสแปลงปลูก" variant="outlined" fullWidth error={!!errors.plotCode} helperText={errors.plotCode?.message} />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="ProductName" control={control} rules={{ required: "ชื่อสินค้า is required" }} render={({ field }) => (
                    <TextField {...field} label="ชื่อสินค้า" variant="outlined" fullWidth error={!!errors.ProductName} helperText={errors.ProductName?.message} />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>ประเภทสินค้า</InputLabel>
                    <Controller name="ProductType" control={control} rules={{ required: "ประเภทสินค้า is required" }} render={({ field }) => (
                      <Select {...field} label="ประเภทสินค้า">
                        <MenuItem value="นางแล">นางแล</MenuItem>
                        <MenuItem value="ภูแล">ภูแล</MenuItem>
                      
                      </Select>
                    )} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller name="Price" control={control} rules={{ required: "ราคาสินค้า is required" }} render={({ field }) => (
                    <TextField {...field} label="ราคาสินค้า (บาท)" variant="outlined" fullWidth error={!!errors.Price} helperText={errors.Price?.message} onChange={(e) => field.onChange(e.target.value.replace(/[^0-9,.]/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"))} />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller name="Cost" control={control} rules={{ required: "ราคาทุนสินค้า is required" }} render={({ field }) => (
                    <TextField {...field} label="ราคาทุนสินค้า (บาท)" variant="outlined" fullWidth error={!!errors.Cost} helperText={errors.Cost?.message} onChange={(e) => field.onChange(e.target.value.replace(/[^0-9,.]/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"))} />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller name="Amount" control={control} rules={{ required: "จำนวนสินค้า is required" }} render={({ field }) => (
                    <TextField {...field} label="จำนวนสินค้า" variant="outlined" fullWidth error={!!errors.Amount} helperText={errors.Amount?.message} />
                  )} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>สถานะ</InputLabel>
                    <Controller name="status" control={control} rules={{ required: "สถานะสินค้า is required" }} render={({ field }) => (
                      <Select {...field} label="สถานะ">
                        <MenuItem value="มีสินค้า">มีสินค้า</MenuItem>
                        <MenuItem value="หมดสต็อก">หมดสต็อก</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Controller name="Description" control={control} render={({ field }) => (
                    <TextField {...field} label="รายละเอียดสินค้า" variant="outlined" fullWidth multiline rows={4} />
                  )} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">ยกเลิก</Button>
        <Button onClick={handleSubmit(onSubmit)} color="success" variant="contained">
          อัปเดตสินค้า
        </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
