// app/react_frontend/src/pages/NotificationPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../App.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);

  // Buscar notificações
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Construir query string com filtros
      const queryParams = new URLSearchParams();
      if (filter.type) queryParams.append('type', filter.type);
      if (filter.status) queryParams.append('status', filter.status);
      queryParams.append('page', filter.page);
      queryParams.append('per_page', 10);
      
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/notifications?${queryParams}`);
      // const data = await response.json();
      // if (data.success) {
      //   setNotifications(data.data.notifications);
      //   setTotalPages(data.data.pages);
      // }

      // Simulação para desenvolvimento
      const mockNotifications = [
        {
          id: 1,
          title: 'URGENTE: Item vence hoje',
          message: 'O item "Política de Privacidade" do checklist "LGPD Inicial" vence hoje.',
          notification_type: 'vencimento_proximo',
          priority: 'alta',
          status: 'nao_lida',
          created_at: new Date().toISOString(),
          reference_type: 'checklist_item',
          reference_id: 1
        },
        {
          id: 2,
          title: 'Item vence em 3 dias',
          message: 'O item "Mapeamento de dados" do checklist "LGPD Inicial" vence em 3 dias.',
          notification_type: 'vencimento_proximo',
          priority: 'media',
          status: 'nao_lida',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          reference_type: 'checklist_item',
          reference_id: 2
        },
        {
          id: 3,
          title: 'Nova evidência adicionada',
          message: 'Uma nova evidência foi adicionada ao item "Consentimento".',
          notification_type: 'evidencia_adicionada',
          priority: 'baixa',
          status: 'nao_lida',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          reference_type: 'evidencia',
          reference_id: 5
        },
        {
          id: 4,
          title: 'Documento gerado',
          message: 'Um novo documento "Política de Privacidade v2" foi gerado.',
          notification_type: 'documento_gerado',
          priority: 'media',
          status: 'lida',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          read_at: new Date(Date.now() - 43200000).toISOString(),
          reference_type: 'documento',
          reference_id: 7
        },
        {
          id: 5,
          title: 'Item vence em 7 dias',
          message: 'O item "Treinamento LGPD" do checklist "LGPD Inicial" vence em 7 dias.',
          notification_type: 'vencimento_proximo',
          priority: 'baixa',
          status: 'arquivada',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          reference_type: 'checklist_item',
          reference_id: 8
        }
      ];
      
      // Filtrar notificações mock de acordo com os filtros
      let filteredNotifications = [...mockNotifications];
      
      if (filter.type) {
        filteredNotifications = filteredNotifications.filter(n => n.notification_type === filter.type);
      }
      
      if (filter.status) {
        filteredNotifications = filteredNotifications.filter(n => n.status === filter.status);
      }
      
      setTimeout(() => {
        setNotifications(filteredNotifications);
        setTotalPages(Math.ceil(filteredNotifications.length / 10));
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      setError('Não foi possível carregar as notificações. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  // Efeito para buscar notificações quando os filtros mudarem
  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // Marcar notificação como lida
  const markAsRead = async (notificationId) => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/notifications/${notificationId}/read`, {
      //   method: 'PUT'
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchNotifications();
      // }

      // Simulação para desenvolvimento
      setNotifications(notifications.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'lida', read_at: new Date().toISOString() } 
          : n
      ));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar notificação como não lida
  const markAsUnread = async (notificationId) => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/notifications/${notificationId}/unread`, {
      //   method: 'PUT'
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchNotifications();
      // }

      // Simulação para desenvolvimento
      setNotifications(notifications.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'nao_lida', read_at: null } 
          : n
      ));
    } catch (error) {
      console.error('Erro ao marcar notificação como não lida:', error);
    }
  };

  // Arquivar notificação
  const archiveNotification = async (notificationId) => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/notifications/${notificationId}/archive`, {
      //   method: 'PUT'
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchNotifications();
      // }

      // Simulação para desenvolvimento
      setNotifications(notifications.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'arquivada' } 
          : n
      ));
    } catch (error) {
      console.error('Erro ao arquivar notificação:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch('/api/notifications/read-all', {
      //   method: 'POST'
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchNotifications();
      // }

      // Simulação para desenvolvimento
      setNotifications(notifications.map(n => 
        n.status === 'nao_lida'
          ? { ...n, status: 'lida', read_at: new Date().toISOString() } 
          : n
      ));
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  };

  // Navegar para o item referenciado
  const goToReference = (notification) => {
    markAsRead(notification.id);
    
    // Em produção, implementar navegação real
    if (notification.reference_type === 'checklist_item') {
      window.location.href = `/checklists?item=${notification.reference_id}`;
    } else if (notification.reference_type === 'evidencia') {
      window.location.href = `/checklists?evidencia=${notification.reference_id}`;
    } else if (notification.reference_type === 'documento') {
      window.location.href = `/documentos?id=${notification.reference_id}`;
    }
  };

  // Função para obter cor com base na prioridade
  const getPriorityColor = (priority) => {
    switch (priority) {
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

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter texto do tipo de notificação
  const getNotificationTypeText = (type) => {
    switch (type) {
      case 'vencimento_proximo':
        return 'Vencimento Próximo';
      case 'item_atualizado':
        return 'Item Atualizado';
      case 'evidencia_adicionada':
        return 'Evidência Adicionada';
      case 'documento_gerado':
        return 'Documento Gerado';
      default:
        return type;
    }
  };

  return (
    <div className="notification-page">
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
            <h1>Notificações</h1>
            {notifications.some(n => n.status === 'nao_lida') && (
              <button 
                onClick={markAllAsRead}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Filtros */}
          <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
            <div>
              <label htmlFor="typeFilter" style={{ marginRight: "0.5rem" }}>Tipo:</label>
              <select 
                id="typeFilter"
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value, page: 1 })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="">Todos</option>
                <option value="vencimento_proximo">Vencimento Próximo</option>
                <option value="item_atualizado">Item Atualizado</option>
                <option value="evidencia_adicionada">Evidência Adicionada</option>
                <option value="documento_gerado">Documento Gerado</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="statusFilter" style={{ marginRight: "0.5rem" }}>Status:</label>
              <select 
                id="statusFilter"
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="">Todos</option>
                <option value="nao_lida">Não lidas</option>
                <option value="lida">Lidas</option>
                <option value="arquivada">Arquivadas</option>
              </select>
            </div>
            
            <button 
              onClick={() => setFilter({ type: '', status: '', page: 1 })}
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

          {/* Lista de Notificações */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Carregando notificações...</p>
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
                onClick={fetchNotifications}
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
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Nenhuma notificação encontrada.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  style={{
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    backgroundColor: notification.status === 'nao_lida' ? "#f8f9fa" : "#fff",
                    borderLeft: `5px solid ${getPriorityColor(notification.priority)}`,
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0" }}>{notification.title}</h3>
                      <p style={{ margin: "0 0 1rem 0", color: "#555" }}>{notification.message}</p>
                      
                      <div style={{ display: "flex", gap: "1rem", fontSize: "0.9rem", color: "#6c757d" }}>
                        <span>
                          <strong>Tipo:</strong> {getNotificationTypeText(notification.notification_type)}
                        </span>
                        <span>
                          <strong>Criado em:</strong> {formatDate(notification.created_at)}
                        </span>
                        {notification.read_at && (
                          <span>
                            <strong>Lido em:</strong> {formatDate(notification.read_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {notification.status === 'nao_lida' ? (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          title="Marcar como lida"
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          <i className="fas fa-check"></i> Lida
                        </button>
                      ) : notification.status === 'lida' ? (
                        <button 
                          onClick={() => markAsUnread(notification.id)}
                          title="Marcar como não lida"
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#17a2b8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          <i className="fas fa-envelope"></i> Não lida
                        </button>
                      ) : null}
                      
                      {notification.status !== 'arquivada' && (
                        <button 
                          onClick={() => archiveNotification(notification.id)}
                          title="Arquivar"
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          <i className="fas fa-archive"></i> Arquivar
                        </button>
                      )}
                      
                      {notification.reference_type && notification.reference_id && (
                        <button 
                          onClick={() => goToReference(notification)}
                          title="Ver detalhes"
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          <i className="fas fa-external-link-alt"></i> Ver detalhes
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ 
                    position: "absolute", 
                    top: "10px", 
                    right: "10px",
                    backgroundColor: getPriorityColor(notification.priority),
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}>
                    {notification.priority.toUpperCase()}
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

export default NotificationPage;
