import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import axios from 'axios';

const TimeSeriesChart = () => {
  const chartRef = useRef(null); // ref for canvas
  const chartInstanceRef = useRef(null); // ref for Chart.js instance
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/history').then(res => {
      const times = res.data.map(row => row.timestamp);
      const counts = res.data.map(row => parseFloat(row.count));
      const data = {
        labels: times,
        datasets: [
          {
            label: 'People Count Over Time',
            data: counts,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
          },
        ],
      };

      // Destroy old chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart instance
      const newChart = new Chart(chartRef.current, {
        type: 'line',
        data: data,
      });

      chartInstanceRef.current = newChart;
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Crowd Count Trend</h2>
      <canvas ref={chartRef} />
    </div>
  );
};

export default TimeSeriesChart;
