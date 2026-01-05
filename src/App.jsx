import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Wind, Droplets, Gauge, Search, Loader, MapPin } from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api/weather';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'London', 'New York', 'Tokyo'];

  useEffect(() => {
    // Automatically detect user's location on page load
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setDetectingLocation(true);
    setLoading(true);
    setError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        // Success: Got user's coordinates
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location detected:', latitude, longitude);
          
          // Send coordinates to your existing backend endpoint
          fetchWeatherByCoordinates(latitude, longitude);
        },
        // Error: User denied or location unavailable
        (error) => {
          console.error('Geolocation error:', error);
          handleLocationError(error);
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation not supported');
      setError('Geolocation is not supported by your browser. Showing default city.');
      setDetectingLocation(false);
      fetchWeather('Mumbai');
    }
  };

  const handleLocationError = (error) => {
    setDetectingLocation(false);
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        setError('Location access denied. Please allow location access or search manually.');
        break;
      case error.POSITION_UNAVAILABLE:
        setError('Location information unavailable. Showing default city.');
        break;
      case error.TIMEOUT:
        setError('Location request timeout. Showing default city.');
        break;
      default:
        setError('Unable to detect location. Showing default city.');
    }
    
    // Fallback to Mumbai
    fetchWeather('Mumbai');
  };

  // Fetch weather by city name
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      console.log('Fetching weather for city:', cityName);
      const response = await axios.get(`${API_BASE_URL}/${cityName}`);
      console.log('Response:', response.data);
      setWeather(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError(`Could not fetch weather for "${cityName}". Please try again.`);
    } finally {
      setLoading(false);
      setDetectingLocation(false);
    }
  };

  // Fetch weather by coordinates (uses your existing endpoint!)
  const fetchWeatherByCoordinates = async (lat, lon) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      console.log('Fetching weather by coordinates:', lat, lon);
      
      // Call YOUR existing backend endpoint
      const response = await axios.get(`${API_BASE_URL}/coordinates`, {
        params: {
          lat: lat,
          lon: lon
        }
      });
      
      console.log('Response:', response.data);
      setWeather(response.data);
    } catch (err) {
      console.error('Error fetching weather by coordinates:', err);
      setError('Could not fetch weather for your location. Showing default city.');
      // Fallback to Mumbai
      fetchWeather('Mumbai');
    } finally {
      setLoading(false);
      setDetectingLocation(false);
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

  const handleUseMyLocation = () => {
    getUserLocation();
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
            <button 
              type="button" 
              onClick={handleUseMyLocation} 
              className="location-button"
              title="Use my location"
              disabled={detectingLocation}
            >
              <MapPin size={20} />
              {detectingLocation ? 'Detecting...' : 'My Location'}
            </button>
          </form>

          {detectingLocation && (
            <div className="location-status">
              <Loader className="spinner-small" size={16} />
              Detecting your location...
            </div>
          )}

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

        {loading && !detectingLocation && (
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