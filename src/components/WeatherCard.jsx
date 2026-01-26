import React, { useState } from 'react';
import { Cloud, Wind, Droplets, RefreshCw, MoreVertical } from 'lucide-react';
import WeatherGraph from './WeatherGraph';
import DailyForecast from './DailyForecast';

const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
};

const WeatherCard = ({ weather }) => {
    const [activeTab, setActiveTab] = useState('Temperature');

    if (!weather) return null;

    return (
        <div className="google-weather-card">
            {/* Header Section */}
            <div className="card-header">
                <div className="location-info">
                    <div className="dot-indicator"></div>
                    <span>Results for <strong>{weather.city}, {weather.country}</strong></span>
                </div>
                <div className="header-actions">
                    <button className="update-btn">
                        Update <RefreshCw size={14} className="ml-1" />
                    </button>
                    <button className="menu-btn">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            {/* Main Weather Info */}
            <div className="main-weather-section">
                <div className="main-temp-group">
                    <div className="weather-icon-large">
                        <img src={`https://openweathermap.org/img/wn/02d@2x.png`} alt="weather" />
                    </div>
                    <span className="current-temp">{Math.round(weather.temperature)}</span>
                    <div className="unit-group">
                        <span className="unit active">°C</span>
                        <span className="separator">|</span>
                        <span className="unit">°F</span>
                    </div>
                </div>

                <div className="weather-meta">
                    <p className="precip-text">
                        Precipitation: {weather.rainVolume > 0 ? `Rain ${weather.rainVolume}mm` : weather.snowVolume > 0 ? `Snow ${weather.snowVolume}mm` : '0mm'}
                    </p>
                    <p className="humidity-text">Humidity: {weather.humidity}%</p>
                    <p className="wind-text">
                        Wind: {weather.windSpeed} km/h {weather.windDirection ? `(${getWindDirection(weather.windDirection)})` : ''}
                        {weather.windGust > 0 ? `, Gust: ${weather.windGust} km/h` : ''}
                    </p>
                </div>

                <div className="weather-status-right">
                    <h3 className="status-title">Weather</h3>
                    <p className="status-time">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="status-description">{weather.description}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="weather-tabs">
                {['Temperature', 'Precipitation', 'Wind'].map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Graph Area */}
            <div className="graph-area">
                <WeatherGraph hourly={weather.hourly} activeTab={activeTab} />
            </div>

            {/* Daily Forecast */}
            <div className="forecast-area">
                <DailyForecast daily={weather.daily} />
            </div>
        </div>
    );
};

export default WeatherCard;
