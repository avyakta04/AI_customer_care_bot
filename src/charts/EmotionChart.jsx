import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmotionChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#8b5cf6',
        bodyColor: '#fff',
        borderColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.3)',
          font: { size: 10 }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.3)',
          font: { size: 10 }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 6,
      }
    }
  };

  const data = {
    labels: ['00h', '04h', '08h', '12h', '16h', '20h', '24h'],
    datasets: [
      {
        label: 'Satisfaction Index',
        data: [65, 78, 72, 85, 82, 90, 88],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        borderWidth: 2,
      },
      {
        label: 'Stress Levels',
        data: [30, 25, 45, 35, 28, 20, 22],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.05)',
        fill: true,
        borderWidth: 2,
      }
    ],
  };

  return (
    <div className="h-64 w-full">
      <Line options={options} data={data} />
    </div>
  );
};

export default EmotionChart;
