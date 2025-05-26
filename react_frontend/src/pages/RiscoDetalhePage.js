// app/react_frontend/src/pages/RiscoDetalhePage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

// Componente para exibir detalhes de uma avaliação
const AvaliacaoInfo = ({ avaliacao }) => {
  if (!avaliacao) {
    return <p>Nenhuma avaliação registrada ainda.</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '4px', backgroundColor: '#f8f9fa' }}>
      <h5 style={{ marginTop: 0 }}>Última Avaliação ({formatDate(avaliacao.data_avaliacao)})</h5>
      <p><strong>Avaliador:</strong> {avaliacao.avaliado_por || 'N/A'}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h6>Risco Inerente (Antes dos Controles)</h6>
          <p><strong>Probabilidade:</strong> {avaliacao.probabilidade || '-'}/5</p>
          <p><strong>Impacto:</strong> {avaliacao.impacto || '-'}/5</p>
          <p><strong>Nível:</strong> {avaliacao.nivel_risco_inerente || '-'}</p>
          <p><em>Justificativa Prob.:</em> {avaliacao.justificativa_probabilidade || '-'}</p>
          <p><em>Justificativa Imp.:</em> {avaliacao.justificativa_impacto || '-'}</p>
        </div>
        <div>
          <h6>Risco Residual (Após Controles)</h6>
          <p><strong>Controles Existentes:</strong> {avaliacao.controles_existentes || 'Nenhum informado'}</p>
          <p><strong>Probabilidade Residual:</strong> {avaliacao.probabilidade_residual !== null ? `${avaliacao.probabilidade_residual}/5` : '-'}</p>
          <p><strong>Impacto Residual:</strong> {avaliacao.impacto_residual !== null ? `${avaliacao.impacto_residual}/5` : '-'}</p>
          <p><strong>Nível Residual:</strong> {avaliacao.nivel_risco_residual !== null ? avaliacao.nivel_risco_residual : '-'}</p>
           <p><em>Justificativa Residual:</em> {avaliacao.justificativa_residual || '-'}</p>
        </div>
      </div>
      {avaliacao.observacoes && <p><strong>Observações:</strong> {avaliacao.observacoes}</p>}
    </div>
  );
};

