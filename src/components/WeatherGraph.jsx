const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
};

const WeatherGraph = ({ hourly, activeTab = 'Temperature' }) => {
    if (!hourly || hourly.length === 0) return null;

    // Dimensions
    const width = 800;
    const height = 150;
    const padding = 20;

    // Determine what data to display based on activeTab
    let values, minValue, maxValue, unit, color;

    if (activeTab === 'Temperature') {
        values = hourly.map(d => d.temp);
        minValue = Math.min(...values);
        maxValue = Math.max(...values);
        unit = '°';
        color = '#FDB813';
    } else if (activeTab === 'Precipitation') {
        values = hourly.map(d => Number(d.precipitation) || 0);
        minValue = 0;
        maxValue = 100; // Percentage max
        unit = '%';
        color = '#4A90E2';
    } else if (activeTab === 'Wind') {
        values = hourly.map(d => Number(d.windSpeed) || 0);
        minValue = 0;
        const dataMax = Math.max(...values);
        maxValue = dataMax > 0 ? dataMax + 5 : 10;
        unit = ' km/h';
        color = '#50C878';
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
                    const value = values[i];
                    let label = activeTab === 'Temperature' ? `${Math.round(value)}${unit}` :
                        activeTab === 'Precipitation' ? `${value}${unit}` :
                            `${value}${unit} (${getWindDirection(d.windDeg)})`;

                    return (
                        <g key={i}>
                            {/* Value Label */}
                            <text
                                x={getX(i)}
                                y={getY(value) - 10}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="500"
                                fill="#333"
                            >
                                {label}
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
