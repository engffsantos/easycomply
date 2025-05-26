import React, { useState } from 'react';

const FileUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor, selecione um arquivo para upload.');
      return;
    }

    // Verificar tamanho do arquivo (limite de 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('O arquivo é muito grande. O tamanho máximo permitido é 10MB.');
      return;
    }

    // Verificar tipos de arquivo permitidos
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         'text/plain'];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Formatos aceitos: PDF, PNG, JPG, DOC, DOCX, XLS, XLSX, TXT.');
      return;
    }

    setIsUploading(true);
    
    // Criar FormData para envio
    const formData = new FormData();
    formData.append('arquivo', file);
    formData.append('observacao', observacao);
    
    // Em um ambiente real, aqui seria feito o upload para o servidor
    // Simulando um pequeno delay para mostrar o estado de "uploading"
    setTimeout(() => {
      onUpload(formData);
      setIsUploading(false);
      setFile(null);
      setObservacao('');
    }, 1000);
  };

  return (
    <div className="file-uploader">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="arquivo" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Arquivo:
          </label>
          <input
            type="file"
            id="arquivo"
            onChange={handleFileChange}
            style={{ 
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          {file && (
            <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>
              <strong>Arquivo selecionado:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="observacao" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Observação:
          </label>
          <textarea
            id="observacao"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Adicione uma observação sobre esta evidência (opcional)"
            rows="3"
            style={{ 
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        {error && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading}
          style={{
            padding: '10px 15px',
            backgroundColor: isUploading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {isUploading ? 'Enviando...' : 'Enviar Evidência'}
        </button>
      </form>
    </div>
  );
};

export default FileUploader;
