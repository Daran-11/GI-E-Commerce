"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./add.css";

const Register = () => {
  const [formData, setFormData] = useState({
    type: "",
    variety: "",
    plotCode: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    hasCertificate: "",
    imageUrl: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [farmerId, setFarmerId] = useState(null);
  const router = useRouter();

  // ดึง farmerId จาก localStorage แทนที่จะใช้ session
  useEffect(() => {
    const storedFarmerId = localStorage.getItem('farmerId');
    if (storedFarmerId) {
      setFarmerId(storedFarmerId);
    } else {
      console.error("Farmer ID not found in localStorage");
      // อาจจะ redirect ไปหน้า login หรือแสดง error message
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageUrl: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const newErrors = {};
    // ... (validation logic remains the same)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    
    // เพิ่ม farmerId จาก state (ที่ได้มาจาก localStorage) ลงใน formData
    if (farmerId) {
      formDataToSend.append("farmerId", farmerId);
    } else {
      alert("Farmer ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("/api/certificate/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add certificate");
      }

      alert("Certificate added successfully");
      router.push("/dashboard/certificate");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to add certificate");
    }
  };

  return (
    <div className="container">
      <main className="mainContent">
        <h1 className="title-name">ขอใบรับรอง</h1>
        <p className="subtitle-name">ข้อมูลผลิต</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-container">
            <p className="section-name">ชนิด</p>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="formInput"
              required
            >
              <option value="" disabled hidden>
                -
              </option>
              <option value="สับปะรด">สับปะรด</option>
            </select>
            {errors.type && <p className="error">{errors.type}</p>}

            <p className="section-name">สายพันธุ์</p>
            <input
              name="variety"
              type="text"
              placeholder="สายพันธุ์"
              value={formData.variety}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.variety && <p className="error">{errors.variety}</p>}

            <p className="section-name">รหัสแปลงปลูก</p>
            <input
              name="plotCode"
              type="text"
              placeholder="รหัสแปลงปลูก"
              value={formData.plotCode}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.plotCode && <p className="error">{errors.plotCode}</p>}

            <p className="section-name">พิกัดแกน X (ละติจูด)</p>
            <input
              name="latitude"
              type="text"
              placeholder="พิกัดแกน X (ละติจูด)"
              value={formData.latitude}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.latitude && <p className="error">{errors.latitude}</p>}

            <p className="section-name">พิกัดแกน Y (ลองจิจูด)</p>
            <input
              name="longitude"
              type="text"
              placeholder="พิกัดแกน Y (ลองจิจูด)"
              value={formData.longitude}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.longitude && <p className="error">{errors.longitude}</p>}

            <p className="section-name">จำนวนผลผลิต (กิโลกรัม)</p>
            <input
              name="productionQuantity"
              type="text"
              placeholder="จำนวนผลผลิต (กิโลกรัม)"
              value={formData.productionQuantity}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.productionQuantity && (
              <p className="error">{errors.productionQuantity}</p>
            )}

            <p className="section-name">ใบรับรอง กรม</p>
            <select
              name="hasCertificate"
              value={formData.hasCertificate}
              onChange={handleChange}
              className="formInput"
              required
            >
              <option value="" disabled hidden>
                -
              </option>
              <option value="มี">มี</option>
              <option value="ไม่มี">ไม่มี</option>
            </select>
            {errors.hasCertificate && (
              <p className="error">{errors.hasCertificate}</p>
            )}

            {formData.hasCertificate === "มี" && (
              <div>
                <input
                  name="imageUrl"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input"
                  required
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="image-preview"
                  />
                )}
                {errors.imageUrl && <p className="error">{errors.imageUrl}</p>}
              </div>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="button-submit">
              เพิ่มใบรับรอง
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
