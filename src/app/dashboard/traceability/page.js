"use client";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Search from "@/app/ui/dashboard/search/search";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import QRCode from 'qrcode';
import Image from 'next/image';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>
  );
};

const Certificate = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [farmerId, setFarmerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && userId) {
      const getFarmerId = async () => {
        try {
          setError(null);
          const response = await fetch(`/api/farmers?userId=${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch farmer data');
          }
          const data = await response.json();
          if (data) {
            setFarmerId(data.id);
          }
        } catch (error) {
          console.error("Failed to fetch farmer ID:", error);
          setError("ไม่สามารถดึงข้อมูลเกษตรกรได้");
        }
      };
      getFarmerId();
    }
  }, [status, userId]);

  useEffect(() => {
    if (farmerId) {
      const fetchQRCodes = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch(`/api/qrcodes?farmerId=${farmerId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch QR codes');
          }
          const data = await response.json();
          setQRCodes(data);
        } catch (error) {
          console.error("Failed to fetch QR codes:", error);
          setError("ไม่สามารถดึงข้อมูล QR Codes ได้");
        } finally {
          setIsLoading(false);
        }
      };
      fetchQRCodes();
    }
  }, [farmerId]);

  const generateQRCode = async (productId) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(productId);
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-code-${productId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("ไม่สามารถสร้าง QR Code ได้");
    }
  };

  const parseStandards = (standardString) => {
    try {
      const standards = JSON.parse(standardString || '[]');
      return Array.isArray(standards) ? standards : [];
    } catch (error) {
      console.error('Error parsing standards:', error);
      return [];
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหา QR Code..." />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>รหัสสินค้า</td>
            <td>ชนิด</td>
            <td>สายพันธุ์</td>
            <td>จำนวนผลผลิต</td>
            <td>มาตรฐาน</td>
            
            <td>QR Code</td>
          </tr>
        </thead>
        <tbody>
          {qrCodes.length > 0 ? (
            qrCodes.map((qrCode, index) => {
              const standards = parseStandards(qrCode.Standard);

              return (
                <tr key={qrCode.id}>
                  <td>{index + 1}</td>
                  <td>{qrCode.Product_ID}</td>
                  <td>{qrCode.Type}</td>
                  <td>{qrCode.Variety}</td>
                  <td>{qrCode.ProductionQuantity}</td>
                  <td>
                    <div className={styles.standardsContainer}>
                      {Array.isArray(standards) && standards.length > 0 ? (
                        standards.map((standard, idx) => (
                          <div key={idx} className={styles.standardCard}>
                            <div className={styles.standardContent}>
                              <h3 className={styles.standardName}>
                                {standard.name} : {standard.certNumber}
                              </h3>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>ไม่มีมาตรฐาน</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <button
                      onClick={() => generateQRCode(qrCode.Product_ID)}
                      className={styles.qrButton}
                    >
                      ดาวน์โหลด QR Code
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className={styles.noData}>
                ไม่พบข้อมูล
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Certificate;