// Componente para exibir o plano de tratamento
const PlanoTratamentoTable = ({ planos, riscoId }) => {
  if (!planos || planos.length === 0) {
    return <p>Nenhuma ação de tratamento definida.</p>;
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pendente': return { backgroundColor: '#cfe2ff', color: '#0a3678' };
      case 'em_andamento': return { backgroundColor: '#fff3cd', color: '#664d03' };
      case 'concluido': return { backgroundColor: '#d4edda', color: '#155724' };
      case 'cancelado': return { backgroundColor: '#f8d7da', color: '#58151c' };
      default: return { backgroundColor: '#f8f9fa', color: '#212529' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd
', backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Ação</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Responsável</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Prazo</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Conclusão</th>
            {/* Adicionar coluna de ações (editar/excluir) se necessário */}
          </tr>
        </thead>
        <tbody>
          {planos.map(plano => (
            <tr key={plano.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{plano.acao}</td>
              <td style={{ padding: '10px' }}>{plano.responsavel || 'N/A'}</td>
              <td style={{ padding: '10px' }}>{formatDate(plano.prazo)}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  ...getStatusStyle(plano.status),
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {plano.status ? plano.status.replace('_', ' ').toUpperCase() : 'N/A'}
                </span>
              </td>
              <td style={{ padding: '10px' }}>{formatDate(plano.data_conclusao)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RiscoDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [risco, setRisco] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Buscar detalhes do risco
  useEffect(() => {
    const fetchRiscoDetalhes = async () => {
      try {
        setLoading(true);
        // Em produção: fetch(`/api/riscos/${id}`)
        // const response = await fetch(...);
        // const data = await response.json();
        // if (data.success) {
        //   setRisco(data.data);
        // } else {
        //   setError(data.message || 'Erro ao buscar detalhes do risco');
        // }

        // Simulação
        const mockRiscos = [
          { 
            id: 1, nome: "Vazamento de dados de clientes", categoria: "Privacidade", status: "avaliado", data_identificacao: "2025-04-10T10:00:00Z", 
            descricao: "Possibilidade de exposição não autorizada de dados pessoais de clientes armazenados no banco de dados principal.", ativo_relacionado: "Banco de Dados de Clientes", fonte_risco: "Interna/Externa", identificado_por: "Analista de Segurança",
            ultima_avaliacao: { id: 101, data_avaliacao: "2025-05-15T11:00:00Z", avaliado_por: "admin", probabilidade: 4, impacto: 5, nivel_risco_inerente: 20, justificativa_probabilidade: "Sistema legado com vulnerabilidades conhecidas.", justificativa_impacto: "Alto impacto financeiro e reputacional.", controles_existentes: "Firewall, monitoramento básico.", probabilidade_residual: 3, impacto_residual: 4, nivel_risco_residual: 12, justificativa_residual: "Controles reduzem parcialmente a probabilidade.", observacoes: "Requer atenção urgente." },
            planos_tratamento: [
              { id: 201, acao: "Implementar WAF", responsavel: "Equipe Infra", prazo: "2025-06-30T23:59:59Z", status: "pendente", data_conclusao: null },
              { id: 202, acao: "Revisar permissões de acesso ao BD", responsavel: "Equipe DBA", prazo: "2025-06-15T23:59:59Z", status: "em_andamento", data_conclusao: null },
            ]
          },
          { 
            id: 2, nome: "Acesso não autorizado a sistemas internos", categoria: "Segurança", status: "em_tratamento", data_identificacao: "2025-03-15T14:30:00Z",
            descricao: "Risco de acesso indevido por ex-funcionários ou credenciais comprometidas.", ativo_relacionado: "Sistemas Core", fonte_risco: "Interna", identificado_por: "Auditoria Interna",
            ultima_avaliacao: { id: 102, data_avaliacao: "2025-04-01T09:00:00Z", avaliado_por: "admin", probabilidade: 3, impacto: 4, nivel_risco_inerente: 12, controles_existentes: "Política de senhas, processo de offboarding manual.", probabilidade_residual: 2, impacto_residual: 4, nivel_risco_residual: 8, observacoes: "Processo de offboarding precisa ser automatizado." },
            planos_tratamento: [
              { id: 203, acao: "Automatizar desativação de contas no offboarding", responsavel: "Equipe RH/TI", prazo: "2025-07-31T23:59:59Z", status: "em_andamento", data_conclusao: null }
            ]
          },
           { 
            id: 3, nome: "Não conformidade com política de retenção", categoria: "Conformidade", status: "identificado", data_identificacao: "2025-05-20T09:00:00Z",
            descricao: "Dados sendo mantidos por mais tempo que o necessário.", ativo_relacionado: "Arquivos Legados", fonte_risco: "Interna", identificado_por: "DPO",
            ultima_avaliacao: null,
            planos_tratamento: []
          },
        ];
        const foundRisco = mockRiscos.find(r => r.id === parseInt(id));
        
        setTimeout(() => {
          if (foundRisco) {
            setRisco(foundRisco);
          } else {
            setError('Risco não encontrado.');
          }
          setLoading(false);
        }, 500);

      } catch (err) {
        console.error('Erro ao buscar detalhes do risco:', err);
        setError('Não foi possível carregar os detalhes. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchRiscoDetalhes();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando detalhes do risco...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', padding: '2rem' }}>{error}</p>;
  }

  if (!risco) {
    return <p style={{ padding: '2rem' }}>Risco não encontrado.</p>; // Deveria ser pego pelo error, mas como fallback
  }

  const getStatusStyle = (status) => {
      switch (status) {
        case 'identificado': return { backgroundColor: '#cfe2ff', color: '#0a3678' };
        case 'analisado': return { backgroundColor: '#fff3cd', color: '#664d03' };
        case 'avaliado': return { backgroundColor: '#f8d7da', color: '#58151c' };
        case 'em_tratamento': return { backgroundColor: '#d1ecf1', color: '#0c5460' };
        case 'mitigado': return { backgroundColor: '#d4edda', color: '#155724' };
        case 'aceito': return { backgroundColor: '#e2e3e5', color: '#383d41' };
        case 'fechado': return { backgroundColor: '#d6d8db', color: '#1b1e21' };
        default: return { backgroundColor: '#f8f9fa', color: '#212529' };
      }
    };
  const statusStyle = getStatusStyle(risco.status);

  return (
    <div className="risco-detalhe-page">
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
              <h1 style={{ marginTop: 0 }}>{risco.nome}</h1>
              <span style={{
                  ...statusStyle,
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  Status: {risco.status ? risco.status.replace('_', ' ').toUpperCase() : 'N/A'}
              </span>
            </div>
            <div>
              <Link to={`/riscos/${id}/editar`} className="btn btn-warning" style={{ marginRight: '10px' }}>Editar Risco</Link>
              {/* Adicionar botão de excluir/arquivar se necessário */}
            </div>
          </div>

          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <h4>Detalhes do Risco</h4>
            <p><strong>Descrição:</strong> {risco.descricao || '-'}</p>
            <p><strong>Categoria:</strong> {risco.categoria || '-'}</p>
            <p><strong>Ativo Relacionado:</strong> {risco.ativo_relacionado || '-'}</p>
            <p><strong>Fonte do Risco:</strong> {risco.fonte_risco || '-'}</p>
            <p><strong>Identificado por:</strong> {risco.identificado_por || '-'}</p>
            <p><strong>Data de Identificação:</strong> {risco.data_identificacao ? new Date(risco.data_identificacao).toLocaleDateString('pt-BR') : '-'}</p>
            {/* Link para Checklist Item se existir */}
            {risco.checklist_item_id && 
              <p><strong>Item de Checklist Associado:</strong> <Link to={`/checklists`}>Ver Item #{risco.checklist_item_id}</Link></p> // Ajustar link se houver página de detalhe do item
            }
          </div>

          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>Avaliação de Risco</h4>
              <Link to={`/riscos/${id}/avaliar`} className="btn btn-info">Nova Avaliação</Link>
            </div>
            <AvaliacaoInfo avaliacao={risco.ultima_avaliacao} />
            {/* Adicionar link/botão para ver histórico de avaliações */}
          </div>

          <div style={{ marginBottom: '2rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4>Plano de Tratamento</h4>
                <Link to={`/riscos/${id}/tratar`} className="btn btn-success">Adicionar Ação</Link>
             </div>
            <PlanoTratamentoTable planos={risco.planos_tratamento} riscoId={id} />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link to="/riscos">Voltar para a lista de riscos</Link>
          </div>

        </main>
      </div>
    </div>
  );
};

export default RiscoDetalhePage;

