"use client";
import "@/app/dashboard/certificate/add/add.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

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
    latitude: "",
    longitude: "",
    productionQuantity: "",
    standards: [],
    municipalComment: "",
  });
  const [UsersData, setUsersData] = useState(null);
  const [UsersCertificates, setUsersCertificates] = useState([]);
  const [showCommentField, setShowCommentField] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [errors, setErrors] = useState({});
  const [matchFound, setMatchFound] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/approvecertificate/?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Certificate data:", data);
  
          if (data.Users) {
            setFormData({
              type: data.type || "",
              variety: data.variety || "",
              latitude: data.latitude || "",
              longitude: data.longitude || "",
              productionQuantity: data.productionQuantity || "",
              standards: JSON.parse(data.standards) || [],
              registrationDate: data.registrationDate? new Date(data.registrationDate).toLocaleDateString('th-TH'): "",
              expiryDate: data.expiryDate? new Date(data.expiryDate).toLocaleDateString('th-TH'): "",
              status: data.status || "",
              municipalComment: "",
              farmerName: data.Users.farmerName || "" ,
              address:data.Users.address || "",
              phone:data.Users.phone || "",
              contactLine:data.Users.contactLine || ""
            });

            // เรียกใช้ fetchUsersData โดยส่งชื่อเกษตรกร
            await fetchUsersData(data.Users.farmerName);
          }
        } else {
          throw new Error("Failed to fetch certificate");
        }
      } catch (error) {
        console.error("Failed to fetch certificate:", error);
        alert("ไม่สามารถดึงข้อมูลใบรับรองได้");
      }
    };
  
    fetchCertificate();
  }, [id]);
  
  const fetchUsersData = async (name) => {
    try {
      // แสดง log เพื่อตรวจสอบค่าที่ได้รับ
      console.log("Searching for farmer with name:", name);
  
      const response = await fetch(`/api/manage_farmer`);
      if (!response.ok) {
        throw new Error('Failed to fetch farmers data');
      }
  
      const farmers = await response.json();
      console.log("All farmers:", farmers);
  
      // ค้นหาเกษตรกรที่มีชื่อตรงกัน
      const matchedFarmer = farmers.find(
        (farmer) => farmer.farmerNameApprove.toLowerCase() === name.toLowerCase()
      );
  
      console.log("Matched farmer:", matchedFarmer);
  
      if (matchedFarmer) {
        setUsersData(matchedFarmer);
        setMatchFound(true);
  
        // ดึงข้อมูลใบรับรอง
        const certsResponse = await fetch(
          `/api/farmer_certificates/${matchedFarmer.id}`
        );
        if (certsResponse.ok) {
          const certsData = await certsResponse.json();
          setUsersCertificates(certsData);
        } else {
          console.error("Failed to fetch certificates");
        }
      } else {
        setMatchFound(false);
        setUsersData(null);
        setUsersCertificates([]);
      }
    } catch (error) {
      console.error("Failed to fetch farmer data:", error);
      setMatchFound(false);
      setUsersData(null);
      setUsersCertificates([]);
    }
  };

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
      router.push("/municipality-dashboard/certificate");
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - Original Form */}
      <div className="w-1/2 p-6">
        <div className="bg-white rounded-lg shadow p-6">
        <h2 className="mb-6" style={{ fontSize: '1.5rem' }}>ข้อมูลเกษตรกร</h2>
          {matchFound ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium">
                    {formData.farmerName} {/* ใช้ชื่อจาก formData แทน */}
                  </h3>
                  {UsersData && (
                    <div className="text-sm text-gray-600">
                      <p>ที่อยู่: {formData.address}</p>
                      <p>เบอร์โทร: {formData.phone}</p>
                      <p>Line ID: {formData.contactLine}</p>
                    </div>
                  )}
              </div>
                <button
                  onClick={() => setShowCertificates(!showCertificates)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <span>{showCertificates ? "ซ่อนข้อมูล" : "ดูเพิ่มเติม"}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      showCertificates ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {showCertificates && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-4">ใบรับรองทั้งหมด</h3>
                  {UsersCertificates.length > 0 ? (
                    UsersCertificates.map((cert, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              ประเภท
                            </p>
                            <p className="font-medium">{cert.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              สายพันธุ์
                            </p>
                            <p className="font-medium">{cert.variety}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              มาตรฐาน
                            </p>
                            <p className="font-medium">{cert.standardName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              เลขที่ใบรับรอง
                            </p>
                            <p className="font-medium">
                              {cert.certificateNumber}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm text-gray-600">
                            วันที่อนุมัติ:{" "}
                            {new Date(cert.approvalDate).toLocaleDateString(
                              "th-TH"
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">ไม่พบใบรับรอง</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 text-lg">
              ไม่พบรายชื่อเกษตรกร: {formData.farmerName}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                กรุณาตรวจสอบข้อมูลเกษตรกรอีกครั้ง
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Right Side - Users Details */}
      <div className="w-1/2 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl mb-6">ตรวจสอบใบรับรอง</h1>
          <div className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                value={`${formData.farmerName}`}
                className="w-full p-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">ชนิด</label>
              <input
                type="text"
                value={formData.type}
                className="w-full p-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">
                สายพันธุ์
              </label>
              <input
                type="text"
                value={formData.variety}
                className="w-full p-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">พิกัด</label>
              <div className="h-96 w-full rounded-lg overflow-hidden mb-2">
                <MapContainer
                  center={[20.046061226911785, 99.890654]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                   className="map-container "
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-600">
                พิกัด: ละติจูด {formData.latitude}, ลองจิจูด{" "}
                {formData.longitude}
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">
                จำนวนผลผลิต (กิโลกรัม)
              </label>
              <input
                type="text"
                value={formData.productionQuantity}
                className="w-full p-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">มาตรฐาน</label>
              <div className="grid grid-cols-2 gap-4">
                {formData.standards && formData.standards.length > 0 ? (
                  formData.standards.map((standard, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-2">
                          <Image
                            src={standard.logo}
                            alt={standard.name}
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="font-medium text-center">
                          {standard.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          เลขที่: {standard.certNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          วันที่: {standard.certDate}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    ไม่พบข้อมูลมาตรฐาน
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
              >
                ไม่อนุมัติใบรับรอง
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("อนุมัติ")}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                อนุมัติใบรับรอง
              </button>
              
            </div>

            {/* Display comment field conditionally */}
            {showCommentField && (
              <div className="fixed inset-0 z-40  flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-1/3">
                  <label className="block text-sm font-medium mb-2">
                    ความคิดเห็น (เหตุผลที่ไม่อนุมัติ)
                  </label>
                  <textarea
                    name="municipalComment"
                    value={formData.municipalComment}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    rows="4"
                    required
                  />
                  {errors.municipalComment && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.municipalComment}
                    </p>
                  )}
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowCommentField(false)}
                      className="ml-2 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit("ไม่อนุมัติ")}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                    >
                      ยืนยันการไม่อนุมัติ
                    </button>
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ApproveCertificatePage;
