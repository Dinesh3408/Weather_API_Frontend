import React, { useState } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';

const SearchBar = ({ onSearch, onLocationRequest, isDetectingLocation }) => {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city.trim());
        }
    };

    return (
        <>
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
                    onClick={onLocationRequest}
                    className="location-button"
                    title="Use my location"
                    disabled={isDetectingLocation}
                >
                    <MapPin size={20} />
                    {isDetectingLocation ? 'Detecting...' : 'My Location'}
                </button>
            </form>

            {isDetectingLocation && (
                <div className="location-status">
                    <Loader className="spinner-small" size={16} />
                    Detecting your location...
                </div>
            )}
        </>
    );
};

export default SearchBar;
