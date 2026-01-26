import React from 'react';

const WeatherGraph = ({ hourly, activeTab = 'Temperature' }) => {
    if (!hourly || hourly.length === 0) return null;

    // Dimensions
    const width = 800;
    const height = 150;
    const padding = 20;

    // Determine what data to display based on activeTab
    let values, minValue, maxValue, unit, color, label;

    if (activeTab === 'Temperature') {
        values = hourly.map(d => d.temp);
        minValue = Math.min(...values);
        maxValue = Math.max(...values);
        unit = '°';
        color = '#FDB813';
        label = 'temp';
    } else if (activeTab === 'Precipitation') {
        values = hourly.map(d => Number(d.precipitation) || 0);
        minValue = 0;
        const dataMax = Math.max(...values);
        maxValue = dataMax > 0 ? dataMax : 5; // Use 5mm as default max if all zeros
        unit = 'mm';
        color = '#4A90E2';
        label = 'precipitation';
        console.log('Precipitation values:', values, 'max:', maxValue);
    } else if (activeTab === 'Wind') {
        values = hourly.map(d => Number(d.windSpeed) || 0);
        minValue = 0;
        const dataMax = Math.max(...values);
        maxValue = dataMax > 0 ? dataMax : 10; // Use 10 km/h as default max if all zeros
        unit = ' km/h';
        color = '#50C878';
        label = 'windSpeed';
        console.log('Wind values:', values, 'max:', maxValue);
    }

    // Scale helpers
    const getX = (i) => (i / (hourly.length - 1)) * (width - 2 * padding) + padding;
    const getY = (value) => height - padding - ((value - minValue) / (maxValue - minValue || 1)) * (height - 2 * padding);

    // Generate Path
    let pathD = `M ${getX(0)} ${getY(values[0])}`;
    values.forEach((value, i) => {
        if (i === 0) return;
        const x = getX(i);
        const y = getY(value);
        pathD += ` L ${x} ${y}`;
    });

    return (
        <div className="weather-graph-container" style={{ overflowX: 'auto' }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Area fill */}
                <path
                    d={`${pathD} L ${width - padding} ${height} L ${padding} ${height} Z`}
                    fill={`url(#gradient-${activeTab})`}
                    opacity="0.2"
                />

                {/* Main Line */}
                <path d={pathD} fill="none" stroke={color} strokeWidth="3" />

                {/* Points and Labels */}
                {hourly.map((d, i) => {
                    const value = activeTab === 'Temperature' ? d.temp :
                        activeTab === 'Precipitation' ? (d.precipitation || 0) :
                            (d.windSpeed || 0);
                    return (
                        <g key={i}>
                            {/* Value Label */}
                            <text
                                x={getX(i)}
                                y={getY(value) - 10}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#333"
                            >
                                {activeTab === 'Temperature' ? Math.round(value) : value.toFixed(1)}{unit}
                            </text>

                            {/* Time Label */}
                            <text
                                x={getX(i)}
                                y={height - 5}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#666"
                            >
                                {d.time}
                            </text>
                        </g>
                    );
                })}

                <defs>
                    <linearGradient id={`gradient-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default WeatherGraph;
