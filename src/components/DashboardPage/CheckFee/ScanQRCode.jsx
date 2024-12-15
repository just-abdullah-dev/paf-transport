"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import Button from "@/components/utils/Button";

export function QRCodeScanner({ onScan, onError }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check camera permission
  const checkPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: "camera" });
      if (permission.state === "granted") {
        setHasPermission(true);
      } else if (
        permission.state === "prompt" ||
        permission.state === "denied"
      ) {
        // Trigger permission dialog
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setHasPermission(true);
          stream.getTracks().forEach((track) => track.stop());
        } catch (err) {
          console.error("Error accessing camera:", err);
          setHasPermission(false);
        }
      }
    } catch (error) {
      console.error("Error checking camera permission:", error);
      setHasPermission(false);
    }
  };
  useEffect(() => {
    checkPermission();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          stopScanning();
        },
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
      setIsScanning(true);

      // Set timeout to stop scanning after 30 seconds
      timeoutRef.current = setTimeout(() => {
        stopScanning();
      }, 30000);
    } catch (error) {
      console.error("Error starting scanner:", error);
      if (error instanceof Error && onError) {
        onError(error);
      }
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsScanning(false);
  };

  if (hasPermission === null) {
    return (
      <div className="text-center p-4">Requesting camera permission...</div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="text-center p-4 text-red-500">
        No access to camera. Please enable camera access in your browser
        settings.
        <Button className={"block mx-auto mt-2"} onClick={checkPermission}>
          Allow Camera
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto pb-4">
      <div
        className={` ${
          isScanning ? " " : " hidden "
        } relative w-full aspect-square rounded-lg overflow-hidden bg-black`}
      >
        <video ref={videoRef} className="w-full h-full object-cover" />
      </div>

      {!isScanning ? (
        <Button onClick={startScanning}>Scan QR Code</Button>
      ) : (
        <Button variant="danger" onClick={stopScanning}>
          Stop Scanning
        </Button>
      )}
    </div>
  );
}
