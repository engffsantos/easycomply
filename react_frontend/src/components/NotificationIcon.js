// app/react_frontend/src/components/NotificationIcon.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationIcon = () => {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Buscar contagem de notificações não lidas
  const fetchNotificationCount = async () => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch('/api/notifications/count');
      // const data = await response.json();
      // if (data.success) {
      //   setCount(data.data.count);
      // }

      // Simulação para desenvolvimento
      setCount(Math.floor(Math.random() * 5) + 1); // Simula 1-5 notificações
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações:', error);
    }
  };

  // Buscar notificações recentes
  const fetchRecentNotifications = async () => {
    try {
      setLoading(true);
      // Em produção, usar fetch real para a API
      // const response = await fetch('/api/notifications?per_page=5&status=nao_lida');
      // const data = await response.json();
      // if (data.success) {
      //   setNotifications(data.data.notifications);
      // }

      // Simulação para desenvolvimento
      const mockNotifications = [
        {
          id: 1,
          title: 'URGENTE: Item vence hoje',
          message: 'O item "Política de Privacidade" do checklist "LGPD Inicial" vence hoje.',
          notification_type: 'vencimento_proximo',
          priority: 'alta',
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
          created_at: new Date(Date.now() - 7200000).toISOString(),
          reference_type: 'evidencia',
          reference_id: 5
        }
      ];
      
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar notificações recentes:', error);
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId) => {
    try {
      // Em produção, usar fetch real para a API
      // const response = await fetch(`/api/notifications/${notificationId}/read`, {
      //   method: 'PUT'
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchNotificationCount();
      //   setNotifications(notifications.filter(n => n.id !== notificationId));
      // }

      // Simulação para desenvolvimento
      setCount(prevCount => Math.max(0, prevCount - 1));
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
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
      //   fetchNotificationCount();
      //   setNotifications([]);
      // }

      // Simulação para desenvolvimento
      setCount(0);
      setNotifications([]);
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  };

  // Navegar para a página de notificações
  const goToNotificationsPage = () => {
    setShowDropdown(false);
    navigate('/notifications');
  };

  // Navegar para o item referenciado
  const goToReference = (notification) => {
    setShowDropdown(false);
    markAsRead(notification.id);
    
    if (notification.reference_type === 'checklist_item') {
      navigate(`/checklists?item=${notification.reference_id}`);
    } else if (notification.reference_type === 'evidencia') {
      navigate(`/checklists?evidencia=${notification.reference_id}`);
    } else if (notification.reference_type === 'documento') {
      navigate(`/documentos?id=${notification.reference_id}`);
    }
  };

  // Efeito para buscar contagem de notificações periodicamente
  useEffect(() => {
    fetchNotificationCount();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchNotificationCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Efeito para buscar notificações quando o dropdown é aberto
  useEffect(() => {
    if (showDropdown) {
      fetchRecentNotifications();
    }
  }, [showDropdown]);

  // Efeito para fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Função para formatar data relativa
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'agora';
    } else if (diffMin < 60) {
      return `${diffMin} min atrás`;
    } else if (diffHour < 24) {
      return `${diffHour} h atrás`;
    } else {
      return `${diffDay} dia(s) atrás`;
    }
  };

  return (
    <div className="notification-icon" style={{ position: 'relative' }}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px'
        }}
      >
        <i className="fas fa-bell" style={{ fontSize: '1.5rem', color: '#333' }}></i>
        {count > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {count}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            width: '350px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            zIndex: 1000,
            maxHeight: '500px',
            overflowY: 'auto'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 15px',
            borderBottom: '1px solid #eee'
          }}>
            <h3 style={{ margin: 0 }}>Notificações</h3>
            {count > 0 && (
              <button 
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          
          <div>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Carregando notificações...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Não há notificações novas.</p>
              </div>
            ) : (
              <>
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    style={{
                      padding: '15px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      backgroundColor: '#f9f9f9',
                      position: 'relative'
                    }}
                  >
                    <div 
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '5px',
                        backgroundColor: getPriorityColor(notification.priority)
                      }}
                    ></div>
                    <div style={{ marginLeft: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{notification.title}</h4>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6c757d',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#555' }}>
                        {notification.message}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: '#6c757d'
                      }}>
                        <span>{formatRelativeTime(notification.created_at)}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            goToReference(notification);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Ver detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div style={{ padding: '10px', textAlign: 'center' }}>
                  <button 
                    onClick={goToNotificationsPage}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007bff',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Ver todas as notificações
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
