"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/app/dashboard/certificate/add/add.css";

const ApproveCertificatePage = ({ params }) => {
  const [formData, setFormData] = useState({
    type: "",
    variety: "",
    plotCode: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    hasCertificate: "",
    imageUrl: null,
    farmerId: "",
    registrationDate: "",
    expiryDate: "",
    status: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/approvecertificate/?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            type: data.type || "",
            variety: data.variety || "",
            plotCode: data.plotCode || "",
            latitude: data.latitude || "",
            longitude: data.longitude || "",
            productionQuantity: data.productionQuantity || "",
            hasCertificate: data.hasCertificate || "",
            imageUrl: data.imageUrl || null,
            farmerId: data.farmer?.id || "",
            registrationDate: new Date(data.registrationDate).toISOString().split("T")[0],
            expiryDate: new Date(data.expiryDate).toISOString().split("T")[0],
            status: data.status || "",
          });
          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
        } else {
          alert("Failed to fetch certificate");
        }
      } catch (error) {
        console.error("Failed to fetch certificate:", error);
      }
    };

    fetchCertificate();
  }, [id]);

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

  const handleSubmit = async (action) => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "กรุณากรอกชนิด";
    if (!formData.variety) newErrors.variety = "กรุณากรอกสายพันธุ์";
    if (!formData.plotCode) newErrors.plotCode = "กรุณากรอกรหัสแปลงปลูก";
    if (!formData.latitude) newErrors.latitude = "กรุณากรอกพิกัดแกน X (ละติจูด)";
    if (!formData.longitude) newErrors.longitude = "กรุณากรอกพิกัดแกน Y (ลองจิจูด)";
    if (!formData.productionQuantity) newErrors.productionQuantity = "กรุณากรอกจำนวนผลผลิต";
    if (!formData.hasCertificate) newErrors.hasCertificate = "กรุณาเลือกว่ามีใบรับรองหรือไม่";
    if (formData.hasCertificate === "มี" && !formData.imageUrl) newErrors.imageUrl = "กรุณาอัปโหลดรูปใบรับรอง";
    if (!formData.farmerId) newErrors.farmerId = "กรุณากรอกรหัสเกษตร";
    if (!formData.registrationDate) newErrors.registrationDate = "กรุณากรอกวันจดทะเบียน";
    if (!formData.expiryDate) newErrors.expiryDate = "กรุณากรอกวันหมดอายุ";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id", id);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("variety", formData.variety);
    formDataToSend.append("plotCode", formData.plotCode);
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("productionQuantity", formData.productionQuantity);
    formDataToSend.append("hasCertificate", formData.hasCertificate);
    formDataToSend.append("farmerId", formData.farmerId);
    formDataToSend.append("registrationDate", formData.registrationDate);
    formDataToSend.append("expiryDate", formData.expiryDate);
    formDataToSend.append("status", action);
    if (formData.imageUrl instanceof File) {
      formDataToSend.append("imageUrl", formData.imageUrl);
    }

    try {
      const response = await fetch("/api/approvecertificate", {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update certificate");
      }

      alert(`Certificate ${action === "อนุมัติ" ? "approved" : "rejected"} successfully`);
      router.push("/dashboard_municipality/certificate");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to update certificate");
    }
  };

  return (
    <div className="container">
      <main className="mainContent">
        <h1 className="title-name">เเก้ไขใบรับรอง</h1>
        <p className="subtitle-name">ข้อมูลผลิต</p>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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

            <p className="section-name">ใบรับรอง</p>
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

            {errors.farmerId && <p className="error">{errors.farmerId}</p>}
          </div>

          <div className="button-group">
            <button
              type="button"
              className="button-submit"
              onClick={() => handleSubmit("อนุมัติ")}
            >
              อนุมัติใบรับรอง
            </button>
            <button
              type="button"
              className="button-submit"
              onClick={() => handleSubmit("ไม่อนุมัติ")}
            >
              ไม่อนุมัติใบรับรอง
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ApproveCertificatePage;