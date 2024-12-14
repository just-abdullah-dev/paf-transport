import Button from "@/components/utils/Button";
import { useCameraPermission } from "@/hooks/useCameraPersmission";
import { Camera } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { QrReader } from "react-qr-reader";

export default function ScanQRCode({ onScan, onError, searchKeyword, handleSearch }) {
  const [isScanning, setIsScanning] = useState(false);
  const [timer, setTimer] = useState(null);
  const hasPermission = useCameraPermission();
  const [resultantText, setResultantText] = useState("");

  useEffect(() => {
    if (searchKeyword && searchKeyword === resultantText) {
      handleSearch(); // Call the search function only when the condition matches
    }
  }, [searchKeyword, resultantText]);


  const handleScan = useCallback(
    (result) => {
      if (result) {
        onScan(result);
        setIsScanning(false);
        if (timer) clearTimeout(timer);
      }
    },
    [onScan, timer]
  );

  const handleError = useCallback(
    (error) => {
      console.error(error);
      if (onError) onError(error);
      setIsScanning(false);
    },
    [onError]
  );

  const startScanning = useCallback(() => {
    setIsScanning(true);
    const newTimer = setTimeout(() => {
      setIsScanning(false);
    }, 30000);
    setTimer(newTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  if (hasPermission === null) {
    return <div>Requesting camera permission...</div>;
  }

  if (hasPermission === false) {
    return (
      <div className=" text-red-600 text-sm text-center">
        No access to camera. Please enable camera access in your browser
        settings.
      </div>
    );
  }

  return (
    <div className=" pb-6">
      {!isScanning ? (
        <Button className={"flex items-center  gap-3 text-base mx-auto"} onClick={startScanning}>
          Scan QR Code <Camera />
        </Button>
      ) : (
        <div className=" ">
          <QrReader
            onResult={(result) => {
              if (result) {
                setResultantText(result.getText());
                handleScan(result.getText())
              }
            }}
            constraints={{
              facingMode: "environment",
            }}
            videoStyle={{ width: "100%" }}
            containerStyle={{ width: "100%", maxWidth: "400px" }}
          />
          <Button variant="danger" onClick={() => setIsScanning(false)} className="">
            Close Scanner
          </Button>
        </div>
      )}
      
    </div>
  );
}
