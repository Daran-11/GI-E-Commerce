"use client";
import {
  Button,
  CircularProgress,
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
  Typography
} from "@mui/material";
import { format } from 'date-fns';
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

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
      Certificates: [],
      Price: "",
      Cost: "",
      Amount: "",
      status: "",
      Description: "",
      HarvestedAt: "",
      Details: "",
    },
  });


  const [certificates, setCertificates] = useState([]);
  const [certNumbers, setCertNumbers] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [initialImages, setInitialImages] = useState([]);

  const { data: session, status } = useSession();
  const [hasFetched, setHasFetched] = useState(false);
  const userId = session.user.id;
  const [charCount, setCharCount] = useState(0);
  


  
  // Fetch product data using SWR
  const fetchProduct = (url) => fetch(url).then(res => res.json());
  const { data: productData, error: productError, isLoading } = useSWR(
    ProductID && session ? `/api/users/${session.user.id}/product/get?ProductID=${ProductID}` : null, 
    fetchProduct
  );

    // Fetch certificates for the user
    const { data: certificatesData, error: certError } = useSWR(
      status === 'authenticated' ? `/api/users/${session?.user.id}/certificates` : null,
      fetchProduct
    );

    useEffect(() => {
  if (productData) {
    const initial = productData.images ? productData.images.map((img) => img.imageUrl) : [];
    setInitialImages(initial);
    console.log("Initial images set: ", initial);
  }
}, [productData]);
  

  useEffect(() => {
    if (productData) {
      const certNumbers = Array.isArray(productData.certificates)
        ? productData.certificates.flatMap(cert =>
            cert.certificate?.standards?.map(standard => standard.certNumber) || []
          )
        : [];
      reset({
        ProductName: productData.ProductName || "",
        ProductType: productData.ProductType || "",
        Price: productData.Price ? parseFloat(productData.Price).toFixed(2) : "",
        Cost: productData.Cost || "",
        Amount: productData.Amount || "",
        status: productData.status || "",
        Description: productData.Description || "",
        Details: productData.Details || "",
        Certificates: productData.certificates || [],
        HarvestedAt: productData.HarvestedAt || '',
      });
      setCertNumbers(certNumbers);
      setImagePreviews(productData.images ? productData.images.map(img => img.imageUrl) : []);
    }
    if (certificatesData) {
      setCertificates(certificatesData);
    }
  }, [productData, certificatesData, reset]);




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
    console.log("Removing image: ", imageToRemove);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    
    if (initialImages.includes(imageToRemove)) {
      setImagesToDelete((prev) => [...prev, imageToRemove]);
      console.log("Images to delete: ", [...imagesToDelete, imageToRemove]);
    } else {
      console.log("Image not in initialImages, skipping delete: ", imageToRemove);
    }
  };

  const onSubmit = async (data) => {
    console.log("Images to delete before submit:", imagesToDelete);
    if (!window.confirm("คุณแน่ใจหรือว่าต้องการอัปเดตสินค้านี้?")) {
      return;
    }

    const formattedData = {
      ...data,
      Price: parseFloat(data.Price.replace(/,/g, "")).toFixed(2),
    };

    const formDataToSend = new FormData();
    formDataToSend.append("ProductID", ProductID);
    formDataToSend.append("ProductName", formattedData.ProductName);
    formDataToSend.append("ProductType", formattedData.ProductType);
    formDataToSend.append("Price", formattedData.Price);
    formDataToSend.append("Cost", formattedData.Cost);
    formDataToSend.append("Amount", formattedData.Amount);
    formDataToSend.append("status", formattedData.status);
    formDataToSend.append("Description", formattedData.Description);
    formDataToSend.append("Details", formattedData.Details);
    formDataToSend.append("Certificates", formattedData.Certificates);

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
      toast.success("แก้ไขสินค้าสำเร็จ")
      handleClose();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("ไม่สามารถแก้ไขสินค้าได้: " + error.message);
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
      HarvestedAt: "",
    });
    
    setImagePreviews([]);
    setImagesToDelete([]);
    setInitialImages([]);
    onClose();
  }, [reset, onClose]);

  

  const selectedCertNumber = certificates
    .find(cert => cert.id === selectedCertificate)?.certificate?.[0]?.standards?.[0]?.certNumber || '';

  const handleDescriptionChange = (e) => {
    const inputText = e.target.value;
    // นับจำนวนตัวอักษร
    setCharCount(inputText.length);
  };

  const Loading = () => {
    return (
      <Dialog open={open} onClose={handleClose} PaperComponent={CustomPaper} maxWidth="lg">
       <DialogTitle>แก้ไขสินค้า</DialogTitle>    
       <DialogContent>
       <div className="flex justify-center items-center">
          <CircularProgress/>
       </div>
       </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return <Loading />;
  }


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
              <Grid container spacing={3} paddingTop={2}>
                <Grid item xs={12}>
                  <Controller name="ProductName" control={control} rules={{ required: "ชื่อสินค้า is required" }} render={({ field }) => (
                    <TextField {...field} label="ชื่อสินค้า" variant="outlined" fullWidth disabled error={!!errors.ProductName} helperText={errors.ProductName?.message} 
                    InputProps={{
                      readOnly: true, // Make it read-only if the field is just for display
                    }}
                    />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="ProductType" control={control}  render={({ field }) => (
                    <TextField {...field} label="ประเภท" variant="outlined" fullWidth disabled error={!!errors.ProductName} helperText={errors.ProductName?.message} 
                    InputProps={{
                      readOnly: true, // Make it read-only if the field is just for display
                    }}
                    />
                  )} />
                </Grid>

                <Grid item xs={12}>
                <Controller
                  name="HarvestedAt"
                  control={control}
                  render={({ field }) => {
                    const validDate = field.value ? new Date(field.value) : null;
                    const formattedDate = validDate && !isNaN(validDate) ? format(validDate, 'dd/MM/yyyy') : '';

                    return (
                      <TextField
                        {...field}
                        label="วันที่เก็บเกี่ยว"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={formattedDate}
                        error={!!errors.HarvestedAt}
                        helperText={errors.HarvestedAt?.message}
                        InputProps={{
                          readOnly: true, // Make it read-only if the field is just for display
                        }}
                      />
                    );
                  }}
                />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={certNumbers}
                    label="ใบรับรอง"
                    variant="outlined"
                    fullWidth
                    disabled
                    InputProps={{
                      readOnly: true, // Make it read-only if the field is just for display
                    }}
                  />
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
          <DialogActions>
          <div className='w-[80%] text-sm'>
            <h1 className='font-bold'>**หมายเหตุเกี่ยวกับค่าธรรมเนียม:**       กรุณาคำนวณต้นทุนและกำไรที่คุณต้องการก่อนตั้งราคาขายสินค้า</h1>
          Opn payments ที่ระบบเราใช้ในการชำระเงิน จะหักค่าธรรมเนียมการชำระเงิน 3.65% จากราคาขายสินค้าของคุณ ตัวอย่างเช่น:
          <p>- หากคุณตั้งราคาขายสินค้าไว้ที่ 100 บาท จะมีค่าธรรมเนียม 3.65 บาท</p>
          <p>- จำนวนเงินที่คุณจะได้รับหลังหักค่าธรรมเนียมคือ 96.35 บาท</p>


          </div>
          <div className='flex w-[20%] space-x-5 justify-end'>
            <Button onClick={handleClose} color="error" variant="contained">ยกเลิก</Button>
            <Button onClick={handleSubmit(onSubmit)} color="success" variant="contained">
              อัปเดตสินค้า
            </Button>
          </div>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
