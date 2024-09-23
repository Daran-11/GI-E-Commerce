"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";
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
    latitude: "",
    longitude: "",
    productionQuantity: "",
    standards: [],
  });

  const [standards, setStandards] = useState([]);
  const [errors, setErrors] = useState({});
  const [farmerId, setFarmerId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedFarmerId = localStorage.getItem("farmerId");
    if (storedFarmerId) {
      setFarmerId(storedFarmerId);
    } else {
      console.error("Farmer ID not found in localStorage");
    }

    // Fetch standards
    const fetchStandards = async () => {
      try {
        const response = await fetch("/api/standards");
        if (response.ok) {
          const data = await response.json();
          setStandards(data);
        } else {
          throw new Error("Failed to fetch standards");
        }
      } catch (error) {
        console.error("Error fetching standards:", error);
      }
    };

    fetchStandards();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStandardChange = (standard, checked) => {
    setFormData((prev) => {
      const updatedStandards = checked
        ? [
            ...prev.standards,
            {
              id: standard.id,
              name: standard.name,
              logo: standard.logoUrl,
              certNumber: "",
              certDate: "",
            },
          ]
        : prev.standards.filter((s) => s.id !== standard.id);
      return { ...prev, standards: updatedStandards };
    });
  };

  const handleStandardDetailChange = (standardId, field, value) => {
    setFormData((prev) => {
      const updatedStandards = prev.standards.map((s) =>
        s.id === standardId ? { ...s, [field]: value } : s
      );
      return { ...prev, standards: updatedStandards };
    });
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
      if (key !== "standards") {
        formDataToSend.append(key, formData[key]);
      }
    }

    formData.standards.forEach((standard, index) => {
      formDataToSend.append(`standards[${index}][id]`, standard.id);
      formDataToSend.append(`standards[${index}][name]`, standard.name);
      formDataToSend.append(`standards[${index}][logo]`, standard.logo);
      formDataToSend.append(`standards[${index}][certNumber]`, standard.certNumber);
      formDataToSend.append(`standards[${index}][certDate]`, standard.certDate);
    });

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

            <p className="section-name">พิกัด</p>
            <MapContainer
              center={[20.046061226911785, 99.890654]} // Default location
              zoom={15}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
            <p>
              พิกัดที่เลือก: ละติจูด {formData.latitude}, ลองจิจูด{" "}
              {formData.longitude}
            </p>

            <button
              type="button"
              className="button-location"
              onClick={getCurrentLocation}
            >
              ตำแหน่งปัจจุบัน
            </button>

            <p className="section-name">จำนวนผลผลิต (กิโลกรัม)</p>
            <input
              name="productionQuantity"
              type="number"
              placeholder="จำนวนผลผลิต (กิโลกรัม)"
              value={formData.productionQuantity}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.productionQuantity && (
              <p className="error">{errors.productionQuantity}</p>
            )}

            <p className="section-name">มาตรฐาน</p>
            <div className="standards-container">
              {standards.map((standard) => (
                <div key={standard.id} className="standard-item">
                  <div key={standard.id} className="standard-item-container">
                    <label>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleStandardChange(standard, e.target.checked)
                        }
                      />
                      <div className="standard-item">
                        <Image
                          src={standard.logoUrl}
                          alt={standard.name}
                          width={80}
                          height={80}
                          className="standard-logo"
                        />
                        <span className="standard-name">{standard.name}</span>
                      </div>
                    </label>
                  </div>

                  {formData.standards.some((s) => s.id === standard.id) && (
                    <div className="standard-details">
                      <input
                        type="text"
                        placeholder="เลขที่ใบรับรอง"
                        onChange={(e) =>
                          handleStandardDetailChange(standard.id, "certNumber", e.target.value)
                        }
                        required
                      />
                      <input
                        type="date"
                        placeholder="วันที่ใบรับรอง"
                        onChange={(e) =>
                          handleStandardDetailChange(standard.id, "certDate", e.target.value)
                        }
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
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