"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "./add.css";

// Import marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src
});

// Loading Component
const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center min-w-[300px]">
        <div className="w-16 h-16 border-4 border-t-[#98de6d] border-r-[#98de6d] border-b-[#e2e8f0] border-l-[#e2e8f0] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#333] text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  );
};

// Map Marker Component
const LocationMarker = ({ formData, setFormData }) => {
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
    <Marker position={[formData.latitude, formData.longitude]} />
  ) : null;
};

const Register = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "",
    variety: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    standards: [],
  });
  const [standards, setStandards] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch standards on component mount
  useEffect(() => {
    const fetchStandards = async () => {
      if (status === 'authenticated' && session?.user?.role === 'farmer') {
        try {
          const response = await fetch("/api/standards");
          if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลมาตรฐานได้");
          }
          const data = await response.json();
          setStandards(data);
        } catch (error) {
          console.error("Error fetching standards:", error);
          alert("ไม่สามารถโหลดข้อมูลมาตรฐาน กรุณาลองใหม่อีกครั้ง");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStandards();
  }, [status, session?.user?.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStandardChange = (standard, checked) => {
    setFormData((prev) => {
      const updatedStandards = checked
        ? [...prev.standards, {
            id: standard.id,
            name: standard.name,
            logo: standard.logoUrl,
            certNumber: "",
            certDate: "",
          }]
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("ไม่สามารถดึงตำแหน่งปัจจุบันได้");
        setIsLoading(false);
      }
    );
  };

  const validateForm = () => {
    if (!formData.type || !formData.variety || !formData.productionQuantity) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    if (!formData.latitude || !formData.longitude) {
      alert("กรุณาเลือกพิกัดแปลง");
      return false;
    }

    if (formData.standards.length === 0) {
      alert("กรุณาเลือกมาตรฐานอย่างน้อย 1 รายการ");
      return false;
    }

    for (const standard of formData.standards) {
      if (!standard.certNumber || !standard.certDate) {
        alert("กรุณากรอกข้อมูลมาตรฐานให้ครบถ้วน");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (window.confirm("คุณต้องการขอใบรับรองใช่หรือไม่?")) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();
        
        // Append basic form data
        Object.keys(formData).forEach(key => {
          if (key !== "standards") {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Append standards data
        formData.standards.forEach((standard, index) => {
          formDataToSend.append(`standards[${index}][id]`, standard.id);
          formDataToSend.append(`standards[${index}][name]`, standard.name);
          formDataToSend.append(`standards[${index}][logo]`, standard.logo);
          formDataToSend.append(`standards[${index}][certNumber]`, standard.certNumber);
          formDataToSend.append(`standards[${index}][certDate]`, standard.certDate);
        });

        // Add user ID
        if (session?.user?.id) {
          formDataToSend.append("userId", session.user.id);
        } else {
          throw new Error("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        }

        const response = await fetch("/api/certificate/add", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error("ไม่สามารถเพิ่มใบรับรองได้");
        }

        alert("เพิ่มใบรับรองเรียบร้อย");
        router.push("/dashboard/certificate");
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Check authentication
  if (status === 'loading' || isLoading) {
    return <Loading />;
  }

  if (!session || session?.user?.role !== 'farmer') {
    return (
      <div className="container">
        <main className="mainContent">
          <h1 className="title-name text-red-600">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="mainContent">
        <h1 className="title-name">ขอใบรับรอง</h1>
        <p className="subtitle-name">ข้อมูลผลิต</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-container">
            {/* ส่วนของข้อมูลพื้นฐาน */}
            <p className="section-name">ชนิด</p>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="formInput"
              required
            >
              <option value="" disabled hidden>-</option>
              <option value="สับปะรด">สับปะรด</option>
            </select>

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

            {/* ส่วนของแผนที่ */}
            <p className="section-name">พิกัด</p>
            <MapContainer
              center={[20.046061226911785, 99.890654]}
              zoom={15}
              style={{ height: "400px", width: "100%" }}
              className="map-container"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker formData={formData} setFormData={setFormData} />
            </MapContainer>

            {formData.latitude && formData.longitude && (
              <p className="mt-2 text-sm text-gray-600">
                พิกัดที่เลือก: ละติจูด {formData.latitude.toFixed(6)}, 
                ลองจิจูด {formData.longitude.toFixed(6)}
              </p>
            )}

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
              min="0"
            />

            {/* ส่วนของมาตรฐาน */}
            <p className="section-name">มาตรฐาน</p>
            <div className="standards-container">
              {standards.map((standard) => {
                const isSelected = formData.standards.some(s => s.id === standard.id);
                const currentStandard = formData.standards.find(s => s.id === standard.id);
                
                return (
                  <div key={standard.id} className={`standard-item-container ${isSelected ? "selected" : ""}`}>
                    <div className="standard-item-container1">
                      <label>
                        <input
                          type="checkbox"
                          checked={isSelected}
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
                    {isSelected && (
                      <>
                        <input
                          type="text"
                          className="form-input1"
                          placeholder="เลขที่ใบรับรอง"
                          value={currentStandard?.certNumber || ""}
                          onChange={(e) => handleStandardDetailChange(standard.id, "certNumber", e.target.value)}
                          required
                        />
                        <input
                          type="date"
                          className="form-input1"
                          placeholder="วันที่ใบรับรอง"
                          value={currentStandard?.certDate || ""}
                          onChange={(e) => handleStandardDetailChange(standard.id, "certDate", e.target.value)}
                          required
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="button-submit">
              ขอใบรับรอง
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;