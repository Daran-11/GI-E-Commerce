"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import TraceDetails from "@/components/traceDetails";
import TraceDetailsPP from "@/components/traceDetails_PP";
import TraceDetailsPN from "@/components/traceDetails_PN";

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
    <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 text-center">กำลังโหลดข้อมูล...</p>
  </div>
);

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
        const response = await fetch(`/api/qrcode/${code}`);
        if (!response.ok) throw new Error("Invalid QR code");
        const qrcodeData = await response.json();

        const farmerResponse = await fetch(
          `/api/farmer/${qrcodeData.farmerId}`
        );
        if (!farmerResponse.ok) throw new Error("Invalid farmer data");
        const farmerData = await farmerResponse.json();

        const formattedAddress = [
          farmerData.address,
          farmerData.sub_district,
          farmerData.district,
          farmerData.province,
          farmerData.zip_code,
        ]
          .filter(Boolean)
          .join(" ");

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white mt-20">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <header className="flex justify-between items-center h-16 mb-8">
          <div className="relative h-[60px] w-[180px] sm:h-[90px] sm:w-[250px]">
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
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
          >
            ค้นหาใหม่
          </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Farmer Info */}
          <div className="w-full md:w-1/4  rounded-lg p-10">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex flex-col items-center mb-6">
                <div className="h-[100px] w-[100px] overflow-hidden rounded-full mb-3">
                  <Image
                    src="/dinosaur.png"
                    alt="Farmer"
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-bold text-center">
                  {qrData?.farmerName}
                </h2>
              </div>

              {/* Contact Info - Mobile */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600 ml-1">
                      ที่อยู่
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 pl-6">
                    {qrData?.Address}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600 ml-1">
                      เบอร์โทร
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 pl-6">{qrData?.Phone}</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600 ml-1">
                      Line ID
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 pl-6">
                    {qrData?.ContactLine}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:flex-col md:items-center">
              <div className="mb-4 h-[220px] w-[220px] overflow-hidden rounded-full">
                <Image
                  src="/dinosaur.png"
                  alt="Farmer"
                  width={350}
                  height={350}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-2 text-center text-xl font-bold">
                {qrData?.farmerName}
              </h2>

              <div className="mt-6 w-full space-y-4">
                <div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <p className="font-semibold text-green-600 ml-1">ที่อยู่</p>
                  </div>
                  <p className="ml-6 mt-2 text-sm text-gray-900">
                    {qrData?.Address}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-green-600 ml-6">เบอร์โทร</p>
                  <p className="ml-6 mt-2 text-sm text-gray-900">
                    {qrData?.Phone}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-green-600 ml-6">Line ID</p>
                  <p className="ml-6 mt-2 text-sm text-gray-900">
                    {qrData?.ContactLine}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-3/4">
            <div className="md:max-h-[calc(100vh-200px)] md:overflow-y-auto">
              {getTraceDetailsComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
