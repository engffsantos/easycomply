import React, { useState } from 'react';
import FileUploader from './FileUploader';

const ChecklistItemCard = ({ item, onEditClick, onDeleteClick, onUploadEvidencia }) => {
  const [showEvidencias, setShowEvidencias] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Definir cores com base no risco
  const getRiscoColor = (risco) => {
    switch (risco) {
      case 'alto':
        return '#dc3545'; // Vermelho
      case 'medio':
        return '#ffc107'; // Amarelo
      case 'baixo':
        return '#28a745'; // Verde
      default:
        return '#6c757d'; // Cinza
    }
  };

  // Definir cores com base na prioridade
  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta':
        return '#dc3545'; // Vermelho
      case 'media':
        return '#ffc107'; // Amarelo
      case 'baixa':
        return '#28a745'; // Verde
      default:
        return '#6c757d'; // Cinza
    }
  };

  // Definir cores com base no status
  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido':
        return '#28a745'; // Verde
      case 'em_andamento':
        return '#ffc107'; // Amarelo
      case 'pendente':
        return '#6c757d'; // Cinza
      default:
        return '#6c757d'; // Cinza
    }
  };

  // Formatar texto do status
  const formatStatus = (status) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'em_andamento':
        return 'Em Andamento';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '10px' }}>{item.nome}</h3>
          <p style={{ marginBottom: '15px', color: '#555' }}>{item.descricao}</p>
          
          {item.categoria && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Categoria: </span>
              <span>{item.categoria}</span>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '5px 10px', 
              borderRadius: '4px', 
              backgroundColor: getRiscoColor(item.risco),
              color: 'white',
              fontSize: '0.9rem'
            }}>
              Risco: {item.risco.charAt(0).toUpperCase() + item.risco.slice(1)}
            </span>
            
            <span style={{ 
              padding: '5px 10px', 
              borderRadius: '4px', 
              backgroundColor: getPrioridadeColor(item.prioridade),
              color: 'white',
              fontSize: '0.9rem'
            }}>
              Prioridade: {item.prioridade.charAt(0).toUpperCase() + item.prioridade.slice(1)}
            </span>
            
            <span style={{ 
              padding: '5px 10px', 
              borderRadius: '4px', 
              backgroundColor: getStatusColor(item.status),
              color: 'white',
              fontSize: '0.9rem'
            }}>
              Status: {formatStatus(item.status)}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => onEditClick(item)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Editar
          </button>
          
          <button 
            onClick={() => onDeleteClick(item)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Excluir
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => setShowEvidencias(!showEvidencias)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showEvidencias ? 'Ocultar Evidências' : `Mostrar Evidências (${item.evidencias?.length || 0})`}
          </button>
          
          <button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showUploadForm ? 'Cancelar Upload' : 'Adicionar Evidência'}
          </button>
        </div>
        
        {showUploadForm && (
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Upload de Evidência</h4>
            <FileUploader onUpload={(formData) => {
              onUploadEvidencia(formData);
              setShowUploadForm(false);
              setShowEvidencias(true);
            }} />
          </div>
        )}
        
        {showEvidencias && (
          <div style={{ marginTop: '15px' }}>
            <h4>Evidências Anexadas</h4>
            {item.evidencias && item.evidencias.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {item.evidencias.map((evidencia) => (
                  <li 
                    key={evidencia.id} 
                    style={{ 
                      padding: '10px', 
                      backgroundColor: '#f8f9fa', 
                      marginBottom: '5px', 
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{evidencia.nome_original}</span>
                      {evidencia.data_upload && (
                        <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#6c757d' }}>
                          Enviado em: {new Date(evidencia.data_upload).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div>
                      <button 
                        onClick={() => window.open(`/api/checklists/${item.checklist_id}/items/${item.id}/evidencias/${evidencia.id}`, '_blank')}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma evidência anexada.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistItemCard;
