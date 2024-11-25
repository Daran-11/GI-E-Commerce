'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import TraceDetails from '@/components/traceDetails';

// Standard Card Component
const StandardCard = ({ standard }) => (
  <div className="rounded-lg border border-gray-100 p-4 hover:shadow-md">
    <div className="flex items-center space-x-3">
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

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
      <p>{message}</p>
      <p className="mt-2 text-sm">กำลังนำคุณกลับไปยังหน้าค้นหา...</p>
    </div>
  </div>
);

// Farmer Info Component
const FarmerInfo = ({ data }) => (
  <div className="rounded-3xl bg-white p-6">
    <div className="flex flex-col items-center">
      <div className="mb-4 h-[120px] w-[120px] overflow-hidden rounded-full">
        <Image
          src="/dinosaur.png"
          alt="Farmer"
          width={120}
          height={120}
          className="h-full w-full object-cover"
        />
      </div>
      <h2 className="mt-2 text-center text-xl font-bold">
        {data?.farmerName}
      </h2>

      {/* Address */}
      <div className="mt-6 w-full">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-green-600" />
          <p className="ml-2 font-semibold text-green-600">ที่อยู่</p>
        </div>
        <p className="mt-2 rounded-lg p-4 text-sm text-gray-600">
          {data?.Address}
        </p>
      </div>

      {/* Standards */}
      {data?.Standard && data.Standard.length > 0 && (
        <div className="mt-6 w-full">
          <p className="mb-4 font-semibold text-green-600">
            มาตรฐานที่ได้รับรอง
          </p>
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

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      router.replace('/trace');
      return;
    }

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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto px-6 pt-24">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex h-[100px] w-[300px] items-center justify-center">
          <Image
            src="/logo/logo.png"
            alt="GI PLATFORM"
            width={300}
            height={100}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
        <button
          onClick={() => router.push('/trace')}
          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
        >
          ค้นหาใหม่
        </button>
      </header>

      <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left side - Farmer info */}
          <FarmerInfo data={qrData} />

          {/* Right side - Product info */}
          <div className="md:col-span-3">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <TraceDetails qrData={qrData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}