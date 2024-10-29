"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";
import "@/app/dashboard/certificate/add/add.css";

// Fix for the missing marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Edit page component
const EditCertificatePage = ({ params }) => {
  // Initialize form state
  const [formData, setFormData] = useState({
    type: "",
    variety: "",
    plotCode: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    standards: [],
    UsersId: "",
    status: "",
  });

  const [standards, setStandards] = useState([]);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = params;

  // Fetch data on component mount
  useEffect(() => {
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

    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificate/add?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          
          // Transform the standards data to include certificate details
          const certificateStandards = Array.isArray(data.standards) 
            ? data.standards.map(standard => ({
                id: standard.id,
                name: standard.name,
                logo: standard.logoUrl,
                certNumber: standard.certNumber || "",
                certDate: standard.certDate ? new Date(standard.certDate).toISOString().split('T')[0] : "",
              }))
            : [];

          setFormData({
            type: data.type || "",
            variety: data.variety || "",
            plotCode: data.plotCode || "",
            latitude: data.latitude || "",
            longitude: data.longitude || "",
            productionQuantity: data.productionQuantity || "",
            standards: certificateStandards,
            UsersId: data.Users?.id || "",
            status: data.status || "",
          });
        } else {
          alert("Failed to fetch certificate");
        }
      } catch (error) {
        console.error("Failed to fetch certificate:", error);
      }
    };

    fetchStandards();
    fetchCertificate();
  }, [id]);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Standards change handler
  const handleStandardChange = (standard, checked) => {
    setFormData((prev) => {
      const currentStandards = Array.isArray(prev.standards) ? prev.standards : [];
      const updatedStandards = checked
        ? [...currentStandards, {
            id: standard.id,
            name: standard.name,
            logo: standard.logoUrl,
            certNumber: "",
            certDate: ""
          }]
        : currentStandards.filter((s) => s.id !== standard.id);
      return { ...prev, standards: updatedStandards };
    });
  };

  // Standard details change handler
  const handleStandardDetailChange = (standardId, field, value) => {
    setFormData((prev) => {
      const currentStandards = Array.isArray(prev.standards) ? prev.standards : [];
      const updatedStandards = currentStandards.map((s) =>
        s.id === standardId ? { ...s, [field]: value } : s
      );
      return { ...prev, standards: updatedStandards };
    });
  };

  // Map marker component
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

  // Get current location handler
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

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.type) newErrors.type = "กรุณากรอกชนิด";
    if (!formData.variety) newErrors.variety = "กรุณากรอกสายพันธุ์";
    if (!formData.plotCode) newErrors.plotCode = "กรุณากรอกรหัสแปลงปลูก";
    if (!formData.latitude || !formData.longitude) newErrors.location = "กรุณาเลือกพิกัด";
    if (!formData.productionQuantity) newErrors.productionQuantity = "กรุณากรอกจำนวนผลผลิต";
    if (!Array.isArray(formData.standards) || formData.standards.length === 0) {
      newErrors.standards = "กรุณาเลือกมาตรฐาน";
    }

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
    formDataToSend.append("UsersId", formData.UsersId);
    formDataToSend.append("status", formData.status);

    // Append standards data
    const standardsArray = Array.isArray(formData.standards) ? formData.standards : [];
    standardsArray.forEach((standard, index) => {
      formDataToSend.append(`standards[${index}][id]`, standard.id);
      formDataToSend.append(`standards[${index}][name]`, standard.name);
      formDataToSend.append(`standards[${index}][logo]`, standard.logo);
      formDataToSend.append(`standards[${index}][certNumber]`, standard.certNumber);
      formDataToSend.append(`standards[${index}][certDate]`, standard.certDate);
    });

    try {
      const response = await fetch("/api/certificate/add", {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update certificate");
      }

      alert("แก้ไขใบรับรองสำเร็จ");
      router.push("/dashboard/certificate");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to update certificate");
    }
  };

  // Component render
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
  {standards.map((standard) => {
    const currentStandard = formData.standards.find((s) => s.id === standard.id);
    return (
      <div
        key={standard.id}
        className={`standard-item-container ${
          currentStandard ? "selected" : ""
        }`}
      >
        <div className={'standard-item-container1'}>
          <label>
            <input
              type="checkbox"
              checked={!!currentStandard} // เช็คว่า selected หรือไม่
              onChange={(e) => handleStandardChange(standard, e.target.checked)}
            />
            <span className="standard-logo">
              <Image
                src={standard.logoUrl}
                alt={standard.name}
                width={80}
                height={80}
              />
            </span>
          </label>
        </div>
        <span className="standard-name">{standard.name}</span>

        <div className="standard-details">
          <input
            type="text"
            className="form-input1"
            placeholder="เลขที่ใบรับรอง"
            value={currentStandard ? currentStandard.certNumber : ""} // แสดงค่าเลขที่ใบรับรอง
            required={!!currentStandard} // ถ้ามีการเลือกต้องกรอก
            onChange={(e) =>
              handleStandardDetailChange(standard.id, "certNumber", e.target.value)
            }
          />
          <br />
          <input
            type="date"
            className="form-input1"
            placeholder="วันที่ใบรับรอง"
            value={currentStandard ? currentStandard.certDate : ""} // แสดงค่าวันที่ใบรับรอง
            required={!!currentStandard} // ถ้ามีการเลือกต้องกรอก
            onChange={(e) =>
              handleStandardDetailChange(standard.id, "certDate", e.target.value)
            }
          />
        </div>
      </div>
    );
  })}
</div>


          </div>

        <div className="button-group">
            <button type="submit" className="button-submit">
              แก้ไขใบรับรอง
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditCertificatePage;   