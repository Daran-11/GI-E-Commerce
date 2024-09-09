"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "@/app/dashboard/certificate/add/add.css";

// Fix for the missing marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ApproveCertificatePage = ({ params }) => {
  const [formData, setFormData] = useState({
    type: "",
    variety: "",
    plotCode: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    hasGAP: false,
    hasGI: false,
    hasCertificate: false, // Now a boolean based on the checkbox
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
            hasGAP: data.hasGAP || false,
            hasGI: data.hasGI || false,
            hasCertificate: data.hasCertificate || false,
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (formData.hasCertificate && !formData.imageUrl) newErrors.imageUrl = "กรุณาอัปโหลดรูปใบรับรอง";
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
    formDataToSend.append("hasGAP", formData.hasGAP);
    formDataToSend.append("hasGI", formData.hasGI);
    formDataToSend.append("hasCertificate", formData.hasCertificate);
    formDataToSend.append("farmerId", formData.farmerId);
    formDataToSend.append("registrationDate", formData.registrationDate);
    formDataToSend.append("expiryDate", formData.expiryDate);
    formDataToSend.append("status", action);
    if (formData.hasCertificate && formData.imageUrl instanceof File) {
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

   const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]}></Marker>
    ) : null;
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("ไม่สามารถดึงตำแหน่งปัจจุบันได้");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="container">
      <main className="mainContent">
        <h1 className="title-name">เเก้ไขใบรับรอง</h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="form-container">
            <p className="section-name">ชนิด</p>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="formInput"
              disabled
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
              disabled
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
              disabled
              required
            />
            {errors.plotCode && <p className="error">{errors.plotCode}</p>}

            <p className="section-name">พิกัด</p>
            <MapContainer
              center={[13.736717, 100.523186]} // Default location
              zoom={6}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>
            <p>พิกัดที่เลือก: ละติจูด {formData.latitude}, ลองจิจูด {formData.longitude}</p>

            <button type="button" className="button-location" onClick={getCurrentLocation}>
              ตำแหน่งปัจจุบัน
            </button>

            <p className="section-name">จำนวนผลผลิต (กิโลกรัม)</p>
            <input
              name="productionQuantity"
              type="text"
              placeholder="จำนวนผลผลิต (กิโลกรัม)"
              value={formData.productionQuantity}
              onChange={handleChange}
              className="form-input"
              disabled
              required
            />
            {errors.productionQuantity && (
              <p className="error">{errors.productionQuantity}</p>
            )}

            <p className="section-name">ใบรับรอง</p>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  name="hasGAP"
                  checked={formData.hasGAP}
                  onChange={handleChange}
                  disabled
                />{" "}
                GAP
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hasGI"
                  checked={formData.hasGI}
                  onChange={handleChange}
                  disabled
                />{" "}
                GI
              </label>
            </div>
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
