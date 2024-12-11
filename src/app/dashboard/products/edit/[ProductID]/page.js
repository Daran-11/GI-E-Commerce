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
  TextField
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!session || !ProductID || hasFetched) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}/product/get?ProductID=${ProductID}`);
        if (!response.ok) {
          console.error("Error fetching product:", await response.text());
          toast.error("ไม่สามารถดึงข้อมูลสินค้าได้: โปรดกดปุ่ม F5 เพื่อรีเฟรชหน้าจอ หรือ ลองอีกหลังในภายหลัง");
          return;
        }

        const data = await response.json();
        console.log("data cer", data.certificates)

        // Process certificates to extract certNumber
        const certNumbers = Array.isArray(data.certificates)
          ? data.certificates.flatMap(cert =>
            cert.certificate?.standards?.map(standard => standard.certNumber) || []
          )
          : [];

        console.log("certNumbers", certNumbers); // Log certNumbers for debugging      

        reset({
          ProductName: data.ProductName || "",
          ProductType: data.ProductType || "",
          Price: data.Price ? parseFloat(data.Price).toFixed(2) : "",
          Cost: data.Cost || "",
          Amount: data.Amount || "",
          status: data.status || "",
          Description: data.Description || "",
          Details: data.Details || "",
          Certificates: data.certificates || [] // Set existing certificates
        });


        const imageUrls = Array.isArray(data.images) ? data.images.map(img => img.imageUrl) : [];
        setInitialImages(imageUrls);
        setImagePreviews(imageUrls);
        setCertNumbers(certNumbers);
        // Set `hasFetched` to true after successfully fetching and setting data
        setHasFetched(true);
      } catch (error) {
        console.error("Error occurred while fetching product:", error);
        toast.error("พบข้อผิดพลาดขณะดึงข้อมูลสินค้า");
      }
    };

    // Fetch product only if `ProductID` is available and it hasn't been fetched yet
    if (ProductID && !hasFetched) {
      fetchProduct();
    }
  }, [ProductID, reset, session, hasFetched]);

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
    });
    setImagePreviews([]);
    setImagesToDelete([]);
    setInitialImages([]);
    onClose();
  }, [reset, onClose]);

  const selectedCertNumber = certificates
    .find(cert => cert.id === selectedCertificate)?.certificate?.[0]?.standards?.[0]?.certNumber || '';


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
                  <Controller name="Description" control={control} render={({ field }) => (
                    <TextField {...field} label="รายละเอียดสินค้า" variant="outlined" fullWidth multiline rows={4} />
                  )} />
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
