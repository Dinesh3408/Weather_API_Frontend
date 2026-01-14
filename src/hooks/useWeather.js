import { useState, useCallback } from 'react';
import { weatherService } from '../services/api';

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchWeather = useCallback(async (city) => {
        setLoading(true);
        setError('');
        setWeather(null);
        try {
            const response = await weatherService.getWeatherByCity(city);
            setWeather(response.data);
        } catch (err) {
            console.error('Error fetching weather:', err);
            setError(`Could not fetch weather for "${city}". Please try again.`);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWeatherByCoordinates = useCallback(async (lat, lon) => {
        setLoading(true);
        setError('');
        setWeather(null);
        try {
            const response = await weatherService.getWeatherByCoordinates(lat, lon);
            setWeather(response.data);
        } catch (err) {
            console.error('Error fetching weather by coordinates:', err);
            setError('Could not fetch weather for your location. Showing default city.');
            // Fallback to default city if needed, but the hook should ideally just report error
            // The component can decide whether to fallback or not.
            // For now, let's keep the error state.
        } finally {
            setLoading(false);
        }
    }, []);

    return { weather, loading, error, fetchWeather, fetchWeatherByCoordinates, setError };
};
