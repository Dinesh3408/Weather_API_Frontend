import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="loading">
            <Loader className="spinner" size={48} />
            <p>Fetching weather data...</p>
        </div>
    );
};

export default LoadingSpinner;
