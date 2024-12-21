"use client";
import "@/app/dashboard/certificate/add/add.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for the missing marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src
});

const ViewCertificatePage = ({ params }) => {
  const [certificateData, setCertificateData] = useState({
    type: "",
    variety: "",
    latitude: "",
    longitude: "",
    productionQuantity: "",
    standards: [],
    farmerName: "",
    address: "",
    phone: "",
    contactLine: "",
    registrationDate: "",
    expiryDate: "",
    status: "",
  });
  const [allCertificates, setAllCertificates] = useState([]);
  const [standardsInfo, setStandardsInfo] = useState({});
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/histroycer/?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.Users) {
            setCertificateData({
              type: data.type || "",
              variety: data.variety || "",
              latitude: data.latitude || "",
              longitude: data.longitude || "",
              productionQuantity: data.productionQuantity || "",
              standards: JSON.parse(data.standards) || [],
              registrationDate: data.registrationDate ? new Date(data.registrationDate).toLocaleDateString('th-TH') : "",
              expiryDate: data.expiryDate ? new Date(data.expiryDate).toLocaleDateString('th-TH') : "",
              status: data.status || "",
              farmerName: data.Users.farmerName || "",
              address: data.Users.address || "",
              phone: data.Users.phone || "",
              contactLine: data.Users.contactLine || ""
            });

            // Fetch all certificates for this farmer
            fetchAllCertificates(data.Users.id);
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

  const fetchAllCertificates = async (farmerId) => {
    try {
      const response = await fetch(`/api/farmer_certificates/${farmerId}`);
      if (response.ok) {
        const data = await response.json();
        setAllCertificates(data);
      } else {
        throw new Error("Failed to fetch all certificates");
      }
    } catch (error) {
      console.error("Failed to fetch all certificates:", error);
    }
  };

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch("/api/standards");
        if (response.ok) {
          const standardsData = await response.json();
          const infoMap = {};
          standardsData.forEach(standard => {
            infoMap[standard.name] = standard.certificationInfo || "เลขที่ใบรับรอง";
          });
          setStandardsInfo(infoMap);
        }
      } catch (error) {
        console.error("Failed to fetch standards:", error);
      }
    };

    fetchStandards();
  }, []);

  const LocationMarker = () => {
    const map = useMap();
    const { latitude, longitude } = certificateData;

    useEffect(() => {
      if (latitude && longitude) {
        map.setView([latitude, longitude], map.getZoom());
      }
    }, [latitude, longitude, map]);

    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} />
    ) : null;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - Farmer Information and All Certificates */}
      <div className="w-1/2 p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="mb-6 text-2xl font-semibold">ข้อมูลเกษตรกร</h2>
          <div>
            <h3 className="text-lg font-medium mb-2">
              {certificateData.farmerName}
            </h3>
            <div className="text-sm text-gray-600">
              <p>ที่อยู่: {certificateData.address}</p>
              <p>เบอร์โทร: {certificateData.phone}</p>
              <p>Line ID: {certificateData.contactLine}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="mb-6 text-2xl font-semibold">ใบรับรองทั้งหมด</h2>
          {allCertificates.length > 0 ? (
            allCertificates.map((cert, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <p><strong>ชนิด:</strong> {cert.type}</p>
                <p><strong>สายพันธุ์:</strong> {cert.variety}</p>
                <p><strong>มาตรฐาน:</strong> {cert.standardName}</p>
                <p><strong>{standardsInfo[cert.standardName] || "เลขที่ใบรับรอง"}:</strong> {cert.certificateNumber}</p>
                <p><strong>วันที่อนุมัติ:</strong> {new Date(cert.approvalDate).toLocaleDateString("th-TH")}</p>
              </div>
            ))
          ) : (
            <p>ไม่พบใบรับรอง</p>
          )}
        </div>
      </div>

      {/* Right Side - Certificate Details */}
      <div className="w-1/2 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl mb-6">รายละเอียดใบรับรอง</h1>
          
          <div className="space-y-4">
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">ชนิด</label>
              <p className="w-full p-2 border rounded-md bg-gray-50">
                {certificateData.type}
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">สายพันธุ์</label>
              <p className="w-full p-2 border rounded-md bg-gray-50">
                {certificateData.variety}
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">พิกัด</label>
              <div className="h-96 w-full rounded-lg overflow-hidden mb-2">
                <MapContainer
                  center={[20.046061226911785, 99.890654]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  className="map-container"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-600">
                พิกัด: ละติจูด {Number(certificateData.latitude).toFixed(6)}, ลองจิจูด{" "}
                {Number(certificateData.longitude).toFixed(6)}
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">
                จำนวนผลผลิต (กิโลกรัม)
              </label>
              <p className="w-full p-2 border rounded-md bg-gray-50">
                {certificateData.productionQuantity}
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">มาตรฐาน</label>
              <div className="grid grid-cols-2 gap-4">
                {certificateData.standards?.map((standard, index) => (
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
                        {standardsInfo[standard.name] || "เลขที่ใบรับรอง"}: {standard.certNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        วันที่: {new Date(standard.certDate).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">สถานะ</label>
              <p className="w-full p-2 border rounded-md bg-gray-50">
                {certificateData.status}
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">วันที่ลงทะเบียน</label>
              <p className="w-full p-2 border rounded-md bg-gray-50">
                {certificateData.registrationDate}
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2">วันที่หมดอายุ</label>
              <p className="w-full p-2 border rounded-md bg-gray-50">
                {certificateData.expiryDate}
              </p>
            </div>

            {/* ปุ่มย้อนกลับ */}
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCertificatePage;