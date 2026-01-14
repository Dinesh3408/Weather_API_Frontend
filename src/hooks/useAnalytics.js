import { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';

export const useAnalytics = (refreshInterval = 30000) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await analyticsService.getStats();
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    return stats;
};
