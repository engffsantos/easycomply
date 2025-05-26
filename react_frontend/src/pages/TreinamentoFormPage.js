// app/react_frontend/src/pages/TreinamentoFormPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext'; // Para verificar se é admin
import '../App.css';

const TreinamentoFormPage = () => {
  const { id } = useParams(); // Se id existir, estamos editando
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    material_url: '',
    duracao_estimada: '',
    ativo: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Se for edição, busca os dados do treinamento
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      // Em produção, usar fetch real
      // fetch(`/api/treinamentos/${id}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.success) {
      //       const treinamento = data.data;
      //       setFormData({
      //         titulo: treinamento.titulo || '',
      //         descricao: treinamento.descricao || '',
      //         categoria: treinamento.categoria || '',
      //         material_url: treinamento.material_url || '',
      //         duracao_estimada: treinamento.duracao_estimada || '',
      //         ativo: treinamento.ativo !== undefined ? treinamento.ativo : true
      //       });
      //     } else {
      //       setError(data.message || 'Erro ao buscar treinamento para edição');
      //     }
      //     setLoading(false);
      //   })
      //   .catch(err => {
      //     console.error('Erro ao buscar treinamento:', err);
      //     setError('Erro de rede ao buscar treinamento.');
      //     setLoading(false);
      //   });

      // Simulação para desenvolvimento
      const mockTreinamentos = [
        { id: 1, titulo: "Introdução à LGPD", descricao: "Conceitos básicos da Lei Geral de Proteção de Dados.", categoria: "LGPD Básico", ativo: true, material_url: "https://example.com/material_lgpd.pdf", duracao_estimada: 60 },
        { id: 2, titulo: "Segurança da Informação para Colaboradores", descricao: "Práticas essenciais de segurança no dia a dia.", categoria: "Segurança", ativo: true, material_url: null, duracao_estimada: 45 },
      ];
      const foundTreinamento = mockTreinamentos.find(t => t.id === parseInt(id));
      setTimeout(() => {
        if (foundTreinamento) {
           setFormData({
             titulo: foundTreinamento.titulo || '',
             descricao: foundTreinamento.descricao || '',
             categoria: foundTreinamento.categoria || '',
             material_url: foundTreinamento.material_url || '',
             duracao_estimada: foundTreinamento.duracao_estimada || '',
             ativo: foundTreinamento.ativo !== undefined ? foundTreinamento.ativo : true
           });
        } else {
          setError('Treinamento não encontrado para edição.');
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  // Verifica se é admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/treinamentos'); // Redireciona se não for admin
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isEditing ? `/api/treinamentos/${id}` : '/api/treinamentos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      // Em produção, usar fetch real
      // const response = await fetch(url, {
      //   method: method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //       ...formData,
      //       duracao_estimada: formData.duracao_estimada ? parseInt(formData.duracao_estimada) : null
      //   })
      // });
      // const data = await response.json();
      // setLoading(false);
      // if (data.success) {
      //   alert(`Treinamento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      //   navigate('/treinamentos');
      // } else {
      //   setError(data.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} treinamento.`);
      // }

      // Simulação
      console.log('Enviando dados:', formData);
      setTimeout(() => {
        setLoading(false);
        alert(`Treinamento ${isEditing ? 'atualizado' : 'criado'} com sucesso! (Simulação)`);
        navigate('/treinamentos');
      }, 1000);

    } catch (err) {
      console.error('Erro ao salvar treinamento:', err);
      setError('Erro de rede ao salvar treinamento.');
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <p>Acesso não autorizado.</p>; // Ou redirecionar
  }
  
  if (loading && isEditing) {
     return <p>Carregando dados do treinamento...</p>;
  }

  return (
    <div className="treinamento-form-page">
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
          <h1>{isEditing ? 'Editar Treinamento' : 'Criar Novo Treinamento'}</h1>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="titulo" style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
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

            <div style={{ marginBottom: '1rem' }}>
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

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="material_url" style={{ display: 'block', marginBottom: '5px' }}>URL do Material (Opcional):</label>
              <input
                type="url"
                id="material_url"
                name="material_url"
                value={formData.material_url}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="duracao_estimada" style={{ display: 'block', marginBottom: '5px' }}>Duração Estimada (minutos, Opcional):</label>
              <input
                type="number"
                id="duracao_estimada"
                name="duracao_estimada"
                value={formData.duracao_estimada}
                onChange={handleChange}
                min="0"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="ativo" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  style={{ marginRight: '10px' }}
                />
                Ativo (visível para usuários)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar Treinamento' : 'Criar Treinamento')}
              </button>
              <Link to="/treinamentos" className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default TreinamentoFormPage;

