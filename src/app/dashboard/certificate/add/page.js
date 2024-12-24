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
import { useMap } from 'react-leaflet';

// Fix for Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

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

const LocationMarker = ({ formData, setFormData }) => {
  const map = useMap();

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

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      map.setView([formData.latitude, formData.longitude], map.getZoom());
    }
  }, [formData.latitude, formData.longitude, map]);

  return formData.latitude && formData.longitude ? (
    <Marker position={[formData.latitude, formData.longitude]} />
  ) : null;
};

const Register = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [standards, setStandards] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    variety: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    standards: [],
  });

  const [standardsInfo, setStandardsInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session?.user?.role === "farmer") {
        try {
          setIsLoading(true);
          const [typesRes, standardsRes] = await Promise.all([
            fetch("/api/manage_type"),
            fetch("/api/standards"),
          ]);

          if (!typesRes.ok || !standardsRes.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลได้");
          }

          const [typesData, standardsData] = await Promise.all([
            typesRes.json(),
            standardsRes.json(),
          ]);

          setTypes(typesData);
          setStandards(standardsData);

          const infoMap = {};
          standardsData.forEach(standard => {
            infoMap[standard.id] = standard.certificationInfo || "เลขที่ใบรับรอง";
          });
          setStandardsInfo(infoMap);
        } catch (error) {
          console.error("Error fetching data:", error);
          alert("ไม่สามารถโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [status, session?.user?.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      const selected = types.find((t) => t.type === value);
      setSelectedType(selected);
      setFormData((prev) => ({
        ...prev,
        type: value,
        variety: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/certificate");
  };

  const handleStandardChange = (standard, checked) => {
    setFormData((prev) => ({
      ...prev,
      standards: checked
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
        : prev.standards.filter((s) => s.id !== standard.id),
    }));
  };

  const handleStandardDetailChange = (standardId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      standards: prev.standards.map((s) =>
        s.id === standardId ? { ...s, [field]: value } : s
      ),
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!confirm("คุณต้องการขอใบรับรองใช่หรือไม่?")) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/certificate/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ไม่สามารถเพิ่มใบรับรองได้");
      }

      alert("เพิ่มใบรับรองเรียบร้อย");
      router.push("/dashboard/certificate");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
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

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (!session || session?.user?.role !== "farmer") {
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
        <h1 className="text-2xl">เพิ่มใบรับรอง</h1>
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
              {types.map((type) => (
                <option key={type.id} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>

            <p className="section-name">สายพันธุ์</p>
            <select
              name="variety"
              value={formData.variety}
              onChange={handleChange}
              className="formInput"
              required
              disabled={!selectedType}
            >
              <option value="" disabled hidden>
                เลือกสายพันธุ์
              </option>
              {selectedType?.varieties.map((variety) => (
                <option key={variety.id} value={variety.name}>
                  {variety.name}
                </option>
              ))}
            </select>

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
                พิกัดที่เลือก: ละติจูด {formData.latitude.toFixed(6)}, ลองจิจูด{" "}
                {formData.longitude.toFixed(6)}
              </p>
            )}

            <button
              type="button"
              className="button-location"
              onClick={getCurrentLocation}
            >
              ตำแหน่งปัจจุบัน
            </button>

            <p className="section-name">จำนวนผลผลิต ต่อปี(กิโลกรัม)</p>
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

            <p className="section-name">มาตรฐาน</p>
            <div className="standards-container">
              {standards.map((standard) => {
                const isSelected = formData.standards.some(
                  (s) => s.id === standard.id
                );
                const currentStandard = formData.standards.find(
                  (s) => s.id === standard.id
                );

                return (
                  <div
                    key={standard.id}
                    className={`standard-item-container ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <div className="standard-info">
                      <div className="standard-header">
                        <div className="standard-item-container1">
                          <label>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) =>
                                handleStandardChange(standard, e.target.checked)
                              }
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
                      </div>
                      
                      <div className="standard-details">
                        <div className="form-group">
                          <label className="form-label">
                            {standardsInfo[standard.id]}
                          </label>
                          <input
                            type="text"
                            className="form-input1"
                            value={currentStandard?.certNumber || ""}
                            onChange={(e) =>
                              handleStandardDetailChange(
                                standard.id,
                                "certNumber",
                                e.target.value
                              )
                            }
                            disabled={!isSelected}
                            required={isSelected}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">วันที่ใบรับรอง</label>
                          <input
                            type="date"
                            className="form-input1"
                            value={currentStandard?.certDate || ""}
                            onChange={(e) =>
                              handleStandardDetailChange(
                                standard.id,
                                "certDate",
                                e.target.value
                              )
                            }
                            disabled={!isSelected}
                            required={isSelected}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="button-group">
            <button 
              type="button" 
              onClick={handleCancel}
              className="button-cancel"
            >
              ยกเลิก
            </button>
            <button type="submit" className="button-submit">
              ลงทะเบียน
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;