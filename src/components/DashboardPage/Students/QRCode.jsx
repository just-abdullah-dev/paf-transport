"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const GenerateQRCode = ({ regNumber }) => {
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas size with padding
      const padding = 40; // 20px on each side
      canvas.width = img.width + padding;
      canvas.height = img.height + padding + 30; // Extra 30px for text at bottom

      if (ctx) {
        // Fill background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code
        ctx.drawImage(img, padding / 2, padding / 2);

        // Add registration number text
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(
          `Reg #: ${regNumber}`,
          canvas.width / 2,
          canvas.height - 10
        );
      }

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${regNumber}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className=" w-full">
      {regNumber && (
        <div className="flex flex-col items-center">
          <div className="p-5 bg-white rounded-lg shadow-md mb-2">
            <QRCodeSVG value={regNumber} size={200} ref={qrRef} />
          </div>
          <button
            onClick={downloadQRCode}
            className="bg-custom-gradient "
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateQRCode;
