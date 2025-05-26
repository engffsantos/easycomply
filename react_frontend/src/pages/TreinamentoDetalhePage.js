// app/react_frontend/src/pages/TreinamentoDetalhePage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext'; // Para verificar se é admin
import '../App.css';

// Componente para exibir o progresso dos usuários (Admin view)
const UserProgressTable = ({ progressList }) => {
  if (!progressList || progressList.length === 0) {
    return <p>Nenhum usuário atribuído a este treinamento ainda.</p>;
  }

  const getStatusText = (status) => {
    const statusMap = {
      "nao_iniciado": "Não Iniciado",
      "em_andamento": "Em Andamento",
      "concluido": "Concluído",
      "pendente_aprovacao": "Pendente Aprovação"
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Progresso dos Usuários</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Usuário</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Data Início</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Data Conclusão</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Prazo</th>
          </tr>
        </thead>
        <tbody>
          {progressList.map(status => (
            <tr key={status.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{status.usuario || `ID: ${status.usuario_id}`}</td>
              <td style={{ padding: '10px' }}>{getStatusText(status.status)}</td>
              <td style={{ padding: '10px' }}>{formatDate(status.data_inicio)}</td>
              <td style={{ padding: '10px' }}>{formatDate(status.data_conclusao)}</td>
              <td style={{ padding: '10px' }}>{formatDate(status.prazo_conclusao)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TreinamentoDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [treinamento, setTreinamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState([]); // Para admin view
  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;

  // Buscar detalhes do treinamento
  const fetchTreinamentoDetalhes = async () => {
    try {
      setLoading(true);
      // Em produção, usar fetch real
      // const response = await fetch(`/api/treinamentos/${id}`);
      // const data = await response.json();
      // if (data.success) {
      //   setTreinamento(data.data);
      // } else {
      //   setError(data.message || 'Erro ao buscar detalhes do treinamento');
      // }

      // Simulação para desenvolvimento
      const mockTreinamentos = [
        { id: 1, titulo: "Introdução à LGPD", descricao: "Conceitos básicos da Lei Geral de Proteção de Dados. Abrange princípios, bases legais, direitos dos titulares e sanções.", categoria: "LGPD Básico", ativo: true, material_url: "https://example.com/material_lgpd.pdf", duracao_estimada: 60, user_status: { id: 10, status: "concluido", data_inicio: "2025-05-10T10:00:00Z", data_conclusao: "2025-05-11T11:30:00Z", prazo_conclusao: null } },
        { id: 2, titulo: "Segurança da Informação para Colaboradores", descricao: "Práticas essenciais de segurança no dia a dia, como senhas seguras, phishing, uso de dispositivos e redes.", categoria: "Segurança", ativo: true, material_url: null, duracao_estimada: 45, user_status: { id: 11, status: "em_andamento", data_inicio: "2025-05-20T14:00:00Z", data_conclusao: null, prazo_conclusao: "2025-06-15T23:59:59Z" } },
        { id: 3, titulo: "Gestão de Incidentes de Segurança", descricao: "Procedimentos para identificar, conter, erradicar e recuperar de incidentes de segurança da informação.", categoria: "Segurança", ativo: true, material_url: "https://example.com/incidentes.pptx", duracao_estimada: 90, user_status: null },
        { id: 4, titulo: "Direitos dos Titulares de Dados", descricao: "Como identificar e atender às solicitações dos titulares de dados conforme a LGPD.", categoria: "LGPD Avançado", ativo: true, material_url: "https://example.com/direitos_titulares.docx", duracao_estimada: 75, user_status: null },
      ];
      const foundTreinamento = mockTreinamentos.find(t => t.id === parseInt(id));
      
      setTimeout(() => {
        if (foundTreinamento) {
          setTreinamento(foundTreinamento);
        } else {
          setError('Treinamento não encontrado.');
        }
        setLoading(false);
      }, 500);

    } catch (err) {
      console.error('Erro ao buscar detalhes do treinamento:', err);
      setError('Não foi possível carregar os detalhes. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  // Buscar progresso dos usuários (Admin)
  const fetchUserProgress = async () => {
    if (!isAdmin) return;
    try {
      // Em produção, usar fetch real
      // const response = await fetch(`/api/treinamentos/${id}/usuarios`);
      // const data = await response.json();
      // if (data.success) {
      //   setUserProgress(data.data);
      // }

      // Simulação
      const mockProgress = [
        { id: 1, usuario_id: 1, usuario: 'admin', status: 'concluido', data_inicio: '2025-05-10T10:00:00Z', data_conclusao: '2025-05-11T11:30:00Z', prazo_conclusao: null },
        { id: 2, usuario_id: 2, usuario: 'usuario1', status: 'em_andamento', data_inicio: '2025-05-20T14:00:00Z', data_conclusao: null, prazo_conclusao: '2025-06-15T23:59:59Z' },
        { id: 3, usuario_id: 3, usuario: 'usuario2', status: 'nao_iniciado', data_inicio: null, data_conclusao: null, prazo_conclusao: '2025-06-15T23:59:59Z' },
      ];
      setTimeout(() => {
         // Filtra o progresso para o treinamento atual (simulação)
         if (parseInt(id) === 1) setUserProgress([mockProgress[0]]);
         else if (parseInt(id) === 2) setUserProgress(mockProgress);
         else setUserProgress([]);
      }, 600);

    } catch (err) {
      console.error('Erro ao buscar progresso dos usuários:', err);
      // Não define erro crítico, apenas loga
    }
  };

  // Atualizar status do usuário
  const updateUserStatus = async (newStatus) => {
    try {
      // Em produção, usar fetch real
      // const response = await fetch(`/api/treinamentos/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setTreinamento(prev => ({ ...prev, user_status: data.data }));
      //   alert('Status atualizado com sucesso!');
      // } else {
      //   alert(`Erro ao atualizar status: ${data.message}`);
      // }

      // Simulação
      console.log(`Atualizando status para: ${newStatus}`);
      setTimeout(() => {
        setTreinamento(prev => ({
          ...prev,
          user_status: {
            ...(prev.user_status || {}),
            status: newStatus,
            data_inicio: newStatus === 'em_andamento' ? new Date().toISOString() : prev.user_status?.data_inicio,
            data_conclusao: newStatus === 'concluido' ? new Date().toISOString() : null,
          }
        }));
        alert('Status atualizado com sucesso! (Simulação)');
      }, 300);

    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Ocorreu um erro ao tentar atualizar o status.');
    }
  };

  // Efeito para buscar dados ao carregar
  useEffect(() => {
    fetchTreinamentoDetalhes();
    fetchUserProgress();
  }, [id, isAdmin]);

  if (loading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando detalhes do treinamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ padding: '2rem', color: 'red' }}>
        <p>{error}</p>
        <Link to="/treinamentos">Voltar para a lista</Link>
      </div>
    );
  }

  if (!treinamento) {
    return null; // Ou uma mensagem de "não encontrado" mais robusta
  }

  const userStatus = treinamento.user_status;
  const canStart = !userStatus || userStatus.status === 'nao_iniciado';
  const canComplete = userStatus && userStatus.status === 'em_andamento';

  return (
    <div className="treinamento-detalhe-page">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}>
        <Sidebar />
        <main style={{
          flexGrow: 1,
          padding: "2rem",
          marginLeft: "270px",
          backgroundColor: "#fff",
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ marginTop: 0 }}>{treinamento.titulo}</h1>
              {treinamento.categoria && (
                <span style={{
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  {treinamento.categoria}
                </span>
              )}
            </div>
            {isAdmin && (
              <div>
                <Link 
                  to={`/admin/treinamentos/${id}/editar`} 
                  className="btn btn-warning"
                  style={{ marginRight: '10px', textDecoration: 'none' }}
                >
                  Editar
                </Link>
                <Link 
                  to={`/admin/treinamentos/${id}/atribuir`} 
                  className="btn btn-info"
                  style={{ textDecoration: 'none' }}
                >
                  Atribuir Usuários
                </Link>
              </div>
            )}
          </div>

          <p style={{ lineHeight: '1.6' }}>{treinamento.descricao}</p>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Informações Adicionais</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li><strong>Duração Estimada:</strong> {treinamento.duracao_estimada ? `${treinamento.duracao_estimada} minutos` : 'Não informada'}</li>
              <li><strong>Material:</strong> {treinamento.material_url ? <a href={treinamento.material_url} target="_blank" rel="noopener noreferrer">Acessar Material</a> : 'Não disponível'}</li>
            </ul>
          </div>

          {/* Status e Ações do Usuário */}
          <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
            <h4>Meu Progresso</h4>
            <p><strong>Status:</strong> {userStatus?.status ? userStatus.status.replace('_', ' ').toUpperCase() : 'NÃO INICIADO'}</p>
            {userStatus?.data_inicio && <p><strong>Iniciado em:</strong> {new Date(userStatus.data_inicio).toLocaleDateString('pt-BR')}</p>}
            {userStatus?.data_conclusao && <p><strong>Concluído em:</strong> {new Date(userStatus.data_conclusao).toLocaleDateString('pt-BR')}</p>}
            {userStatus?.prazo_conclusao && <p><strong>Prazo para Conclusão:</strong> {new Date(userStatus.prazo_conclusao).toLocaleDateString('pt-BR')}</p>}
            
            <div style={{ marginTop: '1rem' }}>
              {canStart && (
                <button 
                  onClick={() => updateUserStatus('em_andamento')}
                  className="btn btn-primary"
                >
                  Iniciar Treinamento
                </button>
              )}
              {canComplete && (
                <button 
                  onClick={() => updateUserStatus('concluido')}
                  className="btn btn-success"
                >
                  Marcar como Concluído
                </button>
              )}
              {userStatus?.status === 'concluido' && (
                 <p style={{ color: 'green', fontWeight: 'bold' }}>Treinamento concluído!</p>
              )}
            </div>
          </div>

          {/* Visão do Admin: Progresso dos Usuários */}          
          {isAdmin && (
            <UserProgressTable progressList={userProgress} />
          )}

          <div style={{ marginTop: '2rem' }}>
            <Link to="/treinamentos">Voltar para a lista de treinamentos</Link>
          </div>

        </main>
      </div>
    </div>
  );
};

export default TreinamentoDetalhePage;

