import React from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

const DailyForecast = ({ daily }) => {
    if (!daily || daily.length === 0) return null;

    const getIcon = (iconName) => {
        // Simple mapping, can be expanded
        if (iconName === 'rain') return <CloudRain size={24} color="#5591f2" />;
        return <Sun size={24} color="#FDB813" />; // Default to sun/cloud mix
    };

    return (
        <div className="daily-forecast">
            {daily.map((day, index) => (
                <div key={index} className="daily-item">
                    <span className="day-name">{day.day}</span>
                    <div className="day-icon">{getIcon(day.icon)}</div>
                    <div className="day-temps">
                        <span className="max-temp">{day.max}°</span>
                        <span className="min-temp">{day.min}°</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DailyForecast;
