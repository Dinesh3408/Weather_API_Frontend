import React from 'react';

const CityList = ({ cities, onSelectCity }) => {
    return (
        <div className="popular-cities">
            {cities.map((cityName) => (
                <button
                    key={cityName}
                    onClick={() => onSelectCity(cityName)}
                    className="city-chip"
                >
                    {cityName}
                </button>
            ))}
        </div>
    );
};

export default CityList;
