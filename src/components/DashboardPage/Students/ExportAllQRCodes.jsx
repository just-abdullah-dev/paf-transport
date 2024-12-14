"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import JSZip from "jszip";
import Button from "@/components/utils/Button";

const ExportAllQRCodes = ({ allRegs }) => {
  const qrRefs = useRef([]);

  const generateQRCodeImage = (svg, regNumber) => {
    return new Promise((resolve) => {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const padding = 40;
        canvas.width = img.width + padding;
        canvas.height = img.height + padding + 30;

        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, padding / 2, padding / 2);
          ctx.font = "12px Arial";
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(
            `Reg #: ${regNumber}`,
            canvas.width / 2,
            canvas.height - 10
          );
        }

        resolve(canvas.toDataURL("image/png"));
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    });
  };

  const downloadAllQRCodes = async () => {
    const zip = new JSZip();

    const qrCodePromises = allRegs.map(async (regNumber, index) => {
      const svg = qrRefs.current[index];
      if (svg) {
        const pngData = await generateQRCodeImage(svg, regNumber);
        zip.file(`${regNumber}_QR.png`, pngData.split("base64,")[1], {
          base64: true,
        });
      }
    });

    await Promise.all(qrCodePromises);

    const zipContent = await zip.generateAsync({ type: "blob" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(zipContent);
    downloadLink.download = "QR_Codes.zip";
    downloadLink.click();
  };
  console.log(allRegs);

  return (
    <div className=" w-full grid md:grid-cols-2 gap-4">
      <h1 className="text-lg font-bold mb-4 text-center">
        Bulk QR Code Generator
      </h1>
      <div className="grid-cols-2 gap-4 mb-4 hidden">
        {allRegs.map((regNumber, index) => (
          <div key={regNumber} className="flex flex-col items-center">
            <div className="p-2 bg-white rounded-lg shadow-sm mb-1">
              <QRCodeSVG
                value={regNumber}
                size={200}
                ref={(el) => (qrRefs.current[index] = el)}
              />
            </div>
            <p className="text-xs text-gray-600">Reg #: {regNumber}</p>
          </div>
        ))}
      </div>
      <p className="mb-4 text-center text-ternary">
        Total Registration Numbers: {allRegs.length}
      </p>
      <Button
        onClick={downloadAllQRCodes}
        className="w-full md:w-[50%] mx-auto col-span-2 "
        aria-label="Download all listed students QR codes"
      >
        Download all listed students QR codes
      </Button>
    </div>
  );
};

export default ExportAllQRCodes;
