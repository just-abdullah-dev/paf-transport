import { useState, useEffect } from 'react';

export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'camera' });
        setHasPermission(result.state === 'granted');

        result.onchange = () => {
          setHasPermission(result.state === 'granted');
        };
      } catch (error) {
        console.error('Error checking camera permission:', error);
        setHasPermission(false);
      }
    };

    checkPermission();
  }, []);

  return hasPermission;
};

