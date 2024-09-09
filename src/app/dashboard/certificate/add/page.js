"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./add.css";

// Fix for the missing marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Register = () => {
  const [formData, setFormData] = useState({
    type: "",
    variety: "",
    plotCode: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    hasGAP: false,
    hasGI: false,
  });

  const [errors, setErrors] = useState({});
  const [farmerId, setFarmerId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedFarmerId = localStorage.getItem('farmerId');
    if (storedFarmerId) {
      setFarmerId(storedFarmerId);
    } else {
      console.error("Farmer ID not found in localStorage");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

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
                />{" "}
                GAP
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hasGI"
                  checked={formData.hasGI}
                  onChange={handleChange}
                />{" "}
                GI
              </label>
            </div>
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
