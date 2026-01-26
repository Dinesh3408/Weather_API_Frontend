import axios from 'axios';

//const API_BASE_URL = 'https://vathavaranam.onrender.com';
const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const weatherService = {
    getWeatherByCity: (city) => api.get(`/api/weather/${encodeURIComponent(city)}`),
    getWeatherByCoordinates: (lat, lon) => api.get('/api/weather/coordinates', { params: { lat, lon } }),
    getWeatherByAutoIP: () => api.get('/api/weather/auto'),
    getForecastByCity: (city) => api.get(`/api/weather/forecast/${encodeURIComponent(city)}`),
    getForecastByCoordinates: (lat, lon) => api.get('/api/weather/forecast/coordinates', { params: { lat, lon } }),
};

export const analyticsService = {
    getStats: () => api.get('/api/analytics/stats'),
};

export default api;
