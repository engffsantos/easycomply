import React from 'react';
import PropTypes from 'prop-types';

const ChecklistCard = ({ title, description, status, progressPercentage, itemsCompleted, totalItems, onDetailsClick, onEditClick, onDeleteClick }) => {
  let statusColor = "#6c757d"; // Cinza para pendente por padrão
  let statusText = status || "Pendente";

  if (status) {
    switch (status.toLowerCase()) {
      case 'em andamento':
        statusColor = "#ffc107"; // Amarelo para em andamento
        statusText = "Em Andamento";
        break;
      case 'concluído':
      case 'concluido':
        statusColor = "#28a745"; // Verde para concluído
        statusText = "Concluído";
        break;
      case 'pendente':
      default:
        statusColor = "#6c757d"; // Cinza
        statusText = "Pendente";
        break;
    }
  }

  const cardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  };

  const titleStyle = {
    marginTop: "0",
    marginBottom: "10px",
    fontSize: "1.5rem",
    color: "#333",
  };

  const descriptionStyle = {
    marginBottom: "15px",
    color: "#555",
    fontSize: "1rem",
    lineHeight: "1.6",
  };

  const statusStyle = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "4px",
    backgroundColor: statusColor,
    color: "white",
    fontWeight: "bold",
    marginBottom: "15px",
    fontSize: "0.9rem",
  };

  const progressContainerStyle = {
    marginBottom: "15px",
  };

  const progressTextStyle = {
    fontSize: "0.9rem",
    color: "#555",
    marginBottom: "5px",
  };

  const progressBarBackgroundStyle = {
    width: "100%",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    height: "12px",
  };

  const progressBarStyle = {
    width: `${progressPercentage || 0}%`,
    height: "100%",
    backgroundColor: progressPercentage === 100 ? "#28a745" : "#007bff",
    borderRadius: "4px",
    transition: "width 0.3s ease-in-out",
  };

  const buttonStyle = {
    padding: "8px 15px",
    marginRight: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s ease",
  };

  const detailsButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ffc107",
    color: "#333",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
    color: "white",
    marginRight: 0, // No margin for the last button
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      <div style={statusStyle}>{statusText}</div>
      
      {(typeof progressPercentage === 'number' || (typeof itemsCompleted === 'number' && typeof totalItems === 'number')) && (
        <div style={progressContainerStyle}>
          <p style={progressTextStyle}>
            Progresso: {itemsCompleted !== undefined && totalItems !== undefined ? `${itemsCompleted} / ${totalItems} itens` : `${progressPercentage}%`}
          </p>
          <div style={progressBarBackgroundStyle}>
            <div style={progressBarStyle}></div>
          </div>
        </div>
      )}

      <div>
        {onDetailsClick && <button style={detailsButtonStyle} onClick={onDetailsClick}>Ver Detalhes</button>}
        {onEditClick && <button style={editButtonStyle} onClick={onEditClick}>Editar</button>}
        {onDeleteClick && <button style={deleteButtonStyle} onClick={onDeleteClick}>Excluir</button>}
      </div>
    </div>
  );
};

ChecklistCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string,
  progressPercentage: PropTypes.number, // Progresso em porcentagem (0-100)
  itemsCompleted: PropTypes.number,   // Itens completados (se não usar porcentagem)
  totalItems: PropTypes.number,       // Total de itens (se não usar porcentagem)
  onDetailsClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

ChecklistCard.defaultProps = {
  description: 'Sem descrição fornecida.',
  status: 'Pendente',
  // Não definir default para progressPercentage, itemsCompleted, totalItems para permitir a lógica condicional de exibição
};

export default ChecklistCard;

