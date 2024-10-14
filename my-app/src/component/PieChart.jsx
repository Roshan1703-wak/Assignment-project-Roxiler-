import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ categories }) => {
    const data = {
        labels: categories.map(cat => cat.name),
        datasets: [
            {
                label: 'Category Distribution',
                data: categories.map(cat => cat.count),
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
            },
        ],
    };

    return (
        <div>
            <h2>Category Stats</h2>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
