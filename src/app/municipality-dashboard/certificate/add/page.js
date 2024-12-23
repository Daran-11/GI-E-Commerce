"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import './add.css';
import { toast } from "react-toastify";

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
    UsersId: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when user starts typing
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageUrl: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, imageUrl: "" })); // Clear the error when file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const newErrors = {};
    if (!formData.type) newErrors.type = "กรุณากรอกชนิด";
    if (!formData.variety) newErrors.variety = "กรุณากรอกสายพันธุ์";
    if (!formData.plotCode) newErrors.plotCode = "กรุณากรอกรหัสแปลงปลูก";
    if (!formData.latitude) newErrors.latitude = "กรุณากรอกพิกัดแกน X (ละติจูด)";
    if (!formData.longitude) newErrors.longitude = "กรุณากรอกพิกัดแกน Y (ลองจิจูด)";
    if (!formData.productionQuantity) newErrors.productionQuantity = "กรุณากรอกจำนวนผลผลิต";
    if (!formData.hasCertificate) newErrors.hasCertificate = "กรุณาเลือกว่ามีใบรับรองหรือไม่";
    if (formData.hasCertificate === "มี" && !formData.imageUrl) newErrors.imageUrl = "กรุณาอัปโหลดรูปใบรับรอง";

    if (!formData.UsersId) newErrors.UsersId = "กรุณากรอกรหัสเกษตร";

    // If there are errors, update state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("type", formData.type);
    formDataToSend.append("variety", formData.variety);
    formDataToSend.append("plotCode", formData.plotCode);
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("productionQuantity", formData.productionQuantity);
    formDataToSend.append("hasCertificate", formData.hasCertificate);
    if (formData.imageUrl) {
      formDataToSend.append("imageUrl", formData.imageUrl);
    }
    formDataToSend.append("UsersId", formData.UsersId);

    if (formData.hasCertificate === "มี" && formData.imageUrl) {
      formDataToSend.append("imageUrl", formData.imageUrl);
    }
    formDataToSend.append("hasCertificate", formData.hasCertificate);
    try {
      const response = await fetch("/api/certificate/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add certificate");
      }

      toast.success("เพิ่มใบรับรองสำเร็จ");
      router.push("/dashboard/certificate");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "เพิ่มใบรับรองไม่สำเร็จ");
    }
  };

  return (
    <div className="container">
      <main className="mainContent">
        <h1 className="text-3xl font-bold mb-10">เพิ่มใบรับรอง</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-container">
            <input
              name="type"
              type="text"
              placeholder="ชนิด"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.type && <p className="error">{errors.type}</p>}

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

            <input
              name="productionQuantity"
              type="text"
              placeholder="จำนวนผลผลิต (กิโลกรัม)"
              value={formData.productionQuantity}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.productionQuantity && <p className="error">{errors.productionQuantity}</p>}

            <select
              name="hasCertificate"
              value={formData.hasCertificate}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">มีใบรับรองหรือไม่</option>
              <option value="มี">มี</option>
              <option value="ไม่มี">ไม่มี</option>
            </select>
            {errors.hasCertificate && <p className="error">{errors.hasCertificate}</p>}

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

            <input
              name="UsersId"
              type="number"
              placeholder="รหัสเกษตร"
              value={formData.UsersId}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.UsersId && <p className="error">{errors.UsersId}</p>}
          </div>

          <div className="button-group">
            <button type="submit" className="button-submit">เพิ่มใบรับรอง</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
