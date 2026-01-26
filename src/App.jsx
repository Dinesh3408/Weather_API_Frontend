import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CityList from './components/CityList';
import WeatherCard from './components/WeatherCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { useWeather } from './hooks/useWeather';
import { useLocation } from './hooks/useLocation';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const { weather, loading, error, fetchWeather, fetchWeatherByCoordinates, fetchWeatherByAutoIP, setError } = useWeather();
  const { detectingLocation, locationError, getUserLocation } = useLocation();
  const stats = useAnalytics();

  const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'London', 'New York', 'Tokyo'];

  useEffect(() => {
    // Auto-detect location using IP on mount (no permission needed)
    fetchWeatherByAutoIP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationRequest = () => {
    // Use GPS location when user explicitly clicks "My Location" button
    getUserLocation(
      (lat, lon) => fetchWeatherByCoordinates(lat, lon),
      (errMsg) => {
        // Fallback to default city if GPS location fails
        setError(errMsg);
        fetchWeather('Mumbai');
      }
    );
  };

  const handleError = error || locationError;

  return (
    <div className="app">
      <div className="container">
        <Header stats={stats} />

        <div className="search-card">
          <SearchBar
            onSearch={fetchWeather}
            onLocationRequest={handleLocationRequest}
            isDetectingLocation={detectingLocation}
          />

          <CityList
            cities={popularCities}
            onSelectCity={fetchWeather}
          />

          <ErrorMessage message={handleError} />
        </div>

        {loading && <LoadingSpinner />}

        {!loading && weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

export default App;