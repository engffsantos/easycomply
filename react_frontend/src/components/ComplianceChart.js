import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const ComplianceChart = ({ data, type = 'bar', title = 'Gráfico de Conformidade' }) => {
  // Configurações padrão para todos os tipos de gráficos
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '%';
            }
            return label;
          }
        }
      }
    },
  };

  // Opções específicas para gráfico de barras
  const barOptions = {
    ...defaultOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // Opções específicas para gráfico de linha
  const lineOptions = {
    ...defaultOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // Opções específicas para gráfico de pizza
  const pieOptions = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          }
        }
      }
    }
  };

  // Renderizar o tipo de gráfico apropriado
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={barOptions} height={300} />;
      case 'pie':
        return <Pie data={data} options={pieOptions} height={300} />;
      case 'line':
        return <Line data={data} options={lineOptions} height={300} />;
      default:
        return <Bar data={data} options={barOptions} height={300} />;
    }
  };

  return (
    <div style={{ 
      height: '350px', 
      padding: '20px', 
      backgroundColor: '#ffffff', 
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      border: '1px solid #e0e0e0'
    }}>
      {renderChart()}
    </div>
  );
};

export default ComplianceChart;
