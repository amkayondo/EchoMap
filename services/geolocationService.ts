import { Coordinate } from '../types';

export const getLocation = (): Promise<Coordinate> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Unknown error occurred.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable it to ping.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false, // Privacy: Coarse location is sufficient
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};
