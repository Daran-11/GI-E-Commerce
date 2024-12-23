"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";
import TraceDetails from "@/components/traceDetails";
import TraceDetailsPP from "@/components/traceDetails_PP";
import TraceDetailsPN from "@/components/traceDetails_PN";

// Loading Component
const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
    <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 text-center">กำลังโหลดข้อมูล...</p>
  </div>
);

// Error Component
const ErrorMessage = ({ message }) => (
  <div className="flex min-h-[50vh] items-center justify-center p-4">
    <div className="rounded-lg bg-red-50 p-6 text-center text-red-600 max-w-md w-full">
      <p>{message}</p>
      <p className="mt-2 text-sm">กำลังนำคุณกลับไปยังหน้าค้นหา...</p>
    </div>
  </div>
);

export default function Traceback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const type = searchParams.get("type");

    if (!code) {
      router.replace("/trace");
      return;
    }

    const fetchQRData = async () => {
      try {
        setIsLoading(true);

        // ดึงข้อมูล QR Code
        const response = await fetch(`/api/qrcode/${code}`);
        if (!response.ok) throw new Error("Invalid QR code");
        const qrcodeData = await response.json();

        // ดึงข้อมูลเกษตรกร
        const farmerResponse = await fetch(
          `/api/farmer/${qrcodeData.farmerId}`
        );
        if (!farmerResponse.ok) throw new Error("Invalid farmer data");
        const farmerData = await farmerResponse.json();

        // จัดรูปแบบที่อยู่
        const formattedAddress = [
          farmerData.address,
          farmerData.sub_district,
          farmerData.district,
          farmerData.province,
          farmerData.zip_code,
        ]
          .filter(Boolean)
          .join(" ");

        // รวมข้อมูล
        const combinedData = {
          ...qrcodeData,
          farmerName: farmerData.farmerName,
          Address: formattedAddress,
          Phone: farmerData.phone,
          ContactLine: farmerData.contactLine,
        };

        setQrData(combinedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("ไม่พบข้อมูล QR Code หรือข้อมูลไม่ถูกต้อง");
        setTimeout(() => {
          router.replace("/trace");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRData();
  }, [searchParams, router]);

  const getTraceDetailsComponent = () => {
    const type = searchParams.get("type");

    switch (type) {
      case "PP":
        return <TraceDetailsPP qrData={qrData} />;
      case "PN":
        return <TraceDetailsPN qrData={qrData} />;
      default:
        return <TraceDetails qrData={qrData} />;
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <header className="mt-10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative h-[70px] sm:h-[90px] w-[200px] sm:w-[250px]">
            <Image
              src="/logo/logo.png"
              alt="GI PLATFORM"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={() => router.push("/trace")}
            className="hidden sm:block rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
          >
            ค้นหาใหม่
          </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Farmer Info */}
          <div className="w-full md:w-1/4 md:order-1 order-1 mb-6 md:mb-0">
            <div className="rounded-3xl mt-10">
              <div className="flex flex-col items-center">
                <div className="mb-4 h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] overflow-hidden rounded-full">
                  <Image
                    src="/dinosaur.png"
                    alt="Farmer"
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mt-2 text-center text-lg sm:text-xl font-bold">
                  {qrData?.farmerName}
                </h2>

                {/* Address */}
                <div className="mt-4 sm:mt-6 w-full">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <p className=" font-semibold text-green-600">ที่อยู่</p>
                  </div>
                  <p className="ml-2 rounded-lg p-3 sm:p-4 text-sm text-gray-600 bg-gray-50">
                    {qrData?.Address}
                  </p>
                </div>

                {/* Phone */}
                <div className=" w-full">
                  <p className="font-semibold text-green-600">เบอร์โทร</p>
                  <p className="ml-6 mt-1 text-sm text-gray-600">{qrData?.Phone}</p>
                </div>

                {/* Line */}
                <div className="mt-4 w-full">
                  <p className="font-semibold text-green-600">Line ID</p>
                  <p className="ml-6 mt-1 text-sm text-gray-600">
                    {qrData?.ContactLine}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-3/4 md:order-2 order-2">
            <div className="md:max-h-[calc(100vh-200px)] md:overflow-y-auto">
              {getTraceDetailsComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
