import React from 'react';
import { Cloud, Wind, Droplets, Gauge } from 'lucide-react';

const WeatherCard = ({ weather }) => {
    if (!weather) return null;

    return (
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
    );
};

export default WeatherCard;
