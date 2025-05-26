// app/react_frontend/src/pages/AuditLogPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    user_id: '',
    action_type: '',
    entity_type: '',
    start_date: '',
    end_date: '',
    search: '',
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState(null);
  const [showStats, setShowStats] = useState(false);

  // Buscar logs de auditoria
  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Construir query string com filtros
      const queryParams = new URLSearchParams();
      if (filter.user_id) queryParams.append('user_id', filter.user_id);
      if (filter.action_type) queryParams.append('action_type', filter.action_type);
      if (filter.entity_type) queryParams.append('entity_type', filter.entity_type);
      if (filter.start_date) queryParams.append('start_date', filter.start_date);
      if (filter.end_date) queryParams.append('end_date', filter.end_date);
      if (filter.search) queryParams.append('search', filter.search);
      queryParams.append('page', filter.page);
      queryParams.append('per_page', 10);
      
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/audit-logs?${queryParams}`);
      // const data = await response.json();
      // if (data.success) {
      //   setLogs(data.data.logs);
      //   setTotalPages(data.data.pages);
      // }

      // Simulação para desenvolvimento
      const mockLogs = [
        {
          id: 1,
          user_id: 1,
          user: "admin",
          action_type: "login",
          entity_type: "user",
          entity_id: 1,
          description: "Usuário admin realizou login",
          ip_address: "192.168.1.1",
          timestamp: new Date().toISOString(),
          additional_data: null
        },
        {
          id: 2,
          user_id: 1,
          user: "admin",
          action_type: "create",
          entity_type: "checklist",
          entity_id: 5,
          description: "Criação de checklist LGPD Básico",
          ip_address: "192.168.1.1",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          additional_data: JSON.stringify({nome: "LGPD Básico", categoria: "Compliance"})
        },
        {
          id: 3,
          user_id: 2,
          user: "usuario",
          action_type: "update",
          entity_type: "checklist_item",
          entity_id: 12,
          description: "Atualização de item de checklist #12",
          ip_address: "192.168.1.2",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          additional_data: JSON.stringify({status: "concluido", updated_at: new Date().toISOString()})
        },
        {
          id: 4,
          user_id: 1,
          user: "admin",
          action_type: "generate",
          entity_type: "documento",
          entity_id: 3,
          description: "Geração de documento Política de Privacidade",
          ip_address: "192.168.1.1",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          additional_data: null
        },
        {
          id: 5,
          user_id: 2,
          user: "usuario",
          action_type: "upload",
          entity_type: "evidencia",
          entity_id: 7,
          description: "Upload de evidência para item #15",
          ip_address: "192.168.1.2",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          additional_data: JSON.stringify({filename: "contrato_assinado.pdf", size: "1.2MB"})
        }
      ];
      
      // Filtrar logs mock de acordo com os filtros
      let filteredLogs = [...mockLogs];
      
      if (filter.user_id) {
        filteredLogs = filteredLogs.filter(log => log.user_id === parseInt(filter.user_id));
      }
      
      if (filter.action_type) {
        filteredLogs = filteredLogs.filter(log => log.action_type === filter.action_type);
      }
      
      if (filter.entity_type) {
        filteredLogs = filteredLogs.filter(log => log.entity_type === filter.entity_type);
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.description.toLowerCase().includes(searchLower) || 
          (log.additional_data && log.additional_data.toLowerCase().includes(searchLower))
        );
      }
      
      setTimeout(() => {
        setLogs(filteredLogs);
        setTotalPages(Math.ceil(filteredLogs.length / 10));
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Erro ao buscar logs de auditoria:', err);
      setError('Não foi possível carregar os logs de auditoria. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  // Buscar estatísticas
  const fetchStatistics = async () => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch('/api/audit-logs/statistics');
      // const data = await response.json();
      // if (data.success) {
      //   setStatistics(data.data);
      // }

      // Simulação para desenvolvimento
      const mockStatistics = {
        action_counts: {
          "login": 45,
          "logout": 38,
          "create": 67,
          "update": 124,
          "delete": 12,
          "read": 356,
          "export": 8,
          "generate": 23,
          "upload": 41,
          "download": 29
        },
        entity_counts: {
          "user": 83,
          "checklist": 98,
          "checklist_item": 187,
          "evidencia": 70,
          "documento": 52,
          "system": 45
        },
        user_counts: {
          "1": 245,
          "2": 178,
          "3": 87,
          "4": 65,
          "5": 42
        },
        period_stats: [
          { date: "2025-05-22", count: 87 },
          { date: "2025-05-21", count: 65 },
          { date: "2025-05-20", count: 72 },
          { date: "2025-05-19", count: 58 },
          { date: "2025-05-18", count: 43 },
          { date: "2025-05-17", count: 31 },
          { date: "2025-05-16", count: 29 }
        ]
      };
      
      setTimeout(() => {
        setStatistics(mockStatistics);
      }, 800);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  };

  // Efeito para buscar logs quando os filtros mudarem
  useEffect(() => {
    fetchLogs();
  }, [filter]);

  // Efeito para buscar estatísticas quando a página for carregada
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Exportar logs
  const exportLogs = (format) => {
    // Construir query string com filtros
    const queryParams = new URLSearchParams();
    if (filter.user_id) queryParams.append('user_id', filter.user_id);
    if (filter.action_type) queryParams.append('action_type', filter.action_type);
    if (filter.entity_type) queryParams.append('entity_type', filter.entity_type);
    if (filter.start_date) queryParams.append('start_date', filter.start_date);
    if (filter.end_date) queryParams.append('end_date', filter.end_date);
    if (filter.search) queryParams.append('search', filter.search);
    queryParams.append('format', format);
    
    // Em produção, redirecionar para a URL de exportação
    // window.location.href = `/api/audit-logs/export?${queryParams}`;
    
    // Simulação para desenvolvimento
    alert(`Exportando logs em formato ${format}...`);
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Função para obter texto do tipo de ação
  const getActionTypeText = (type) => {
    const actionTypes = {
      "create": "Criação",
      "read": "Leitura",
      "update": "Atualização",
      "delete": "Exclusão",
      "login": "Login",
      "logout": "Logout",
      "export": "Exportação",
      "generate": "Geração",
      "upload": "Upload",
      "download": "Download"
    };
    
    return actionTypes[type] || type;
  };

  // Função para obter texto do tipo de entidade
  const getEntityTypeText = (type) => {
    const entityTypes = {
      "user": "Usuário",
      "checklist": "Checklist",
      "checklist_item": "Item de Checklist",
      "evidencia": "Evidência",
      "documento": "Documento",
      "notification": "Notificação",
      "system": "Sistema"
    };
    
    return entityTypes[type] || type;
  };

  // Função para obter cor com base no tipo de ação
  const getActionColor = (action) => {
    const actionColors = {
      "create": "#28a745", // Verde
      "read": "#17a2b8", // Azul claro
      "update": "#ffc107", // Amarelo
      "delete": "#dc3545", // Vermelho
      "login": "#007bff", // Azul
      "logout": "#6c757d", // Cinza
      "export": "#20c997", // Verde água
      "generate": "#6f42c1", // Roxo
      "upload": "#fd7e14", // Laranja
      "download": "#e83e8c" // Rosa
    };
    
    return actionColors[action] || "#6c757d";
  };

  return (
    <div className="audit-log-page">
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
            <h1>Logs de Auditoria</h1>
            <div>
              <button 
                onClick={() => setShowStats(!showStats)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                {showStats ? "Ocultar Estatísticas" : "Mostrar Estatísticas"}
              </button>
              <button 
                onClick={() => exportLogs('csv')}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                Exportar CSV
              </button>
              <button 
                onClick={() => exportLogs('json')}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Exportar JSON
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          {showStats && statistics && (
            <div style={{ marginBottom: "2rem" }}>
              <h2>Estatísticas de Atividades</h2>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
                {/* Estatísticas por tipo de ação */}
                <div style={{ 
                  flex: "1 1 300px", 
                  padding: "15px", 
                  backgroundColor: "#f8f9fa", 
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <h3>Ações por Tipo</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {Object.entries(statistics.action_counts).map(([action, count]) => (
                      <div key={action} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ 
                          width: "15px", 
                          height: "15px", 
                          backgroundColor: getActionColor(action),
                          marginRight: "10px",
                          borderRadius: "3px"
                        }}></div>
                        <span style={{ flex: 1 }}>{getActionTypeText(action)}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Estatísticas por tipo de entidade */}
                <div style={{ 
                  flex: "1 1 300px", 
                  padding: "15px", 
                  backgroundColor: "#f8f9fa", 
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <h3>Entidades Afetadas</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {Object.entries(statistics.entity_counts).map(([entity, count]) => (
                      <div key={entity} style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ flex: 1 }}>{getEntityTypeText(entity)}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Estatísticas por período */}
                <div style={{ 
                  flex: "1 1 300px", 
                  padding: "15px", 
                  backgroundColor: "#f8f9fa", 
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <h3>Atividades por Dia</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {statistics.period_stats.map((day) => (
                      <div key={day.date} style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ flex: 1 }}>{new Date(day.date).toLocaleDateString('pt-BR')}</span>
                        <strong>{day.count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div style={{ 
            marginBottom: "2rem", 
            padding: "15px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginTop: 0 }}>Filtros</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div>
                <label htmlFor="userFilter" style={{ display: "block", marginBottom: "5px" }}>Usuário:</label>
                <select 
                  id="userFilter"
                  value={filter.user_id}
                  onChange={(e) => setFilter({ ...filter, user_id: e.target.value, page: 1 })}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", width: "150px" }}
                >
                  <option value="">Todos</option>
                  <option value="1">admin</option>
                  <option value="2">usuario</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="actionFilter" style={{ display: "block", marginBottom: "5px" }}>Tipo de Ação:</label>
                <select 
                  id="actionFilter"
                  value={filter.action_type}
                  onChange={(e) => setFilter({ ...filter, action_type: e.target.value, page: 1 })}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", width: "150px" }}
                >
                  <option value="">Todos</option>
                  <option value="create">Criação</option>
                  <option value="read">Leitura</option>
                  <option value="update">Atualização</option>
                  <option value="delete">Exclusão</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="export">Exportação</option>
                  <option value="generate">Geração</option>
                  <option value="upload">Upload</option>
                  <option value="download">Download</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="entityFilter" style={{ display: "block", marginBottom: "5px" }}>Tipo de Entidade:</label>
                <select 
                  id="entityFilter"
                  value={filter.entity_type}
                  onChange={(e) => setFilter({ ...filter, entity_type: e.target.value, page: 1 })}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", width: "150px" }}
                >
                  <option value="">Todos</option>
                  <option value="user">Usuário</option>
                  <option value="checklist">Checklist</option>
                  <option value="checklist_item">Item de Checklist</option>
                  <option value="evidencia">Evidência</option>
                  <option value="documento">Documento</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="startDateFilter" style={{ display: "block", marginBottom: "5px" }}>Data Inicial:</label>
                <input 
                  type="date"
                  id="startDateFilter"
                  value={filter.start_date}
                  onChange={(e) => setFilter({ ...filter, start_date: e.target.value, page: 1 })}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", width: "150px" }}
                />
              </div>
              
              <div>
                <label htmlFor="endDateFilter" style={{ display: "block", marginBottom: "5px" }}>Data Final:</label>
                <input 
                  type="date"
                  id="endDateFilter"
                  value={filter.end_date}
                  onChange={(e) => setFilter({ ...filter, end_date: e.target.value, page: 1 })}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", width: "150px" }}
                />
              </div>
              
              <div>
                <label htmlFor="searchFilter" style={{ display: "block", marginBottom: "5px" }}>Busca:</label>
                <input 
                  type="text"
                  id="searchFilter"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value, page: 1 })}
                  placeholder="Buscar na descrição..."
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", width: "200px" }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: "15px" }}>
              <button 
                onClick={() => setFilter({
                  user_id: '',
                  action_type: '',
                  entity_type: '',
                  start_date: '',
                  end_date: '',
                  search: '',
                  page: 1
                })}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Limpar Filtros
              </button>
            </div>
          </div>

          {/* Lista de Logs */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Carregando logs de auditoria...</p>
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
                onClick={fetchLogs}
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
          ) : logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Nenhum log de auditoria encontrado.</p>
            </div>
          ) : (
            <div className="logs-list">
              {logs.map(log => (
                <div 
                  key={log.id}
                  style={{
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    borderLeft: `5px solid ${getActionColor(log.action_type)}`,
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0" }}>{log.description}</h3>
                      
                      <div style={{ display: "flex", gap: "1rem", fontSize: "0.9rem", color: "#6c757d", flexWrap: "wrap" }}>
                        <span>
                          <strong>Usuário:</strong> {log.user || "Sistema"}
                        </span>
                        <span>
                          <strong>Ação:</strong> {getActionTypeText(log.action_type)}
                        </span>
                        <span>
                          <strong>Entidade:</strong> {getEntityTypeText(log.entity_type)}
                          {log.entity_id && ` #${log.entity_id}`}
                        </span>
                        <span>
                          <strong>IP:</strong> {log.ip_address || "N/A"}
                        </span>
                        <span>
                          <strong>Data/Hora:</strong> {formatDate(log.timestamp)}
                        </span>
                      </div>
                      
                      {log.additional_data && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <details>
                            <summary style={{ cursor: "pointer", color: "#007bff" }}>Dados adicionais</summary>
                            <pre style={{ 
                              marginTop: "0.5rem", 
                              padding: "0.5rem", 
                              backgroundColor: "#f8f9fa", 
                              borderRadius: "4px",
                              fontSize: "0.85rem",
                              overflowX: "auto"
                            }}>
                              {typeof log.additional_data === 'string' 
                                ? log.additional_data 
                                : JSON.stringify(log.additional_data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ 
                    position: "absolute", 
                    top: "10px", 
                    right: "10px",
                    backgroundColor: getActionColor(log.action_type),
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}>
                    {getActionTypeText(log.action_type).toUpperCase()}
                  </div>
                </div>
              ))}
              
              {/* Paginação */}
              {totalPages > 1 && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  marginTop: "2rem",
                  gap: "0.5rem"
                }}>
                  <button 
                    onClick={() => setFilter({ ...filter, page: Math.max(1, filter.page - 1) })}
                    disabled={filter.page === 1}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: filter.page === 1 ? "#e9ecef" : "#007bff",
                      color: filter.page === 1 ? "#6c757d" : "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: filter.page === 1 ? "not-allowed" : "pointer"
                    }}
                  >
                    Anterior
                  </button>
                  
                  {[...Array(totalPages).keys()].map(page => (
                    <button 
                      key={page + 1}
                      onClick={() => setFilter({ ...filter, page: page + 1 })}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: filter.page === page + 1 ? "#007bff" : "#e9ecef",
                        color: filter.page === page + 1 ? "white" : "#212529",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setFilter({ ...filter, page: Math.min(totalPages, filter.page + 1) })}
                    disabled={filter.page === totalPages}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: filter.page === totalPages ? "#e9ecef" : "#007bff",
                      color: filter.page === totalPages ? "#6c757d" : "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: filter.page === totalPages ? "not-allowed" : "pointer"
                    }}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AuditLogPage;
