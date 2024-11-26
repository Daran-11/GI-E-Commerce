'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, ArrowLeft, ArrowUp } from 'lucide-react';
import TraceDetails from '@/components/traceDetails';
import TraceDetailsPP from '@/components/traceDetails_PP';
import TraceDetailsPN from '@/components/traceDetails_PN';

// Loading Skeleton Component - ปรับให้ responsive
const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
    <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 text-center">กำลังโหลดข้อมูล...</p>
  </div>
);

// Error Message Component - ปรับให้ responsive
const ErrorMessage = ({ message }) => (
  <div className="flex min-h-[50vh] items-center justify-center p-4">
    <div className="rounded-lg bg-red-50 p-6 text-center text-red-600 max-w-md w-full">
      <p>{message}</p>
      <p className="mt-2 text-sm">กำลังนำคุณกลับไปยังหน้าค้นหา...</p>
    </div>
  </div>
);

// Standard Card Component - ปรับให้ responsive
const StandardCard = ({ standard }) => (
  <div className="rounded-lg border border-gray-100 p-4 hover:shadow-md transition-all">
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
      <div className="relative h-12 w-12 flex-shrink-0">
        <Image
          src={standard.logo}
          alt={standard.name}
          fill
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{standard.name}</h3>
        <p className="text-sm text-gray-600">เลขที่: {standard.certNumber}</p>
        <p className="text-sm text-gray-600">วันที่: {standard.certDate}</p>
      </div>
    </div>
  </div>
);

// Farmer Info Component - ปรับให้ responsive
const FarmerInfo = ({ data }) => (
  <div className="rounded-3xl bg-white p-4 sm:p-6 border border-gray-100 ">
    <div className="flex flex-col items-center">
      <div className="mb-4 h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] overflow-hidden rounded-full">
        <Image
          src="/dinosaur.png"
          alt="Farmer"
          width={120}
          height={120}
          className="h-full w-full object-cover"
        />
      </div>
      <h2 className="mt-2 text-center text-lg sm:text-xl font-bold">
        {data?.farmerName}
      </h2>

      {/* Address */}
      <div className="mt-4 sm:mt-6 w-full">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-green-600" />
          <p className="ml-2 font-semibold text-green-600">ที่อยู่</p>
        </div>
        <p className="mt-2 rounded-lg p-3 sm:p-4 text-sm text-gray-600 bg-gray-50">
          {data?.Address}
        </p>
      </div>

      {/* Standards */}
      {data?.Standard && data.Standard.length > 0 && (
        <div className="mt-4 sm:mt-6 w-full">
          <p className="mb-4 font-semibold text-green-600">มาตรฐานที่ได้รับรอง</p>
          <div className="space-y-3">
            {data.Standard.map((standard, index) => (
              <StandardCard key={index} standard={standard} />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function Traceback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [productType, setProductType] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      router.replace('/trace');
      return;
    }

    const codeType = code.substring(3, 5);
    setProductType(codeType);

    const fetchQRData = async () => {
      try {
        const response = await fetch(`/api/qrcode/${code}`);
        if (!response.ok) {
          throw new Error('Invalid QR code');
        }
        const data = await response.json();
        setQrData(data);
      } catch (err) {
        console.error('Error fetching QR data:', err);
        setError('ไม่พบข้อมูล QR Code หรือข้อมูลไม่ถูกต้อง');
        setTimeout(() => {
          router.replace('/trace');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRData();
  }, [searchParams, router]);

  const getTraceDetailsComponent = () => {
    switch (productType) {
      case 'PP':
        return <TraceDetailsPP qrData={qrData} />;
      case 'PN':
        return <TraceDetailsPN qrData={qrData} />;
      default:
        return <TraceDetails qrData={qrData} />;
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <header className="mt-10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className=" relative h-[70px] sm:h-[90px] w-[200px] sm:w-[250px]">
            <Image
              src="/logo/logo.png"
              alt="GI PLATFORM"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={() => router.push('/trace')}
            className="hidden sm:block rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
          >
            ค้นหาใหม่
          </button>
        </header>
  
        
  
          {/* Main Content Area */}
          <div className="flex flex-col md:flex-row md:gap-6">
            {/* Farmer Info - แสดงก่อนบน Mobile, แสดงด้านซ้ายบน Desktop */}
            <div className="w-full md:w-1/4 md:order-1 order-1 mb-6 md:mb-0">
              <div className="rounded-3xl bg-white p-4 sm:p-6 border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] overflow-hidden rounded-full">
                    <Image
                      src="/dinosaur.png"
                      alt="Farmer"
                      width={120}
                      height={120}
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
                      <p className="ml-2 font-semibold text-green-600">ที่อยู่</p>
                    </div>
                    <p className="mt-2 rounded-lg p-3 sm:p-4 text-sm text-gray-600 bg-gray-50">
                      {qrData?.Address}
                    </p>
                  </div>
  
                  {/* Standards */}
                  {qrData?.Standard && qrData.Standard.length > 0 && (
                    <div className="mt-4 sm:mt-6 w-full">
                      <p className="mb-4 font-semibold text-green-600">มาตรฐานที่ได้รับรอง</p>
                      <div className="space-y-3">
                        {qrData.Standard.map((standard, index) => (
                          <StandardCard key={index} standard={standard} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* Product Details - แสดงทีหลังบน Mobile, แสดงด้านขวาบน Desktop */}
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