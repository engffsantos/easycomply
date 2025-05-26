import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ModalConfirm from "../components/ModalConfirm";
import "../App.css";

const DocumentosPage = () => {
  // Estados para documentos e formulário
  const [documentos, setDocumentos] = useState([]);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
  const [versoes, setVersoes] = useState([]);
  const [tipoDocumentoSelecionado, setTipoDocumentoSelecionado] = useState("politica_privacidade");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showVersoesModal, setShowVersoesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Estado para formulário de documento
  const [formData, setFormData] = useState({
    title: "",
    document_type: "politica_privacidade",
    empresa_nome: "",
    tipo_dados: "",
    base_legal: "consentimento",
    finalidade: "",
    compartilhamento: ""
  });

  // Tipos de documentos disponíveis
  const tiposDocumento = [
    { value: "politica_privacidade", label: "Política de Privacidade" },
    { value: "termo_uso", label: "Termos de Uso" },
    { value: "contrato_dpa", label: "Contrato de Processamento de Dados (DPA)" },
    { value: "aviso_cookies", label: "Aviso de Cookies" },
    { value: "relatorio_impacto", label: "Relatório de Impacto à Proteção de Dados" }
  ];

  // Opções de base legal
  const basesLegais = [
    { value: "consentimento", label: "Consentimento do Titular" },
    { value: "contrato", label: "Execução de Contrato" },
    { value: "obrigacao_legal", label: "Obrigação Legal" },
    { value: "interesse_legitimo", label: "Interesse Legítimo" },
    { value: "protecao_credito", label: "Proteção ao Crédito" },
    { value: "tutela_saude", label: "Tutela da Saúde" }
  ];

  // Buscar documentos ao carregar a página
  useEffect(() => {
    fetchDocumentos();
  }, []);

  // Buscar documentos quando o tipo selecionado mudar
  useEffect(() => {
    fetchDocumentos();
  }, [tipoDocumentoSelecionado]);

  // Função para buscar documentos da API
  const fetchDocumentos = async () => {
    try {
      setLoading(true);
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/documentos?document_type=${tipoDocumentoSelecionado}`);
      // const data = await response.json();
      // if (data.success) {
      //   setDocumentos(data.data);
      // }

      // Dados simulados para desenvolvimento
      const mockDocumentos = [
        {
          id: 1,
          title: "Política de Privacidade - EasyComply",
          document_type: "politica_privacidade",
          version: 2,
          created_at: "2025-05-15T10:30:00Z",
          empresa_nome: "EasyComply Tecnologia Ltda",
          tipo_dados: "Dados pessoais, dados de contato, dados de navegação",
          base_legal: "consentimento",
          assinatura_status: "assinado"
        },
        {
          id: 2,
          title: "Termos de Uso - Portal EasyComply",
          document_type: "termo_uso",
          version: 1,
          created_at: "2025-05-10T14:20:00Z",
          empresa_nome: "EasyComply Tecnologia Ltda",
          assinatura_status: "pendente"
        },
        {
          id: 3,
          title: "Contrato de Processamento de Dados - Fornecedor X",
          document_type: "contrato_dpa",
          version: 3,
          created_at: "2025-05-05T09:15:00Z",
          empresa_nome: "EasyComply Tecnologia Ltda",
          assinatura_status: null
        }
      ];

      // Filtrar por tipo selecionado
      const documentosFiltrados = mockDocumentos.filter(doc => 
        tipoDocumentoSelecionado === "todos" || doc.document_type === tipoDocumentoSelecionado
      );

      // Simular um pequeno delay para mostrar o loading
      setTimeout(() => {
        setDocumentos(documentosFiltrados);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
      setError("Não foi possível carregar os documentos. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  // Função para buscar versões de um documento
  const fetchVersoes = async (documentoId) => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/documentos/${documentoId}/versoes`);
      // const data = await response.json();
      // if (data.success) {
      //   setVersoes(data.data);
      // }

      // Dados simulados para desenvolvimento
      const mockVersoes = [
        {
          id: 1,
          title: "Política de Privacidade - EasyComply",
          document_type: "politica_privacidade",
          version: 2,
          created_at: "2025-05-15T10:30:00Z"
        },
        {
          id: 4,
          title: "Política de Privacidade - EasyComply",
          document_type: "politica_privacidade",
          version: 1,
          created_at: "2025-04-20T11:45:00Z"
        }
      ];

      setVersoes(mockVersoes);
    } catch (err) {
      console.error("Erro ao buscar versões:", err);
    }
  };

  // Função para gerar um novo documento
  const handleGerarDocumento = async (e) => {
    e.preventDefault();
    
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch('/api/documentos/gerar', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchDocumentos();
      //   setShowFormModal(false);
      //   setFormData({
      //     title: "",
      //     document_type: "politica_privacidade",
      //     empresa_nome: "",
      //     tipo_dados: "",
      //     base_legal: "consentimento",
      //     finalidade: "",
      //     compartilhamento: ""
      //   });
      // }

      // Simulação para desenvolvimento
      alert("Documento gerado com sucesso! Em um ambiente real, o PDF seria gerado e disponibilizado para download.");
      setShowFormModal(false);
      
      // Adicionar documento simulado à lista
      const novoDocumento = {
        id: Math.floor(Math.random() * 1000),
        ...formData,
        version: 1,
        created_at: new Date().toISOString(),
        assinatura_status: null
      };
      
      setDocumentos([novoDocumento, ...documentos]);
      
      // Resetar formulário
      setFormData({
        title: "",
        document_type: "politica_privacidade",
        empresa_nome: "",
        tipo_dados: "",
        base_legal: "consentimento",
        finalidade: "",
        compartilhamento: ""
      });
    } catch (error) {
      console.error("Erro ao gerar documento:", error);
    }
  };

  // Função para visualizar versões de um documento
  const handleVerVersoes = (documento) => {
    setDocumentoSelecionado(documento);
    fetchVersoes(documento.id);
    setShowVersoesModal(true);
  };

  // Função para download de um documento
  const handleDownload = (documentoId) => {
    // Em produção, redirecionar para a URL de download
    // window.open(`/api/documentos/${documentoId}/download`, '_blank');
    
    // Simulação para desenvolvimento
    alert(`Download iniciado para o documento ID: ${documentoId}`);
  };

  // Função para visualizar preview de um documento
  const handlePreview = (documento) => {
    // Em produção, definir URL real do documento
    // setPreviewUrl(`/api/documentos/${documento.id}/preview`);
    
    // Simulação para desenvolvimento
    setPreviewUrl("https://example.com/preview-documento");
    alert(`Em um ambiente real, o preview do documento "${documento.title}" seria exibido.`);
  };

  // Função para atualizar status de assinatura
  const handleAtualizarAssinatura = async (documentoId, status) => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/documentos/${documentoId}/assinatura`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ assinatura_status: status }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchDocumentos();
      // }

      // Simulação para desenvolvimento
      const documentosAtualizados = documentos.map(doc => {
        if (doc.id === documentoId) {
          return { ...doc, assinatura_status: status };
        }
        return doc;
      });
      
      setDocumentos(documentosAtualizados);
      alert(`Status de assinatura atualizado para: ${status}`);
    } catch (error) {
      console.error("Erro ao atualizar status de assinatura:", error);
    }
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter cor do status de assinatura
  const getCorStatusAssinatura = (status) => {
    switch (status) {
      case 'assinado':
        return '#28a745'; // Verde
      case 'pendente':
        return '#ffc107'; // Amarelo
      case 'recusado':
        return '#dc3545'; // Vermelho
      default:
        return '#6c757d'; // Cinza
    }
  };

  // Função para obter texto do status de assinatura
  const getTextoStatusAssinatura = (status) => {
    switch (status) {
      case 'assinado':
        return 'Assinado';
      case 'pendente':
        return 'Pendente';
      case 'recusado':
        return 'Recusado';
      default:
        return 'Não enviado';
    }
  };

  return (
    <div className="documentos-page">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}>
        <Sidebar />
        <main style={{
          flexGrow: 1,
          padding: "2rem",
          marginLeft: "270px",
          backgroundColor: "#fff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1>Geração de Documentos Legais</h1>
            <button 
              onClick={() => setShowFormModal(true)}
              style={{
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Gerar Novo Documento
            </button>
          </div>

          {/* Filtro por tipo de documento */}
          <div style={{ marginBottom: "2rem" }}>
            <label htmlFor="tipoDocumento" style={{ marginRight: "1rem", fontWeight: "bold" }}>
              Filtrar por tipo:
            </label>
            <select 
              id="tipoDocumento" 
              value={tipoDocumentoSelecionado} 
              onChange={(e) => setTipoDocumentoSelecionado(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            >
              <option value="todos">Todos os tipos</option>
              {tiposDocumento.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>

          {/* Lista de documentos */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Carregando documentos...</p>
              {/* Aqui poderia ser adicionado um spinner de loading */}
            </div>
          ) : error ? (
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "#f8d7da", 
              color: "#721c24", 
              borderRadius: "4px", 
              marginBottom: "1rem" 
            }}>
              <p>{error}</p>
              <button 
                onClick={fetchDocumentos}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Tentar Novamente
              </button>
            </div>
          ) : documentos.length === 0 ? (
            <p>Nenhum documento encontrado. Gere um novo documento para começar.</p>
          ) : (
            <div className="documentos-list">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Título</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Tipo</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6" }}>Versão</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Data de Criação</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.map(documento => (
                    <tr key={documento.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                      <td style={{ padding: "12px" }}>{documento.title}</td>
                      <td style={{ padding: "12px" }}>
                        {tiposDocumento.find(tipo => tipo.value === documento.document_type)?.label || documento.document_type}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>v{documento.version}</td>
                      <td style={{ padding: "12px" }}>{formatarData(documento.created_at)}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{ 
                          padding: "5px 10px", 
                          borderRadius: "20px", 
                          backgroundColor: getCorStatusAssinatura(documento.assinatura_status), 
                          color: "white",
                          fontSize: "0.9rem"
                        }}>
                          {getTextoStatusAssinatura(documento.assinatura_status)}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          <button 
                            onClick={() => handleDownload(documento.id)}
                            title="Download"
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => handlePreview(documento)}
                            title="Visualizar"
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "#6c757d",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Visualizar
                          </button>
                          <button 
                            onClick={() => handleVerVersoes(documento)}
                            title="Versões"
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Versões
                          </button>
                          {documento.assinatura_status !== 'assinado' && (
                            <button 
                              onClick={() => handleAtualizarAssinatura(documento.id, 'assinado')}
                              title="Marcar como Assinado"
                              style={{
                                padding: "6px 10px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                              }}
                            >
                              Assinar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal para Formulário de Documento */}
          {showFormModal && (
            <ModalConfirm
              isOpen={showFormModal}
              onClose={() => setShowFormModal(false)}
              onConfirm={handleGerarDocumento}
              title="Gerar Novo Documento Legal"
              confirmText="Gerar Documento"
              cancelText="Cancelar"
              message={
                <form id="documentForm" onSubmit={handleGerarDocumento}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="document_type" style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>
                      Tipo de Documento:
                    </label>
                    <select 
                      id="document_type" 
                      value={formData.document_type} 
                      onChange={(e) => setFormData({...formData, document_type: e.target.value})} 
                      required 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      {tiposDocumento.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="title" style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>
                      Título do Documento:
                    </label>
                    <input 
                      type="text" 
                      id="title" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      required 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                      placeholder="Ex: Política de Privacidade - Minha Empresa"
                    />
                  </div>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="empresa_nome" style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>
                      Nome da Empresa:
                    </label>
                    <input 
                      type="text" 
                      id="empresa_nome" 
                      value={formData.empresa_nome} 
                      onChange={(e) => setFormData({...formData, empresa_nome: e.target.value})} 
                      required 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                      placeholder="Ex: Minha Empresa Ltda."
                    />
                  </div>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="tipo_dados" style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>
                      Tipos de Dados Tratados:
                    </label>
                    <textarea 
                      id="tipo_dados" 
                      value={formData.tipo_dados} 
                      onChange={(e) => setFormData({...formData, tipo_dados: e.target.value})} 
                      required 
                      rows="3"
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                      placeholder="Ex: Nome, e-mail, telefone, endereço, dados de navegação"
                    />
                  </div>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="base_legal" style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>
                      Base Legal:
                    </label>
                    <select 
                      id="base_legal" 
                      value={formData.base_legal} 
                      onChange={(e) => setFormData({...formData, base_legal: e.target.value})} 
                      required 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      {basesLegais.map(base => (
                        <option key={base.value} value={base.value}>{base.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="finalidade" style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>
                      Finalidade do Tratamento:
                    </label>
                    <textarea 
                      id="finalidade" 
                      value={formData.finalidade} 
                      onChange={(e) => setFormData({...formData, finalidade: e.target.value})} 
                      required 
                      rows="3"
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                      placeholder="Ex: Prestação de serviços, marketing, análise de perfil"
                    />
                  </div>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="compartilhamento" style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>
                      Compartilhamento de Dados:
                    </label>
                    <textarea 
                      id="compartilhamento" 
                      value={formData.compartilhamento} 
                      onChange={(e) => setFormData({...formData, compartilhamento: e.target.value})} 
                      rows="3"
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                      placeholder="Ex: Parceiros comerciais, prestadores de serviço (opcional)"
                    />
                  </div>
                </form>
              }
            />
          )}

          {/* Modal para Versões de Documento */}
          {showVersoesModal && documentoSelecionado && (
            <ModalConfirm
              isOpen={showVersoesModal}
              onClose={() => {
                setShowVersoesModal(false);
                setDocumentoSelecionado(null);
                setVersoes([]);
              }}
              onConfirm={() => {
                setShowVersoesModal(false);
                setDocumentoSelecionado(null);
                setVersoes([]);
              }}
              title={`Versões - ${documentoSelecionado.title}`}
              confirmText="Fechar"
              cancelText={null}
              message={
                <div>
                  {versoes.length === 0 ? (
                    <p>Carregando versões...</p>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8f9fa" }}>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6" }}>Versão</th>
                          <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Data de Criação</th>
                          <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #dee2e6" }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {versoes.map(versao => (
                          <tr key={versao.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px", textAlign: "center" }}>v{versao.version}</td>
                            <td style={{ padding: "12px" }}>{formatarData(versao.created_at)}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                              <button 
                                onClick={() => handleDownload(versao.id)}
                                style={{
                                  padding: "6px 10px",
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer"
                                }}
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              }
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default DocumentosPage;
