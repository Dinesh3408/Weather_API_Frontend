import { useState, useCallback } from 'react';

export const useLocation = () => {
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    const getUserLocation = useCallback((onSuccess, onError) => {
        setDetectingLocation(true);
        setLocationError('');

        if (!('geolocation' in navigator)) {
            setDetectingLocation(false);
            const errorMsg = 'Geolocation is not supported by your browser.';
            setLocationError(errorMsg);
            if (onError) onError(errorMsg);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setDetectingLocation(false);
                const { latitude, longitude } = position.coords;
                if (onSuccess) onSuccess(latitude, longitude);
            },
            (error) => {
                setDetectingLocation(false);
                let errorMsg = 'Unable to detect location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Location access denied. Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Location request timeout.';
                        break;
                    default:
                        errorMsg = 'Unable to detect location.';
                }
                setLocationError(errorMsg);
                if (onError) onError(errorMsg);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, []);

    return { detectingLocation, locationError, getUserLocation };
};
