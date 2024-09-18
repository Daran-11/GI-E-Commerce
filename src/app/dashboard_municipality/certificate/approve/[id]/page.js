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
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
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
    standards: [],
    municipalComment: "",
  });
  const [showCommentField, setShowCommentField] = useState(false);
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
            standards: JSON.parse(data.standards) || [],
            farmerId: data.farmer?.id || "",
            registrationDate: new Date(data.registrationDate)
              .toISOString()
              .split("T")[0],
            expiryDate: new Date(data.expiryDate).toISOString().split("T")[0],
            status: data.status || "",
            municipalComment: "",
          });
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (action) => {
    const newErrors = {};
    if (action === "ไม่อนุมัติ" && !formData.municipalComment) {
      newErrors.municipalComment =
        "กรุณากรอกความคิดเห็นเมื่อไม่อนุมัติใบรับรอง";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id", id);
    formDataToSend.append("action", action);
    formDataToSend.append("municipalComment", formData.municipalComment);

    try {
      const response = await fetch("/api/approvecertificate", {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ไม่สามารถอัพเดตใบรับรอง");
      }
      const result = await response.json();
      console.log("Response from server:", result);

      alert(
        `ใบรับรอง${
          action === "อนุมัติ" ? "ได้รับการอนุมัติ" : "ถูกปฏิเสธ"
        }เรียบร้อยแล้ว`
      );
      router.push("/dashboard_municipality/certificate");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "ไม่สามารถอัพเดตใบรับรอง");
    }
  };

  const handleReject = () => {
    setShowCommentField(true);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      load() {
        map.setView([formData.latitude, formData.longitude], 13);
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]}></Marker>
    ) : null;
  };

  return (
    <div className="container">
      <main className="mainContent">
        <h1 className="title-name">อนุมัติใบรับรอง</h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="form-container">
            <p className="section-name">ชนิด</p>
            <input
              name="type"
              type="text"
              value={formData.type}
              className="form-input"
              disabled
            />

            <p className="section-name">สายพันธุ์</p>
            <input
              name="variety"
              type="text"
              value={formData.variety}
              className="form-input"
              disabled
            />

            <p className="section-name">รหัสแปลงปลูก</p>
            <input
              name="plotCode"
              type="text"
              value={formData.plotCode}
              className="form-input"
              disabled
            />

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
              พิกัด: ละติจูด {formData.latitude}, ลองจิจูด {formData.longitude}
            </p>

            <p className="section-name">จำนวนผลผลิต (กิโลกรัม)</p>
            <input
              name="productionQuantity"
              type="text"
              value={formData.productionQuantity}
              className="form-input"
              disabled
            />

            <p className="section-name">มาตรฐาน</p>
            <div className="standards-container">
              {formData.standards.map((standard, index) => (
                <div key={index} className="standard-item">
                  <div key={standard.id} className="standard-item-container">
                    <span className="title-standard">{standard.name}</span>
                    <div className="standard-image">
                      {standard.certImageUrl && (
                        <Image
                          src={standard.certImageUrl}
                          alt="Certificate"
                          layout="responsive" // หรือ "fill" ตามความเหมาะสม
                          width={600} // กำหนดขนาดที่ต้องการ
                          height={400} // กำหนดขนาดที่ต้องการ
                          className="cert-image"
                          quality={100} // กำหนดคุณภาพของรูปภาพ
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showCommentField && (
            <div className="form-container">
              <p className="section-name">ความคิดเห็น (เหตุผลที่ไม่อนุมัติ)</p>
              <textarea
                name="municipalComment"
                value={formData.municipalComment}
                onChange={handleChange}
                className="form-input"
                rows="4"
                required
              />
              {errors.municipalComment && (
                <p className="error">{errors.municipalComment}</p>
              )}
            </div>
          )}

<div className="button-group">
  <button
    type="button"
    className="button-submitt"
    onClick={() => handleSubmit("อนุมัติ")}
  >
    อนุมัติใบรับรอง
  </button>
  <button
    type="button"
    className="button-submittt"
    onClick={handleReject}
  >
    ไม่อนุมัติใบรับรอง
  </button>
</div>


          {showCommentField && (
            <button
              type="button"
              className="button-submittt"
              onClick={() => handleSubmit("ไม่อนุมัติ")}
            >
              ยืนยันการไม่อนุมัติ
            </button>
          )}
        </form>
      </main>
    </div>
  );
};

export default ApproveCertificatePage;
