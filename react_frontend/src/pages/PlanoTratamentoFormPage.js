// app/react_frontend/src/pages/PlanoTratamentoFormPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const PlanoTratamentoFormPage = () => {
  const { id: riscoId, planoId } = useParams(); // planoId se estiver editando
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [riscoNome, setRiscoNome] = useState('');
  const [usuarios, setUsuarios] = useState([]); // Para selecionar responsável
  const [formData, setFormData] = useState({
    acao: '',
    responsavel_id: '',
    prazo: '', // Formato YYYY-MM-DD
    status: 'pendente', // Status inicial padrão
    observacoes: '',
    custo_estimado: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Buscar nome do risco, lista de usuários e dados do plano (se editando)
  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      setError(null);
      try {
        // 1. Buscar nome do risco (Simulação)
        const mockRiscos = [
          { id: 1, nome: "Vazamento de dados de clientes" },
          { id: 2, nome: "Acesso não autorizado a sistemas internos" },
        ];
        const foundRisco = mockRiscos.find(r => r.id === parseInt(riscoId));
        if (foundRisco) {
          setRiscoNome(foundRisco.nome);
        } else {
          throw new Error('Risco não encontrado.');
        }

        // 2. Buscar lista de usuários (Simulação)
        // Em produção: fetch('/api/users')
        const mockUsers = [
          { id: 1, username: 'admin', full_name: 'Administrador' },
          { id: 2, username: 'usuario1', full_name: 'Usuário Um' },
          { id: 3, username: 'usuario2', full_name: 'Usuário Dois' },
        ];
        setUsuarios(mockUsers);

        // 3. Se for edição, buscar dados do plano (Simulação)
        if (planoId) {
          setIsEditing(true);
          // Em produção: fetch(`/api/planos-tratamento/${planoId}`)
          const mockPlanos = [
            { id: 201, risco_id: 1, acao: "Implementar WAF", responsavel_id: 2, prazo: "2025-06-30T00:00:00Z", status: "pendente", observacoes: "Verificar compatibilidade", custo_estimado: 5000.00 },
            { id: 203, risco_id: 2, acao: "Automatizar desativação", responsavel_id: 1, prazo: "2025-07-31T00:00:00Z", status: "em_andamento", observacoes: "", custo_estimado: 1500.00 },
          ];
          const foundPlano = mockPlanos.find(p => p.id === parseInt(planoId));
          if (foundPlano) {
            setFormData({
              acao: foundPlano.acao || '',
              responsavel_id: foundPlano.responsavel_id || '',
              prazo: foundPlano.prazo ? foundPlano.prazo.split('T')[0] : '', // Formato YYYY-MM-DD
              status: foundPlano.status || 'pendente',
              observacoes: foundPlano.observacoes || '',
              custo_estimado: foundPlano.custo_estimado || ''
            });
          } else {
            throw new Error('Plano de tratamento não encontrado para edição.');
          }
        }

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message || "Erro ao carregar dados.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [riscoId, planoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acao) {
      setError("A descrição da ação é obrigatória.");
      return;
    }
    if (formData.custo_estimado && isNaN(parseFloat(formData.custo_estimado))) {
        setError("Custo estimado deve ser um número.");
        return;
    }

    setError(null);
    setLoading(true);

    const payload = {
      ...formData,
      responsavel_id: formData.responsavel_id ? parseInt(formData.responsavel_id) : null,
      custo_estimado: formData.custo_estimado ? parseFloat(formData.custo_estimado) : null,
      // Backend espera ISO string para prazo
      prazo: formData.prazo ? new Date(formData.prazo + 'T00:00:00').toISOString() : null 
    };

    const url = isEditing ? `/api/planos-tratamento/${planoId}` : `/api/riscos/${riscoId}/planos-tratamento`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      // Em produção: fetch(url, { method, ... })
      // const response = await fetch(url, {
      //   method: method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      // const data = await response.json();
      // setLoading(false);
      // if (data.success) {
      //   alert(`Ação ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`);
      //   navigate(`/riscos/${riscoId}`);
      // } else {
      //   setError(data.message || `Erro ao ${isEditing ? 'atualizar' : 'adicionar'} ação.`);
      // }

      // Simulação
      console.log(`Enviando ${method} para ${url}:`, payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      alert(`Ação ${isEditing ? 'atualizada' : 'adicionada'} com sucesso! (Simulação)`);
      navigate(`/riscos/${riscoId}`);

    } catch (err) {
      console.error('Erro ao salvar ação:', err);
      setError('Erro de rede ao salvar ação.');
      setLoading(false);
    }
  };

  if (fetchingData) {
    return <p>Carregando...</p>;
  }

  // Lista de Status (pode vir do backend ou ser fixa)
  const statusOptions = [
    "pendente", "em_andamento", "concluido", "cancelado"
  ];

  return (
    <div className="plano-tratamento-form-page">
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
          <h1>{isEditing ? 'Editar Ação de Tratamento' : 'Adicionar Ação de Tratamento'}</h1>
          <h3 style={{ fontWeight: 'normal', marginBottom: '2rem' }}>Risco: {riscoNome || 'Carregando...'}</h3>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="acao" style={{ display: 'block', marginBottom: '5px' }}>Ação de Tratamento: *</label>
              <textarea
                id="acao"
                name="acao"
                value={formData.acao}
                onChange={handleChange}
                rows="4"
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label htmlFor="responsavel_id" style={{ display: 'block', marginBottom: '5px' }}>Responsável (Opcional):</label>
                <select
                  id="responsavel_id"
                  name="responsavel_id"
                  value={formData.responsavel_id}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Selecione...</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="prazo" style={{ display: 'block', marginBottom: '5px' }}>Prazo (Opcional):</label>
                <input
                  type="date"
                  id="prazo"
                  name="prazo"
                  value={formData.prazo}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label htmlFor="status" style={{ display: 'block', marginBottom: '5px' }}>Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#e9ecef' }}
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
               <div>
                <label htmlFor="custo_estimado" style={{ display: 'block', marginBottom: '5px' }}>Custo Estimado (Opcional):</label>
                <input
                  type="number"
                  id="custo_estimado"
                  name="custo_estimado"
                  value={formData.custo_estimado}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="observacoes" style={{ display: 'block', marginBottom: '5px' }}>Observações:</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="3"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar Ação' : 'Adicionar Ação')}
              </button>
              <Link to={`/riscos/${riscoId}`} className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default PlanoTratamentoFormPage;

