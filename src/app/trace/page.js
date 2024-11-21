'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { QrCode } from 'lucide-react';

export default function TracePage() {
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setError('กรุณากรอกรหัสบรรจุภัณฑ์');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if QR code exists in database
      const response = await fetch(`/api/qrcode/validate/${trackingCode}`);
      const data = await response.json();

      if (response.ok && data.exists) {
        // If valid, redirect to traceback page with the code
        router.push(`/trace/traceback?code=${trackingCode}`);
      } else {
        setError('ไม่พบรหัสบรรจุภัณฑ์นี้ในระบบ');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการตรวจสอบรหัส');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        {/* Top Section with Platform Information */}
        <div className="text-center pt-16 pb-12">
        <div className="relative h-[100px] w-[300px]">
            <Image
              src="/logo/logo.png"
              alt="GI PLATFORM"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ระบบตรวจสอบย้อนกลับ
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เพื่อความมั่นใจในคุณภาพและความปลอดภัยของผลิตภัณฑ์ 
            คุณสามารถตรวจสอบแหล่งที่มาและข้อมูลการผลิตได้ทันที
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              กรุณากรอกรหัสบรรจุภัณฑ์
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <QrCode className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="ใส่รหัสหน้าบรรจุภัณฑ์ / Enter tracking code"
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    'ค้นหา'
                  )}
                </button>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}
            </form>

            {/* Instructions */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                วิธีการตรวจสอบ
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    1
                  </div>
                  <p className="ml-3 text-gray-600">
                    สแกน QR Code บนบรรจุภัณฑ์หรือกรอกรหัสบรรจุภัณฑ์ในช่องด้านบน
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    2
                  </div>
                  <p className="ml-3 text-gray-600">
                    ระบบจะแสดงข้อมูลแหล่งที่มา ข้อมูลเกษตรกร และมาตรฐานการผลิต
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    3
                  </div>
                  <p className="ml-3 text-gray-600">
                    สามารถตรวจสอบสถานที่ผลิตผ่าน Google Maps และดูข้อมูลการรับรองมาตรฐาน
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}