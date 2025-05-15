import React from 'react';
import PropTypes from 'prop-types';
// Para uma implementação real, você usaria uma biblioteca de gráficos como Chart.js ou Recharts
// Exemplo: import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphWidget = ({ title, type, data, options }) => {
  const widgetStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    minHeight: "300px", // Altura mínima para acomodar um gráfico
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  };

  const titleStyle = {
    marginTop: "0",
    marginBottom: "20px",
    fontSize: "1.25rem",
    color: "#333",
    textAlign: "center",
  };

  // Placeholder para o gráfico
  const placeholderStyle = {
    width: "100%",
    height: "200px", // Altura do placeholder do gráfico
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    color: "#777",
    fontSize: "0.9rem",
  };

  // Lógica para renderizar um gráfico real seria aqui
  // Exemplo com react-chartjs-2:
  // if (type === 'line' && data) {
  //   return (
  //     <div style={widgetStyle}>
  //       <h4 style={titleStyle}>{title}</h4>
  //       <Line data={data} options={options || { responsive: true, maintainAspectRatio: false }} />
  //     </div>
  //   );
  // }

  return (
    <div style={widgetStyle}>
      <h4 style={titleStyle}>{title}</h4>
      <div style={placeholderStyle}>
        <p>Gráfico do tipo "{type}" apareceria aqui.</p>
        {data && <p>(Dados recebidos para o gráfico)</p>}
      </div>
    </div>
  );
};

GraphWidget.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['line', 'bar', 'pie', 'doughnut']).isRequired,
  data: PropTypes.object, // Estrutura de dados esperada pela biblioteca de gráficos
  options: PropTypes.object, // Opções de configuração para a biblioteca de gráficos
};

GraphWidget.defaultProps = {
  type: 'line',
  title: 'Gráfico',
};

export default GraphWidget;

