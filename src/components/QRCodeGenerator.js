"use client";

import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ productCode }) => {
  const [showQR, setShowQR] = useState(false);

  const handleDownload = () => {
    const canvas = document.getElementById(`qr-code-${productCode}`);
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code-${productCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {showQR ? (
        <>
          <QRCode
            id={`qr-code-${productCode}`}
            value={productCode}
            size={128}
            level="H"
            className="mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              ดาวน์โหลด
            </button>
            <button
              onClick={() => setShowQR(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              ปิด
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => setShowQR(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          สร้าง QR Code
        </button>
      )}
    </div>
  );
};

export default QRCodeGenerator;