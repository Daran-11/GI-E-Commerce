// ตัวform/model ไว้เพิ่มข้อมูลในหน้productของfarmer completed
"use client";
import AddIcon from '@mui/icons-material/Add';
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
  Link,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
  Typography
} from "@mui/material";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";



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
  const today = new Date(); // วันที่ปัจจุบัน
  const userId = session.user.id;
  const [charCount, setCharCount] = useState(0);
  const [manageTypes, setManageTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [varieties, setVarieties] = useState([]);



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
      HarvestedAt: "",
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
    formDataToSend.append("HarvestedAt", formattedData.HarvestedAt);
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
      console.error("ไม่สามารถเพิ่มสินค้าได้:", error);
      toast.error("ไม่สามารถเพิ่มสินค้าได้: " + error.message);
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
      console.log("user id is", userId);
      async function fetchCertificates() {
        const response = await fetch(`/api/users/${userId}/certificates`);
        const data = await response.json();
        console.log("cert data is", data);
        setCertificates(data);
      }

      fetchCertificates();
    }

  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && userId) {
    async function fetchManageTypes() {
      try {
        const response = await fetch('/api/product-types');
        if (response.ok) {
          const data = await response.json();
          setManageTypes(data.manageTypes);
        } else {
          console.error('Failed to fetch manage types');
        }
      } catch (error) {
        console.error('Error fetching manage types:', error);
      }
    }

    fetchManageTypes();
  }
  }, [status]);
  

  const handleDescriptionChange = (e) => {
    const inputText = e.target.value;
    // นับจำนวนตัวอักษร
    setCharCount(inputText.length);
  };

    // Handle type selection and update varieties
    const handleTypeChange = (type) => {
      setSelectedType(type);
      const selectedManageType = manageTypes.find((manageType) => manageType.type === type);
      setVarieties(selectedManageType?.varieties || []);
    };
  
  

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
                  <FormControl fullWidth>
                    <InputLabel>ชื่อสินค้า</InputLabel>
                    <Controller
                      name="ProductName"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTypeChange(e.target.value);
                          }}
                          label="ประเภทสินค้า"
                        >
                          {manageTypes.map((manageType) => (
                            <MenuItem key={manageType.id} value={manageType.type}>
                              {manageType.type}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
         

                {/* Variety Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>ประเภท/พันธุ์ของสินค้า</InputLabel>
                    <Controller
                      name="ProductType"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="ประเภท/พันธุ์ของสินค้า">
                          {varieties.map((variety) => (
                            <MenuItem key={variety.id} value={variety.name}>
                              {variety.name}
                            </MenuItem>
                          ))}
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
                          <MenuItem > <Link href="/dashboard/certificate/add">
                         <AddIcon/> ไม่พบใบรับรอง คลิกที่นี่เพื่อเพิ่มข้อมูลใบรับรองลงในระบบ  </Link>
                         </MenuItem>
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

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="HarvestedAt"
                    control={control}
                    rules={{ 
                      required: "วันที่เก็บเกี่ยว is required" ,
                      validate: (value) => value !== null || "กรุณาเลือกวันที่" // ตรวจสอบให้แน่ใจว่าเลือกวันแล้ว
                    }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="วันที่เก็บเกี่ยว"
                        format="dd/MMMM/yyyy" // รูปแบบวันที่
                        maxDate={today} // จำกัดไม่ให้เลือกวันที่เกินวันนี้
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.HarvestedAt}
                            helperText={errors.HarvestedAt?.message}
                            placeholder="กรุณาเลือกวันที่" // ตั้งค่า placeholder
                          />
                        )}
                        onChange={(date) => field.onChange(date)} // บันทึกค่าลงในฟอร์ม
                        value={field.value || null} // ถ้าไม่มีการเลือกวัน จะเป็น null
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
                  <Controller name="Description" control={control} rules={{ required: "โปรดใส่คำอธิบายสินค้านี้" }} render={({ field }) => (
                    <TextField {...field} 
                    label="คำอธิบายสินค้า" 
                    variant="outlined"  
                    fullWidth 
                    error={!!errors.Description} 
                    helperText={errors.Description?.message} 
                    multiline 
                    rows={4} 
                    inputProps={{ maxLength: 200 }} 
                    onChange={(e) => {
                      field.onChange(e); // เรียกใช้ onChange ของ field เพื่อให้ React Hook Form จัดการข้อมูล
                      handleDescriptionChange(e); // คำนวณจำนวนคำ
                    }}
                    />
                  )} />
               <Typography variant="body2" color="textSecondary" mt={2}>
              จำนวนอักษร: {charCount} / 200
            </Typography>
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
      <DialogActions >
      <div className='w-[80%] text-sm'>
            <h1 className='font-bold'>**หมายเหตุเกี่ยวกับค่าธรรมเนียม:**       กรุณาคำนวณต้นทุนและกำไรที่คุณต้องการก่อนตั้งราคาขายสินค้า</h1>
      Opn payments ที่ระบบเราใช้ในการชำระเงิน จะหักค่าธรรมเนียมการชำระเงิน 3.65% จากราคาขายสินค้าของคุณ ตัวอย่างเช่น:
      <p>- หากคุณตั้งราคาขายสินค้าไว้ที่ 100 บาท จะมีค่าธรรมเนียม 3.65 บาท</p>
      <p>- จำนวนเงินที่คุณจะได้รับหลังหักค่าธรรมเนียมคือ 96.35 บาท</p>


      </div>
      <div className='flex w-[20%] space-x-5 justify-end'>
        <Button onClick={handleClose} color="error" variant="contained">ยกเลิก</Button>
        <Button onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }} color="success" variant="contained" >
          เพิ่มสินค้า
        </Button>        
      </div>

      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
