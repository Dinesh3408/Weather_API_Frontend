import React from 'react';
import { Cloud, Eye, Users, TrendingUp } from 'lucide-react';
import '../App.css';

const Header = ({ stats }) => {
    return (
        <header className="header">
            <Cloud className="header-icon" size={48} />
            <h1>Weather Dashboard</h1>
            <p>Get real-time weather information for any city</p>

            {stats && (
                <div className="stats-bar">
                    <div className="stat-item">
                        <Eye size={16} />
                        <span>{stats.totalHits?.toLocaleString() || 0} views</span>
                    </div>
                    <div className="stat-item">
                        <Users size={16} />
                        <span>{stats.uniqueVisitors?.toLocaleString() || 0} visitors</span>
                    </div>
                    <div className="stat-item">
                        <TrendingUp size={16} />
                        <span>{stats.uptime || '0%'}</span>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
