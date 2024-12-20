"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";

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

const TraceDetailsPP = ({ qrData }) => {
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
        
        console.log('API Response:', data); // Debug log
        
        if (data.success && data.data.certificate?.standards) {
          setCertificates(data.data.certificate.standards);
        } else {
          setError('ไม่พบข้อมูลใบรับรอง');
        }
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchCertData();
  }, [qrData]);

  if (!qrData) return <DetailsSkeleton />;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format coordinates for Google Maps URL
  const googleMapsUrl = 
    qrData?.certificate?.latitude && qrData?.certificate?.longitude
      ? `https://www.google.com/maps?q=${qrData.certificate.latitude},${qrData.certificate.longitude}`
      : null;

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-3xl ">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#4EAC14]  text-center">
          กรอบ หวาน หอม พอดีคำ
        </h1>

        <section>
          <h4 className="text-lg font-bold mb-2">ข้อมูลสินค้า</h4>
          <InfoCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-6">รหัสสินค้า</h6>
                  <p className="ml-12">{qrData.qrcodeId}</p>
                </div>
                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-6">สินค้า</h6>
                  <p className="ml-12">
                    {qrData.certificate?.type} {qrData.certificate?.variety}
                  </p>
                </div>

                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-6">
                    ระดับความหวาน
                  </h6>
                  <p className="ml-12">14-16° brix</p>
                </div>

                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-6">
                    วันที่เก็บเกี่ยว
                  </h6>
                  <p className="ml-12">
                    {qrData.product?.DateCreated ? formatDate(qrData.product.DateCreated) : '-'}
                  </p>
                </div>

                <div>
                  <h6 className="text-[#4EAC14] font-semibold ml-6">
                    ที่ตั้งแปลง
                  </h6>
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#4EAC14] hover:text-[#3d9110] ml-12"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      ดูแผนที่
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative h-[150px] md:h-[250px] w-full">
                  <Image
                    src="/pineapple/PN.png"
                    alt="สับปะรดนางแล"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">กำลังโหลดข้อมูลใบรับรอง...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : certificates.length > 0 && (
              <div className="mt-6">
                <h6 className="text-[#4EAC14] font-semibold mb-3 ml-6">
                  ใบรับรอง
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12 mr-12">
                  {certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-20 w-20">
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
            )}
          </InfoCard>
        </section>

       {/* Product Characteristics Section */}
       <section>
          <h4 className="text-lg font-bold  mb-2">ลักษณะเฉพาะของสินค้า</h4>
          <div className="space-y-4">
            {/* Definition */}
            <InfoCard>
              <div className="ml-4 space-y-4">
                
                  <h6 className="font-semibold text-[#4EAC14] mb-1">คำนิยาม</h6>
                  <p className="ml-4">
                    สับปะรดภูแลเชียงราย หมายถึง สับปะรดในกลุ่มควีน
                    ซึ่งปลูกในตำบลนางแล ตำบลท่าสุด และตำบลบ้านดู่ อำเภอเมือง
                    จังหวัดเชียงราย
                  </p>
               
                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">
                    พันธุ์สับปะรด
                  </h6>
                  <p className="ml-4">สับปะรดในกลุ่มควีน</p>
                </div>
                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">
                    ลักษณะทางกายภาพ
                  </h6>
                  <p className="ml-4">
                    ผลขนาดเล็ก มีน้ำหนักตั้งแต่ 150 กรัม - 1000 กรัม
                  </p>
                  <p className="ml-4">
                    ความยาวของจุกโดยเฉลี่ย 1-1.5 เท่าของความยาวผล
                    ตัวจุกมีลักษณะชี้ตรง
                  </p>
                  <p className="ml-4">
                    ตาผลตาเต่งตึงโปนออกมาจากผลอย่างเห็นได้ชัด
                  </p>
                </div>
                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">เปลือก</h6>
                  <p className="ml-4">
                    เปลือกค่อนข้างหนา เหมาะสำหรับการขนส่งระยะไกล
                    เมื่อสุกผลจะมีสีเหลือง หรือเหลืองปนเขียว
                  </p>
                </div>
                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">เนื้อ</h6>
                  <p className="ml-4">
                    เนื้อสีเหลือง กรอบ กลิ่นหอม แกนสับปะรดกรอบ รับประทานได้
                  </p>
                </div>
                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">รสชาติ</h6>
                  <p className="ml-4">มีความหวานปานกลาง</p>
                </div>
                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">ใบ</h6>
                  <p className="ml-4">
                    ใบเรียวเล็ก สีเขียวอ่อนและมีแถบสีชมพูบริเวณกลางใบ
                    ขอบใบมีหนามเรียงชิดติดกันตลอดความยาวของใบ
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </section>

        {/* Production Process Section */}
        <section>
          <h4 className="text-lg font-bold  mb-2">กระบวนการผลิต</h4>
          <div className="space-y-4">
            {/* Chemical Characteristics */}
            <InfoCard>
              <div className="ml-4 space-y-4">
                
                  <h6 className="font-semibold text-[#4EAC14] mb-1">
                    ลักษณะทางเคมี
                  </h6>
                  <p className="ml-4">
                    ปริมาณกรดโดยรวม เฉลี่ยร้อยละ 0.45 ความหวานอยู่ระหว่าง 14-16°
                    brix
                  </p>
                

                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">การปลูก</h6>
                  <p className="ml-4">
                    ปลูกได้ตลอดปี
                    การปลูกใช้ได้ทั้งระบบการปลูกแบบแถวเดี่ยวและแถวคู่
                  </p>
                  <p>
                    - แถวเดี่ยว ระหว่างต้น 25 เซนติเมตร ระหว่างแถว 100 เซนติเมตร
                  </p>
                  <p>
                    - แถวคู่ ระหว่างต้น 30 เซนติเมตร ระหว่างแถว 50 เซนติเมตร
                    ระหว่างแถวคู่ 10 เซนติเมตร
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TraceDetailsPP;