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
            const weatherData = response.data;

            // Fetch real hourly forecast from backend
            try {
                const forecastResponse = await weatherService.getForecastByCity(city);
                const forecastData = forecastResponse.data;

                if (forecastData && forecastData.list) {
                    console.log('Forecast data received:', forecastData.list[0]); // Debug log
                    // Parse forecast data - take first 8 items (24 hours with 3-hour intervals)
                    weatherData.hourly = forecastData.list.slice(0, 8).map(item => {
                        const date = new Date(item.dt * 1000);
                        let hours = date.getHours();
                        const ampm = hours >= 12 ? 'pm' : 'am';
                        hours = hours % 12;
                        hours = hours ? hours : 12;

                        // Extract precipitation (3h forecast uses '3h' property, not 'oneHour')
                        let precipitation = 0;
                        if (item.rain && item.rain['3h']) {
                            precipitation = item.rain['3h'];
                        } else if (item.snow && item.snow['3h']) {
                            precipitation = item.snow['3h'];
                        }

                        // Extract wind speed
                        const windSpeed = item.wind && item.wind.speed ? item.wind.speed : 0;

                        return {
                            time: `${hours} ${ampm}`,
                            temp: item.main && item.main.temp !== undefined ? item.main.temp : 0,
                            condition: item.weather && item.weather.length > 0 ? item.weather[0].description : 'Clear',
                            precipitation: Number(precipitation) || 0,
                            windSpeed: Number(windSpeed) || 0
                        };
                    });
                    console.log('Parsed hourly data:', weatherData.hourly); // Debug log
                }
            } catch (forecastErr) {
                console.error('Error fetching forecast:', forecastErr);
                // Fallback to mock data if forecast fails
                weatherData.hourly = Array.from({ length: 8 }, (_, i) => {
                    const now = new Date();
                    now.setHours(now.getHours() + i * 3);
                    let hours = now.getHours();
                    const ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;

                    return {
                        time: `${hours} ${ampm}`,
                        temp: Math.round(weatherData.temperature - 2 + Math.random() * 5),
                        condition: 'Sunny',
                        precipitation: parseFloat((Math.random() * 3).toFixed(1)),
                        windSpeed: parseFloat((weatherData.windSpeed + (Math.random() - 0.5) * 5).toFixed(1))
                    };
                });
            }

            // MOCK DATA INJECTION FOR DAILY FORECAST (backend doesn't provide this yet)
            if (!weatherData.daily) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const today = new Date().getDay();
                weatherData.daily = Array.from({ length: 8 }, (_, i) => ({
                    day: days[(today + i) % 7],
                    min: Math.round(weatherData.temperature - 5 + Math.random() * 3),
                    max: Math.round(weatherData.temperature + Math.random() * 4),
                    icon: 'cloud'
                }));
            }

            setWeather(weatherData);
        } catch (err) {
            console.error('Error fetching weather:', err);
            let message = `Could not fetch weather for "${city}".`;

            if (err.response) {
                // The server responded with a status code that falls out of the range of 2xx
                const backendData = err.response.data;
                if (typeof backendData === 'string' && backendData.length > 0) {
                    message = backendData;
                } else if (backendData && typeof backendData === 'object' && backendData.message) {
                    message = backendData.message;
                } else if (backendData && typeof backendData === 'object' && backendData.error) {
                    message = backendData.error;
                }
            } else if (err.request) {
                // The request was made but no response was received
                message = "The backend server is not responding. Please ensure your local backend is running on port 8080.";
            }

            setError(message);
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
            const weatherData = response.data;

            // MOCK DATA INJECTION FOR UI DEVELOPMENT
            if (!weatherData.hourly) {
                weatherData.hourly = Array.from({ length: 24 }, (_, i) => ({
                    time: `${i}:00`,
                    temp: Math.round(weatherData.temperature - 5 + Math.random() * 10),
                    condition: 'Sunny',
                    precipitation: parseFloat((Math.random() * 3).toFixed(1)),
                    windSpeed: parseFloat((weatherData.windSpeed + (Math.random() - 0.5) * 5).toFixed(1))
                }));
            }
            if (!weatherData.daily) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const today = new Date().getDay();
                weatherData.daily = Array.from({ length: 10 }, (_, i) => ({
                    day: days[(today + i) % 7],
                    min: Math.round(weatherData.temperature - 8 + Math.random() * 5),
                    max: Math.round(weatherData.temperature + 2 + Math.random() * 5),
                    icon: 'cloud' // placeholder
                }));
            }

            setWeather(weatherData);
        } catch (err) {
            console.error('Error fetching weather by coordinates:', err);
            const backendError = err.response?.data;
            const message = typeof backendError === 'string' ? backendError : 'Could not fetch weather for your location.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWeatherByAutoIP = useCallback(async () => {
        setLoading(true);
        setError('');
        setWeather(null);
        try {
            const response = await weatherService.getWeatherByAutoIP();
            const weatherData = response.data;

            // MOCK DATA INJECTION FOR UI DEVELOPMENT
            if (!weatherData.hourly) {
                weatherData.hourly = Array.from({ length: 8 }, (_, i) => {
                    const now = new Date();
                    now.setHours(now.getHours() + i * 3);
                    let hours = now.getHours();
                    const ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;

                    return {
                        time: `${hours} ${ampm}`,
                        temp: Math.round(weatherData.temperature - 2 + Math.random() * 5),
                        condition: 'Sunny',
                        precipitation: parseFloat((Math.random() * 3).toFixed(1)),
                        windSpeed: parseFloat((weatherData.windSpeed + (Math.random() - 0.5) * 5).toFixed(1))
                    };
                });
            }
            if (!weatherData.daily) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const today = new Date().getDay();
                weatherData.daily = Array.from({ length: 8 }, (_, i) => ({
                    day: days[(today + i) % 7],
                    min: Math.round(weatherData.temperature - 5 + Math.random() * 3),
                    max: Math.round(weatherData.temperature + Math.random() * 4),
                    icon: 'cloud'
                }));
            }

            setWeather(weatherData);
        } catch (err) {
            console.error('Error fetching weather by auto IP:', err);
            // Fallback to default city if IP-based detection fails
            console.log('Falling back to Mumbai...');
            try {
                const response = await weatherService.getWeatherByCity('Mumbai');
                const weatherData = response.data;

                // Add mock data for Mumbai fallback
                if (!weatherData.hourly) {
                    weatherData.hourly = Array.from({ length: 8 }, (_, i) => {
                        const now = new Date();
                        now.setHours(now.getHours() + i * 3);
                        let hours = now.getHours();
                        const ampm = hours >= 12 ? 'pm' : 'am';
                        hours = hours % 12;
                        hours = hours ? hours : 12;

                        return {
                            time: `${hours} ${ampm}`,
                            temp: Math.round(weatherData.temperature - 2 + Math.random() * 5),
                            condition: 'Sunny',
                            precipitation: parseFloat((Math.random() * 3).toFixed(1)),
                            windSpeed: parseFloat((weatherData.windSpeed + (Math.random() - 0.5) * 5).toFixed(1))
                        };
                    });
                }
                if (!weatherData.daily) {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const today = new Date().getDay();
                    weatherData.daily = Array.from({ length: 8 }, (_, i) => ({
                        day: days[(today + i) % 7],
                        min: Math.round(weatherData.temperature - 5 + Math.random() * 3),
                        max: Math.round(weatherData.temperature + Math.random() * 4),
                        icon: 'cloud'
                    }));
                }

                setWeather(weatherData);
            } catch (fallbackErr) {
                console.error('Fallback to Mumbai also failed:', fallbackErr);
                const backendError = fallbackErr.response?.data;
                const message = typeof backendError === 'string' ? backendError : 'Could not load weather data. Please try searching for a city.';
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { weather, loading, error, fetchWeather, fetchWeatherByCoordinates, fetchWeatherByAutoIP, setError };
};
