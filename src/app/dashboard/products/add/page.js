// ตัวform/model ไว้เพิ่มข้อมูลในหน้productของfarmer completed
"use client";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField
} from "@mui/material";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";



// Custom styled Paper component
const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  width: "1600px",
  height: "750px",
}));

// Styled DropZone for image uploads
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
  const { data: session, status } = useSession()
  const [certificates, setCertificates] = useState([]);

  const userId = session.user.id;


  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      plotCode: "",
      ProductName: "",
      ProductType: "",
      Certificates: [],
      Price: "",
      Cost: "",
      Amount: "",
      status: "",
      Description: "",
      Details: "",
    },
    mode: "onChange"
  });

  const [imageFiles, setImageFiles] = useState([]);

  // Handle file selection or drag and drop
  const handleFileChange = (files) => {
    const fileArray = Array.from(files);
    setImageFiles(prev => [...prev, ...fileArray]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
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
    if (!userConfirmed) return;

    const formattedData = {
      ...data,
      Price: parseFloat(data.Price.replace(/,/g, "")).toFixed(2),
    };

      // Log the formattedData.Certificates to check its structure
  console.log("Formatted Certificates:", formattedData.Certificates);

    // Prepare form data for submission
    const formDataToSend = new FormData();
    //formDataToSend.append("plotCode", formattedData.plotCode);
    formDataToSend.append("ProductName", formattedData.ProductName);
    formDataToSend.append("ProductType", formattedData.ProductType);
    formDataToSend.append("Price", parseFloat(formattedData.Price.replace(/,/g, "")).toFixed(2));
    formDataToSend.append("Cost", formattedData.Cost);
    formDataToSend.append("Amount", formattedData.Amount);
    formDataToSend.append("status", formattedData.status);
    formDataToSend.append("Description", formattedData.Description);
    formDataToSend.append("Details", formattedData.Details);
    formDataToSend.append("Certificates", formattedData.Certificates);

    // Append image files
    imageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      const response = await fetch(`/api/users/${session.user.id}/product/add`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Product added:", result);
        onAddProduct(result); // Trigger parent component to refresh product list
        handleClose(); // Close the dialog and reset form
      } else {
        throw new Error("Error creating product");
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product: " + error.message);
    }
  };

  // Handle dialog close and reset form
  const handleClose = useCallback(() => {
    reset(); // Reset react-hook-form fields
    setImageFiles([]); // Clear image files
    onClose(); // Close the dialog
  }, [reset, onClose]);

  useEffect(() => {
    // Fetch the available certificates for the farmer
    if (status === 'authenticated' && userId) {
      console.log("user id is",userId);
      async function fetchCertificates() {
        const response = await fetch(`/api/users/${userId}/certificates`);
        const data = await response.json();
        console.log("cert data is",data);
        setCertificates(data);
      }

      fetchCertificates();      
    }

  }, [status]);
  

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
                <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>การรับรอง</InputLabel>
                  <Controller
                    name="Certificates"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="การรับรอง"
                        multiple
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return "Please select certificates"; // Optional placeholder when nothing is selected
                          }

                          return selected
                            .map((selectedId) => {
                              // Find the certificate that matches the selected ID
                              const selectedCertificate = certificates.find(
                                (certificate) => certificate.id === selectedId
                              );

                              // If a certificate is found, look into its parsed standards for the name
                              if (selectedCertificate) {
                                const standards = JSON.parse(selectedCertificate.standards);
                                return Array.isArray(standards) && standards.length > 0
                                  ? standards.map((cert) => cert.certNumber).join(", ") // Join multiple names if needed
                                  : "Unnamed certificate";
                              }
                              return "";
                            })
                            .join(", ");
                        }}
                      >
                        {certificates.length > 0 ? (
                          certificates.map((certificate) => {
                            const standards = JSON.parse(certificate.standards); // Parse the standards JSON
                            return (
                              Array.isArray(standards) && standards.length > 0 ? (
                                standards.map((cert, index) => (
                                  <MenuItem key={`${certificate.id}-${index}`} value={certificate.id}>
                                    {/* Ensure the value is certificate.id for selection */}
                                    <Checkbox
                                      checked={field.value.includes(certificate.id)} // Check if certificate.id is selected
                                    />
                                    <ListItemText
                                      primary={cert.name}
                                      secondary={`Cert No: ${cert.certNumber}, Date: ${cert.certDate}`}
                                    />
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem key={certificate.id} disabled>
                                  No standards information available
                                </MenuItem>
                              )
                            );
                          })
                        ) : (
                          <MenuItem disabled>No certificates available</MenuItem>
                        )}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>




                <Grid item xs={12} sm={6}>
                  <Controller
                    name="Cost"
                    control={control}
                    rules={{ required: "ต้นทุน is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="ต้นทุน"
                        variant="outlined"
                        fullWidth
                        error={!!errors.Cost}
                        helperText={errors.Cost?.message}
                        onChange={(e) => {
                          const formattedCost = e.target.value.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          field.onChange(formattedCost);
                        }}
                      />
                    )}
                  />
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
                <Grid item xs={12}>
                  <Controller
                    name="Details"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        label="รายละเอียดเพิ่มเติม"
                        className="input-address p-2 w-full outline outline-1 outline-gray-400 "
                        variant="outlined"
                        placeholder="รายละเอียดเพิ่มเติม(ไม่บังคับ)"
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
