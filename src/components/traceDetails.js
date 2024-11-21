'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

// Loading Skeleton Component
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

const TraceDetails = ({ qrData }) => {
  if (!qrData) {
    return <DetailsSkeleton />;
  }

  // Format coordinates for Google Maps URL
  const googleMapsUrl = qrData?.Latitude && qrData?.Longitude
    ? `https://www.google.com/maps?q=${qrData.Latitude},${qrData.Longitude}`
    : null;

  return (
    <div className="bg-gray-100 rounded-3xl shadow-md relative">
      <div className="p-6 space-y-6">
        {/* Product Information Section */}
        <section>
          <h4 className="text-lg font-bold mb-2">ข้อมูลผลิตภัณฑ์ และแหล่งผลิต</h4>
          <div className="space-y-4">
            {/* Product Name */}
            <InfoCard title="ชื่อสินค้า">
              <p className="ml-4">{qrData?.Type} {qrData?.Variety}</p>
            </InfoCard>

            {/* Sweetness Level */}
            <InfoCard title="ระดับความหวาน">
              <p className="ml-4">14-16° brix</p>
            </InfoCard>

            {/* Location */}
            <InfoCard title="ที่อยู่">
              
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center text-green-600 hover:text-green-700"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  ดูแผนที่
                </a>
              )}
            </InfoCard>
          </div>
        </section>

        {/* Product Characteristics Section */}
        <section>
          <h4 className="text-lg font-bold mb-2">ลักษณะเฉพาะของสินค้า</h4>
          <div className="space-y-4">
            {/* Definition */}
            <InfoCard title="คำนิยาม">
              <p className="ml-4">
                สับปะรดภูแลเชียงราย หมายถึง สับปะรดในกลุ่มควีน 
                ซึ่งปลูกในตำบลนางแล ตำบลท่าสุด และตำบลบ้านดู่ อำเภอเมือง จังหวัดเชียงราย
              </p>
            </InfoCard>

            {/* Characteristics */}
            <InfoCard title="ลักษณะทางกายภาพ">
              <div className="ml-4 space-y-2">
                <p>ผลขนาดเล็ก มีน้ำหนักตั้งแต่ 150 กรัม - 1000 กรัม</p>
                <p>ความยาวของจุกโดยเฉลี่ย 1-1.5 เท่าของความยาวผล ตัวจุกมีลักษณะชี้ตรง</p>
                <p>ตาผลตาเต่งตึงโปนออกมาจากผลอย่างเห็นได้ชัด</p>
              </div>
            </InfoCard>

            {/* Production Amount */}
            {qrData?.ProductionQuantity && (
              <InfoCard title="ปริมาณการผลิต">
                <p className="ml-4">{qrData.ProductionQuantity.toLocaleString()} กิโลกรัม</p>
              </InfoCard>
            )}
          </div>
        </section>

        {/* Production Process Section */}
        <section>
          <h4 className="text-lg font-bold mb-2">กระบวนการผลิต</h4>
          <div className="space-y-4">
            {/* Chemical Characteristics */}
            <InfoCard title="ลักษณะทางเคมี">
              <p className="ml-4">ปริมาณกรดโดยรวม เฉลี่ยร้อยละ 0.45 ความหวานอยู่ระหว่าง 14-16 brix</p>
            </InfoCard>

            {/* Planting Process */}
            <InfoCard title="การปลูก">
              <div className="ml-4 space-y-2">
                <p>ปลูกได้ตลอดปี การปลูกใช้ได้ทั้งระบบการปลูกแบบแถวเดี่ยวและแถวคู่</p>
                <p>- แถวเดี่ยว ระหว่างต้น 25 เซนติเมตร ระหว่างแถว 100 เซนติเมตร</p>
                <p>- แถวคู่ ระหว่างต้น 30 เซนติเมตร ระหว่างแถว 50 เซนติเมตร ระหว่างแถวคู่ 10 เซนติเมตร</p>
              </div>
            </InfoCard>
          </div>
        </section>

        {/* Standards Section */}
        {qrData?.Standard && qrData.Standard.length > 0 && (
          <section>
            <h4 className="text-lg font-bold mb-2">มาตรฐานการผลิต</h4>
            <div className="space-y-4">
              {qrData.Standard.map((standard, index) => (
                <InfoCard key={index} title={standard.name}>
                  <div className="ml-4 space-y-2">
                    <p>เลขที่การรับรอง: {standard.certNumber}</p>
                    <p>วันที่รับรอง: {standard.certDate}</p>
                  </div>
                </InfoCard>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TraceDetails;