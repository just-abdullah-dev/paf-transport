import { useState, useEffect } from "react";

export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Check camera permission
        const result = await navigator.permissions.query({ name: "camera" });
        setHasPermission(result.state === "granted");

        // Listen for changes in permission state
        result.onchange = () => {
          setHasPermission(result.state === "granted");
        };

        // Trigger permission dialog if not granted
        if (result.state === "prompt") {
          await navigator.mediaDevices.getUserMedia({ video: true });
          checkPermission(); // Recheck permission after user action
        }
      } catch (error) {
        console.error("Error checking camera permission:", error);
        setHasPermission(false);
      }
    };

    checkPermission();
  }, []);

  return hasPermission;
};
