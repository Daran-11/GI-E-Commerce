import React from 'react';
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const DetailsSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <h5 className="font-bold text-[#4EAC14] mb-2">{title}</h5>
    {children}
  </div>
);

const TraceDetailsPN = ({ qrData }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertData = async () => {
      try {
        if (!qrData?.qrcodeId) return;
        setLoading(true);
        const response = await fetch(`/api/certificates/${qrData.qrcodeId}`);
        const data = await response.json();
        if (data.success && data.data.certificate?.standards) {
          setCertificates(data.data.certificate.standards);
        } else {
          setError("ไม่พบข้อมูลใบรับรอง");
        }
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchCertData();
  }, [qrData]);

  if (!qrData) return <DetailsSkeleton />;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const googleMapsUrl =
    qrData?.certificate?.latitude && qrData?.certificate?.longitude
      ? `https://www.google.com/maps?q=${qrData.certificate.latitude},${qrData.certificate.longitude}`
      : null;

  return (
    <div className="max-w-6xl mx-auto bg-white p-2 md:p-6 rounded-1xl">
      <div className="p-2 md:p-6 space-y-4 md:space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#4EAC14] text-center">
          หวานกรอบ เนื้อเหลืองทอง หอมเหมือนน้ำผึ้ง
        </h1>

        <section>
          <h4 className="text-lg font-bold mb-2">ข้อมูลสินค้า</h4>
          <InfoCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* รูปภาพแสดงก่อนบนมือถือ */}
              <div className="order-first md:order-last px-2 md:px-0">
                <div className="relative h-[200px] md:h-[250px] w-full">
                  <Image
                    src={qrData.product?.images?.[0]?.imageUrl || "/pineapple/PP.png"}
                    alt="สับปะรดนางแล"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* ข้อมูลสินค้า */}
              <div className="space-y-4 order-last md:order-first px-2 md:px-0">
                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-2 md:ml-6">
                    รหัสสินค้า
                  </h6>
                  <p className="ml-4 md:ml-12">{qrData.qrcodeId}</p>
                </div>
                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-2 md:ml-6">
                    สินค้า
                  </h6>
                  <p className="ml-4 md:ml-12">
                    {qrData.certificate?.type} {qrData.certificate?.variety}
                  </p>
                </div>
                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-2 md:ml-6">
                    ระดับความหวาน
                  </h6>
                  <p className="ml-4 md:ml-12">16-20° brix</p>
                </div>
                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-2 md:ml-6">
                    วันที่เก็บเกี่ยว
                  </h6>
                  <p className="ml-4 md:ml-12">
                    {qrData.product?.HarvestedAt
                      ? formatDate(qrData.product.HarvestedAt)
                      : "-"}
                  </p>
                </div>
                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-2 md:ml-6">
                    ที่ตั้งแปลง
                  </h6>
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#4EAC14] hover:text-[#3d9110] ml-4 md:ml-12"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      ดูแผนที่
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ใบรับรอง */}
            {loading ? (
              <div className="text-center py-4">กำลังโหลดข้อมูลใบรับรอง...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              certificates.length > 0 && (
                <div className="mt-6">
                  <h6 className="text-[#4EAC14] font-semibold mb-3 ml-2 md:ml-6">
                    ใบรับรอง
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-2 md:mx-12">
                    {certificates.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-16 md:h-20 w-16 md:w-20">
                          <Image
                            src={cert.logo}
                            alt={cert.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{cert.name}</p>
                          <p className="text-sm text-gray-600">
                            เลขที่: {cert.certNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            วันที่ออกใบรับรอง: {formatDate(cert.certDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </InfoCard>
        </section>

        {/* ลักษณะเฉพาะของสินค้า */}
        <section>
          <h4 className="text-lg font-bold mb-2">ลักษณะเฉพาะของสินค้า</h4>
          <InfoCard>
            <div className="space-y-4 px-2 md:px-4">
              <h6 className="font-semibold text-[#4EAC14] mb-1">คำนิยาม</h6>
              <p className="ml-2 md:ml-4">
                สับปะรดนางแล (Nanglae pineapple) หมายถึง สับปะรดพันธุ์น้ำผึ้ง
                ซึ่งอยู่ในกลุ่ม Smooth cayenne เช่นเดียวกับพันธุ์ปัตตาเวีย
                ปลูกในตำบลนางแล อำเภอเมือง จังหวัดเชียงราย
              </p>

              <div className="mt-4">
                <h6 className="font-semibold text-[#4EAC14] mb-1">พันธุ์สับปะรด</h6>
                <p className="ml-2 md:ml-4">สับปะรดในกลุ่มควีน</p>
              </div>
              
              <div className="mt-4">
                <h6 className="font-semibold text-[#4EAC14] mb-1">ลักษณะทางกายภาพ</h6>
                <div className="ml-2 md:ml-4 space-y-2">
                  <p>ผล ทรงกลม ป้อมเตี้ย ตาตื้น</p>
                  <p>เปลือก บาง สีเขียวปนเหลืองหรือเหลืองแดง</p>
                  <p>เนื้อ ละเอียด ไม่แข็ง สีเหลืองคล้ายน้ำผึ้ง มีกลิ่นหอมน้ำผึ้ง</p>
                  <p>รสชาติ หวานน้ำผึ้ง ความหวานค่อนข้างสูง</p>
                </div>
              </div>
            </div>
          </InfoCard>
        </section>

        {/* กระบวนการผลิต */}
        <section>
          <h4 className="text-lg font-bold mb-2">กระบวนการผลิต</h4>
          <InfoCard>
            <div className="space-y-4 px-2 md:px-4">
              <h6 className="font-semibold text-[#4EAC14] mb-1">ลักษณะทางเคมี</h6>
              <p className="ml-2 md:ml-4">
                ปริมาณกรดโดยรวม เฉลี่ยร้อยละ 0.5–0.8% ความหวานอยู่ระหว่าง
                16-20° brix
              </p>

              <div className="mt-4">
                <h6 className="font-semibold text-[#4EAC14] mb-1">การปลูก</h6>
                <div className="ml-2 md:ml-4 space-y-2">
                  <p>
                    ปลูกได้ตลอดปี
                    แต่นิยมปลูกต้นฤดูฝนการปลูกใช้ทั้งระบบการปลูกแบบแถวเดี่ยวและแถวคู่
                  </p>
                  <p>
                    - แถวเดี่ยว ระหว่างต้น 50 เซนติเมตร ระหว่างแถว 100 เซนติเมตร
                  </p>
                  <p>
                    - แถวคู่ ร่องระหว่างต้น 50 เซนติเมตร ระหว่างแถว 50 เซนติเมตร
                    ระหว่างแถวคู่ 150 เซนติเมตร
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>
        </section>
      </div>
    </div>
  );
};

export default TraceDetailsPN;