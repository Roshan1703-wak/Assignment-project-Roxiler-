import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ priceRanges = [] }) => { // Default to an empty array
    // Prepare the chart data
    const data = {
        labels: priceRanges.map(range => range.range),
        datasets: [
            {
                label: 'Number of Items',
                data: priceRanges.map(range => range.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2>Price Range Stats</h2>
            <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
    );
};

export default BarChart;
