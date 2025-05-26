// app/react_frontend/src/pages/TreinamentoAtribuicaoPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const TreinamentoAtribuicaoPage = () => {
  const { id: treinamentoId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;

  const [treinamentoTitulo, setTreinamentoTitulo] = useState('');
  const [usuarios, setUsuarios] = useState([]); // Lista de todos os usuários para seleção
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [prazoConclusao, setPrazoConclusao] = useState(''); // Formato YYYY-MM-DD
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Buscar título do treinamento e lista de usuários
  useEffect(() => {
    if (!isAdmin) {
      navigate('/treinamentos');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar título do treinamento (simulação)
        const mockTreinamentos = [
          { id: 1, titulo: "Introdução à LGPD" },
          { id: 2, titulo: "Segurança da Informação para Colaboradores" },
          { id: 3, titulo: "Gestão de Incidentes de Segurança" },
          { id: 4, titulo: "Direitos dos Titulares de Dados" },
        ];
        const foundTreinamento = mockTreinamentos.find(t => t.id === parseInt(treinamentoId));
        if (foundTreinamento) {
          setTreinamentoTitulo(foundTreinamento.titulo);
        } else {
          throw new Error('Treinamento não encontrado.');
        }

        // Buscar lista de usuários (simulação)
        // Em produção: fetch('/api/users')
        const mockUsers = [
          { id: 1, username: 'admin', full_name: 'Administrador' },
          { id: 2, username: 'usuario1', full_name: 'Usuário Um' },
          { id: 3, username: 'usuario2', full_name: 'Usuário Dois' },
          { id: 4, username: 'usuario3', full_name: 'Usuário Três' },
        ];
        setUsuarios(mockUsers);

      } catch (err) {
        console.error("Erro ao carregar dados para atribuição:", err);
        setError(err.message || "Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate, treinamentoId]);

  const handleUserSelectionChange = (e) => {
    const userId = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(usuarios.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      setError("Selecione pelo menos um usuário.");
      return;
    }
    setError(null);
    setSubmitting(true);

    // Formata a data para ISO String se houver prazo
    let prazoISO = null;
    if (prazoConclusao) {
      try {
        // Adiciona T00:00:00 para garantir que seja início do dia e converte para UTC
        prazoISO = new Date(prazoConclusao + 'T00:00:00').toISOString();
      } catch (dateError) {
        setError("Formato de data inválido para o prazo.");
        setSubmitting(false);
        return;
      }
    }

    try {
      // Em produção: fetch(`/api/treinamentos/${treinamentoId}/atribuir`, ...)
      console.log("Atribuindo treinamento:", treinamentoId);
      console.log("Usuários:", selectedUserIds);
      console.log("Prazo:", prazoISO);

      // Simulação
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const response = await fetch(...);
      // const data = await response.json();
      // if (data.success) {
      //   alert(`Atribuição processada: ${data.data.assigned_count} usuários atribuídos.`);
      //   navigate(`/treinamentos/${treinamentoId}`);
      // } else {
      //   setError(data.message || "Erro ao processar atribuição.");
      // }

      alert(`Atribuição processada com sucesso! (Simulação)`);
      navigate(`/treinamentos/${treinamentoId}`);

    } catch (err) {
      console.error("Erro ao atribuir treinamento:", err);
      setError("Erro de rede ao tentar atribuir treinamento.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return <p>Acesso não autorizado.</p>;
  }

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className="treinamento-atribuicao-page">
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
          <h1>Atribuir Treinamento</h1>
          <h3 style={{ fontWeight: 'normal', marginBottom: '2rem' }}>{treinamentoTitulo || 'Carregando título...'}</h3>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4>Selecionar Usuários</h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                <div style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedUserIds.length === usuarios.length && usuarios.length > 0}
                      style={{ marginRight: '8px' }}
                    />
                    <strong>Selecionar Todos</strong>
                  </label>
                </div>
                {usuarios.map(u => (
                  <div key={u.id} style={{ marginBottom: '5px' }}>
                    <label>
                      <input
                        type="checkbox"
                        value={u.id}
                        checked={selectedUserIds.includes(u.id)}
                        onChange={handleUserSelectionChange}
                        style={{ marginRight: '8px' }}
                      />
                      {u.full_name || u.username} ({u.username})
                    </label>
                  </div>
                ))}
              </div>
              <small>{selectedUserIds.length} usuário(s) selecionado(s)</small>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="prazoConclusao" style={{ display: 'block', marginBottom: '5px' }}>Prazo para Conclusão (Opcional):</label>
              <input
                type="date"
                id="prazoConclusao"
                value={prazoConclusao}
                onChange={(e) => setPrazoConclusao(e.target.value)}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={submitting || selectedUserIds.length === 0}
                className="btn btn-primary"
              >
                {submitting ? 'Atribuindo...' : 'Atribuir Treinamento'}
              </button>
              <Link to={`/treinamentos/${treinamentoId}`} className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default TreinamentoAtribuicaoPage;

