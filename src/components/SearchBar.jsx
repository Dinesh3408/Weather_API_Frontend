import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';
import { Trie } from '../utils/trie';
import { CITIES } from '../utils/cities';

const SearchBar = ({ onSearch, onLocationRequest, isDetectingLocation, discoveredCity }) => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const trieRef = useRef(new Trie());
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Initialize Trie once with static list
        CITIES.forEach(c => trieRef.current.insert(c));

        // Load discovered cities from localStorage
        const extraCities = JSON.parse(localStorage.getItem('discovered_cities') || '[]');
        extraCities.forEach(c => trieRef.current.insert(c));

        // Click outside to close suggestions
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Listen for new discovered cities (e.g. from GPS or manual search result)
    useEffect(() => {
        if (discoveredCity) {
            trieRef.current.insert(discoveredCity);

            // Persist to localStorage
            const extraCities = JSON.parse(localStorage.getItem('discovered_cities') || '[]');
            if (!extraCities.includes(discoveredCity) && !CITIES.includes(discoveredCity)) {
                extraCities.push(discoveredCity);
                localStorage.setItem('discovered_cities', JSON.stringify(extraCities));
            }
        }
    }, [discoveredCity]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCity(value);
        if (value.length > 0) {
            const matches = trieRef.current.search(value);
            setSuggestions(matches);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city.trim());
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="search-wrapper" ref={wrapperRef}>
            <form onSubmit={handleSubmit} className="search-form-refined">
                <div className="search-input-wrapper">
                    <Search className="search-icon-inner" size={20} />
                    <input
                        type="text"
                        value={city}
                        onChange={handleInputChange}
                        onFocus={() => city.length > 0 && setShowSuggestions(true)}
                        placeholder="Search for a city..."
                        className="search-input-refined"
                    />

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="autocomplete-dropdown">
                            {suggestions.map((s, i) => (
                                <div
                                    key={i}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(s)}
                                >
                                    <MapPin size={14} className="mr-2 opacity-50" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onLocationRequest}
                    className="location-button-refined"
                    title="Use my location"
                    disabled={isDetectingLocation}
                >
                    <MapPin size={20} />
                    <span>{isDetectingLocation ? '...' : 'Check in your location'}</span>
                </button>
            </form>

            {isDetectingLocation && (
                <div className="location-status">
                    <Loader className="spinner-small" size={16} />
                    Detecting your location...
                </div>
            )}
        </div>
    );
};

export default SearchBar;
