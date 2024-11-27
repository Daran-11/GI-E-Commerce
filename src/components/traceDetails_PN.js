"use client";

import { MapPin } from "lucide-react";

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

const traceDetails_PN = ({ qrData }) => {
  if (!qrData) {
    return <DetailsSkeleton />;
  }

  // Format coordinates for Google Maps URL
  const googleMapsUrl =
    qrData?.Latitude && qrData?.Longitude
      ? `https://www.google.com/maps?q=${qrData.Latitude},${qrData.Longitude}`
      : null;

  return (
    <div className="bg-gray-100 rounded-3xl shadow-md relative">
      <div className="p-6 space-y-6">
        {/* Product Information Section */}
        <section>
          <h4 className="text-lg font-bold  mb-2">
            ข้อมูลผลิตภัณฑ์ และแหล่งผลิต
          </h4>
          <div className="space-y-4">
            <InfoCard>
              <div className="ml-4 space-y-4">
                <div>
                  <h6 className="font-semibold text-[#4EAC14] mb-1">
                    ชื่อสินค้า
                  </h6>
                  <p className="ml-4">
                    {qrData?.Type} {qrData?.Variety}
                  </p>
                </div>

                <div>
                  <h6 className="font-semibold text-[#4EAC14] mb-1">
                    ระดับความหวาน
                  </h6>
                  <p className="ml-4">16-20° brix</p>
                </div>

                <div>
                  <h6 className="font-semibold text-[#4EAC14] mb-1">
                    ที่ตั้งแปลง
                  </h6>
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#4EAC14] hover:text-[#3d9110]"
                    >
                      <MapPin className="h-4 w-4 mr-1 ml-4" />
                      ดูแผนที่
                    </a>
                  )}
                </div>
              </div>
            </InfoCard>
          </div>
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
                    สับปะรดนางแล (Nanglae pineapple) หมายถึง สับปะรดพันธุ์น้ำผึ้ง ซึ่งอยู่ในกลุ่ม Smooth cayenne เช่นเดียวกับพันธุ์ปัตตาเวีย ปลูกในตำบลนางแล อำเภอเมือง จังหวัดเชียงราย
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
                  ผล ทรงกลม ป้อมเตี้ย ตาตื้น
                  </p>
                  <p className="ml-4">
                  เปลือก บาง สีเขียวปนเหลืองหรือเหลืองแดง
                  </p>
                  <p className="ml-4">
                  เนื้อ ละเอียด ไม่แข็ง สีเหลืองคล้ายน้ำผึ้ง มีกลิ่นหอมน้ำผึ้ง
                  </p>
                  <p className="ml-4">
                  รสชาติ หวานน้ำผึ้ง ความหวานค่อนข้างสูง
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
                    ปริมาณกรดโดยรวม เฉลี่ยร้อยละ 0.5–0.8% ความหวานอยู่ระหว่าง 16-20° brix
                  </p>
                

                <div className="mt-[10px]">
                  <h6 className="font-semibold text-[#4EAC14] mb-1">การปลูก</h6>
                  <p className="ml-4">
                  ปลูกได้ตลอดปี แต่นิยมปลูกต้นฤดูฝนการปลูกใช้ทั้งระบบการปลูกแบบแถวเดี่ยวและแถวคู่
                  </p>
                  <p>
                   - แถวเดี่ยว ระหว่างต้น 50 เซนติเมตร ระหว่างแถว 100 เซนติเมตร
                  </p>
                  <p>
                  - แถวคู่ ร่องระหว่างต้น 50 เซนติเมตร ระหว่างแถว 50 เซนติเมตร ระหว่างแถวคู่ 150 เซนติเมตร
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>
        </section>

       {/* Standards Section */}
{qrData?.Standard && qrData.Standard.length > 0 && (
  <section>
    <h4 className="text-lg font-bold  mb-2">
      มาตรฐานการผลิต
    </h4>
    <div className="space-y-4">
      {qrData.Standard.map((standard, index) => (
        <InfoCard key={index}>
          <div className="ml-4 space-y-4" >
            
              <h6 className="font-semibold text-[#4EAC14] mb-1">
                {standard.name}
              </h6>
              <div className="ml-4 space-y-2">
                <p>เลขที่การรับรอง: {standard.certNumber}</p>
                <p>วันที่รับรอง: {standard.certDate}</p>
              </div>
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

export default traceDetails_PN;
