// app/react_frontend/src/pages/RiscoFormPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const RiscoFormPage = () => {
  const { id } = useParams(); // Se id existir, estamos editando
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    ativo_relacionado: '',
    fonte_risco: '',
    checklist_item_id: '', // Opcional
    status: 'identificado' // Status inicial padrão
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Se for edição, busca os dados do risco
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      // Em produção: fetch(`/api/riscos/${id}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.success) {
      //       const risco = data.data;
      //       setFormData({
      //         nome: risco.nome || '',
      //         descricao: risco.descricao || '',
      //         categoria: risco.categoria || '',
      //         ativo_relacionado: risco.ativo_relacionado || '',
      //         fonte_risco: risco.fonte_risco || '',
      //         checklist_item_id: risco.checklist_item_id || '',
      //         status: risco.status || 'identificado'
      //       });
      //     } else {
      //       setError(data.message || 'Erro ao buscar risco para edição');
      //     }
      //     setLoading(false);
      //   })
      //   .catch(err => {
      //     console.error('Erro ao buscar risco:', err);
      //     setError('Erro de rede ao buscar risco.');
      //     setLoading(false);
      //   });

      // Simulação
      const mockRiscos = [
          { id: 1, nome: "Vazamento de dados de clientes", categoria: "Privacidade", status: "avaliado", descricao: "Desc...", ativo_relacionado: "BD Clientes", fonte_risco: "Interna" },
          { id: 2, nome: "Acesso não autorizado a sistemas internos", categoria: "Segurança", status: "em_tratamento", descricao: "Desc...", ativo_relacionado: "Sistemas Core", fonte_risco: "Interna" },
      ];
      const foundRisco = mockRiscos.find(r => r.id === parseInt(id));
      setTimeout(() => {
        if (foundRisco) {
           setFormData({
             nome: foundRisco.nome || '',
             descricao: foundRisco.descricao || '',
             categoria: foundRisco.categoria || '',
             ativo_relacionado: foundRisco.ativo_relacionado || '',
             fonte_risco: foundRisco.fonte_risco || '',
             checklist_item_id: foundRisco.checklist_item_id || '',
             status: foundRisco.status || 'identificado'
           });
        } else {
          setError('Risco não encontrado para edição.');
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome) {
        setError("O nome do risco é obrigatório.");
        return;
    }
    setError(null);
    setLoading(true);

    const url = isEditing ? `/api/riscos/${id}` : '/api/riscos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      // Em produção: fetch(url, { method, headers: ..., body: ... })
      // const response = await fetch(url, {
      //   method: method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      // setLoading(false);
      // if (data.success) {
      //   alert(`Risco ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      //   navigate(isEditing ? `/riscos/${id}` : '/riscos'); // Volta para detalhes ou lista
      // } else {
      //   setError(data.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} risco.`);
      // }

      // Simulação
      console.log('Enviando dados:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      alert(`Risco ${isEditing ? 'atualizado' : 'criado'} com sucesso! (Simulação)`);
      navigate(isEditing ? `/riscos/${id}` : '/riscos');

    } catch (err) {
      console.error('Erro ao salvar risco:', err);
      setError('Erro de rede ao salvar risco.');
      setLoading(false);
    }
  };

  if (loading && isEditing) {
     return <p>Carregando dados do risco...</p>;
  }

  // Lista de Status (pode vir do backend ou ser fixa)
  const statusOptions = [
    "identificado", "analisado", "avaliado", "em_tratamento", "mitigado", "aceito", "fechado"
  ];

  return (
    <div className="risco-form-page">
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
          <h1>{isEditing ? 'Editar Risco' : 'Identificar Novo Risco'}</h1>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="nome" style={{ display: 'block', marginBottom: '5px' }}>Nome do Risco: *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="descricao" style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label htmlFor="categoria" style={{ display: 'block', marginBottom: '5px' }}>Categoria:</label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label htmlFor="ativo_relacionado" style={{ display: 'block', marginBottom: '5px' }}>Ativo Relacionado:</label>
                <input
                  type="text"
                  id="ativo_relacionado"
                  name="ativo_relacionado"
                  value={formData.ativo_relacionado}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
               <div>
                <label htmlFor="fonte_risco" style={{ display: 'block', marginBottom: '5px' }}>Fonte do Risco:</label>
                <input
                  type="text"
                  id="fonte_risco"
                  name="fonte_risco"
                  value={formData.fonte_risco}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              {isEditing && (
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
              )}
            </div>
            
            {/* Campo opcional para associar a item de checklist - pode ser um select buscando itens */}
            {/* <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="checklist_item_id" style={{ display: 'block', marginBottom: '5px' }}>Item de Checklist Associado (Opcional):</label>
              <input
                type="number"
                id="checklist_item_id"
                name="checklist_item_id"
                value={formData.checklist_item_id}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div> */}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar Risco' : 'Identificar Risco')}
              </button>
              <Link to={isEditing ? `/riscos/${id}` : "/riscos"} className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RiscoFormPage;

