import React from 'react';

const CategoryStatus = ({ category, totalItems, completedItems, percentageComplete }) => {
  // Determinar a cor com base no percentual de conclusão
  const getStatusColor = (percentage) => {
    if (percentage >= 80) return '#28a745'; // Verde para alto percentual
    if (percentage >= 50) return '#ffc107'; // Amarelo para médio percentual
    return '#dc3545'; // Vermelho para baixo percentual
  };

  // Calcular o percentual se não for fornecido
  const percentage = percentageComplete !== undefined 
    ? percentageComplete 
    : totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100) 
      : 0;

  const statusColor = getStatusColor(percentage);

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>{category}</h3>
        <span style={{ 
          padding: '5px 10px', 
          borderRadius: '20px', 
          backgroundColor: statusColor, 
          color: 'white',
          fontWeight: 'bold'
        }}>
          {percentage}%
        </span>
      </div>
      
      <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '4px', height: '10px' }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: statusColor,
          borderRadius: '4px',
          transition: 'width 0.3s ease-in-out'
        }}></div>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#6c757d' }}>
        {completedItems} de {totalItems} itens concluídos
      </div>
    </div>
  );
};

export default CategoryStatus;
