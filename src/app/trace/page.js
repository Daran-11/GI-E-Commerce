"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, QrCode } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function TracePage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(
        async (decodedText) => {
          scanner.clear();
          setShowScanner(false);
          setTrackingCode(decodedText);
          handleValidation(decodedText);
        },
        (error) => {
          console.warn(error);
        }
      );

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner]);

  const handleValidation = async (code) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/qrcode/validate/${code}`);
      const data = await response.json();

      if (response.ok && data.exists) {
        router.push(`/trace/traceback?code=${code}`);
      } else {
        setError("ไม่พบรหัสบรรจุภัณฑ์นี้ในระบบ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการตรวจสอบรหัส");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setError("กรุณากรอกรหัสบรรจุภัณฑ์");
      return;
    }
    handleValidation(trackingCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center pt-16 pb-12">
          <div className="relative h-[100px] w-[300px] mx-auto">
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

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              กรุณากรอกรหัสบรรจุภัณฑ์
            </h2>

            {showScanner ? (
              <div className="mb-6">
                <div id="qr-reader" className="w-full"></div>
                <button
                  onClick={() => setShowScanner(false)}
                  className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  ยกเลิกการสแกน
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="ใส่รหัสหน้าบรรจุภัณฑ์ / Enter tracking code"
                    className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-24 pr-4 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "ค้นหา"
                    )}
                  </button>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </form>
            )}

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
                    สามารถตรวจสอบสถานที่ผลิตผ่าน Google Maps
                    และดูข้อมูลการรับรองมาตรฐาน
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
