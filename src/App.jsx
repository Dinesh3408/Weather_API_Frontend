import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Wind, Droplets, Gauge, Search, Loader } from 'lucide-react';
import './App.css';

//Replace with your actual url

const API_BASE_URL ='http://localhost:8080/api/weather';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'London', 'New York', 'Tokyo'];

  useEffect(() => {
    // Load Mumbai weather on startup
    fetchWeather('Mumbai');
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/${cityName}`);
      setWeather(response.data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(`Could not fetch weather for "${cityName}". Please check the city name and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const handleCityClick = (cityName) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <Cloud className="header-icon" size={48} />
          <h1>Weather Dashboard</h1>
          <p>Get real-time weather information for any city</p>
        </header>

        <div className="search-card">
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g., Mumbai, London)"
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
              Search
            </button>
          </form>

          <div className="popular-cities">
            {popularCities.map((cityName) => (
              <button
                key={cityName}
                onClick={() => handleCityClick(cityName)}
                className="city-chip"
              >
                {cityName}
              </button>
            ))}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="loading">
            <Loader className="spinner" size={48} />
            <p>Fetching weather data...</p>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="city-name">{weather.city}</h2>
              <p className="country">{weather.country}</p>
            </div>

            <div className="temp-main">
              <div className="temperature">{Math.round(weather.temperature)}°C</div>
              <div className="description">{weather.description}</div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <Cloud className="detail-icon" size={24} />
                <div className="detail-label">Feels Like</div>
                <div className="detail-value">
                  {Math.round(weather.feelsLike)}°C
                </div>
              </div>

              <div className="detail-item">
                <Droplets className="detail-icon" size={24} />
                <div className="detail-label">Humidity</div>
                <div className="detail-value">
                  {weather.humidity}%
                </div>
              </div>

              <div className="detail-item">
                <Wind className="detail-icon" size={24} />
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">
                  {weather.windSpeed.toFixed(1)} m/s
                </div>
              </div>

              <div className="detail-item">
                <Gauge className="detail-icon" size={24} />
                <div className="detail-label">Pressure</div>
                <div className="detail-value">
                  {weather.pressure} hPa
                </div>
              </div>
            </div>

            <div className="timestamp">
              Last updated: {new Date(weather.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default App;
