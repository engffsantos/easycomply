// app/react_frontend/src/pages/AvaliacaoRiscoFormPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const AvaliacaoRiscoFormPage = () => {
  const { id: riscoId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [riscoNome, setRiscoNome] = useState('');
  const [formData, setFormData] = useState({
    probabilidade: '',
    impacto: '',
    justificativa_probabilidade: '',
    justificativa_impacto: '',
    controles_existentes: '',
    probabilidade_residual: '',
    impacto_residual: '',
    justificativa_residual: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingRisco, setFetchingRisco] = useState(true);
  const [error, setError] = useState(null);

  // Buscar nome do risco para exibir no título
  useEffect(() => {
    const fetchRiscoNome = async () => {
      setFetchingRisco(true);
      try {
        // Em produção: fetch(`/api/riscos/${riscoId}`)
        // const response = await fetch(...);
        // const data = await response.json();
        // if (data.success) {
        //   setRiscoNome(data.data.nome);
        // } else {
        //   setError('Erro ao buscar nome do risco.');
        // }

        // Simulação
        const mockRiscos = [
          { id: 1, nome: "Vazamento de dados de clientes" },
          { id: 2, nome: "Acesso não autorizado a sistemas internos" },
          { id: 3, nome: "Não conformidade com política de retenção" },
        ];
        const foundRisco = mockRiscos.find(r => r.id === parseInt(riscoId));
        setTimeout(() => {
          if (foundRisco) {
            setRiscoNome(foundRisco.nome);
          } else {
            setError('Risco não encontrado.');
          }
          setFetchingRisco(false);
        }, 300);

      } catch (err) {
        console.error('Erro ao buscar nome do risco:', err);
        setError('Erro de rede ao buscar nome do risco.');
        setFetchingRisco(false);
      }
    };
    fetchRiscoNome();
  }, [riscoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.probabilidade || !formData.impacto) {
      setError("Probabilidade e Impacto inerentes são obrigatórios.");
      return;
    }
    // Validação adicional de tipos numéricos
    const fieldsToValidate = ['probabilidade', 'impacto', 'probabilidade_residual', 'impacto_residual'];
    for (const field of fieldsToValidate) {
        if (formData[field] && isNaN(parseInt(formData[field]))) {
            setError(`O campo ${field.replace('_', ' ')} deve ser um número.`);
            return;
        }
    }

    setError(null);
    setLoading(true);

    const payload = {
        probabilidade: parseInt(formData.probabilidade),
        impacto: parseInt(formData.impacto),
        justificativa_probabilidade: formData.justificativa_probabilidade,
        justificativa_impacto: formData.justificativa_impacto,
        controles_existentes: formData.controles_existentes,
        probabilidade_residual: formData.probabilidade_residual ? parseInt(formData.probabilidade_residual) : null,
        impacto_residual: formData.impacto_residual ? parseInt(formData.impacto_residual) : null,
        justificativa_residual: formData.justificativa_residual,
        observacoes: formData.observacoes
    };

    try {
      // Em produção: fetch(`/api/riscos/${riscoId}/avaliacoes`, { method: 'POST', ... })
      // const response = await fetch(`/api/riscos/${riscoId}/avaliacoes`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      // const data = await response.json();
      // setLoading(false);
      // if (data.success) {
      //   alert('Avaliação de risco registrada com sucesso!');
      //   navigate(`/riscos/${riscoId}`);
      // } else {
      //   setError(data.message || 'Erro ao registrar avaliação.');
      // }

      // Simulação
      console.log('Enviando avaliação:', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      alert('Avaliação de risco registrada com sucesso! (Simulação)');
      navigate(`/riscos/${riscoId}`);

    } catch (err) {
      console.error('Erro ao salvar avaliação:', err);
      setError('Erro de rede ao salvar avaliação.');
      setLoading(false);
    }
  };

  if (fetchingRisco) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="avaliacao-risco-form-page">
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
          <h1>Avaliar Risco</h1>
          <h3 style={{ fontWeight: 'normal', marginBottom: '2rem' }}>{riscoNome || 'Carregando...'}</h3>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Risco Inerente */}
            <fieldset style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <legend style={{ padding: '0 10px', fontWeight: 'bold' }}>Risco Inerente (Antes dos Controles)</legend>
              <div style={{ display: 'grid
', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="probabilidade" style={{ display: 'block', marginBottom: '5px' }}>Probabilidade (1-5): *</label>
                  <input
                    type="number"
                    id="probabilidade"
                    name="probabilidade"
                    value={formData.probabilidade}
                    onChange={handleChange}
                    min="1" max="5"
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label htmlFor="impacto" style={{ display: 'block', marginBottom: '5px' }}>Impacto (1-5): *</label>
                  <input
                    type="number"
                    id="impacto"
                    name="impacto"
                    value={formData.impacto}
                    onChange={handleChange}
                    min="1" max="5"
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="justificativa_probabilidade" style={{ display: 'block', marginBottom: '5px' }}>Justificativa da Probabilidade:</label>
                <textarea
                  id="justificativa_probabilidade"
                  name="justificativa_probabilidade"
                  value={formData.justificativa_probabilidade}
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label htmlFor="justificativa_impacto" style={{ display: 'block', marginBottom: '5px' }}>Justificativa do Impacto:</label>
                <textarea
                  id="justificativa_impacto"
                  name="justificativa_impacto"
                  value={formData.justificativa_impacto}
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </fieldset>

            {/* Risco Residual */}
            <fieldset style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <legend style={{ padding: '0 10px', fontWeight: 'bold' }}>Risco Residual (Após Controles)</legend>
               <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="controles_existentes" style={{ display: 'block', marginBottom: '5px' }}>Controles Existentes:</label>
                <textarea
                  id="controles_existentes"
                  name="controles_existentes"
                  value={formData.controles_existentes}
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="probabilidade_residual" style={{ display: 'block', marginBottom: '5px' }}>Probabilidade Residual (1-5, Opcional):</label>
                  <input
                    type="number"
                    id="probabilidade_residual"
                    name="probabilidade_residual"
                    value={formData.probabilidade_residual}
                    onChange={handleChange}
                    min="1" max="5"
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label htmlFor="impacto_residual" style={{ display: 'block', marginBottom: '5px' }}>Impacto Residual (1-5, Opcional):</label>
                  <input
                    type="number"
                    id="impacto_residual"
                    name="impacto_residual"
                    value={formData.impacto_residual}
                    onChange={handleChange}
                    min="1" max="5"
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="justificativa_residual" style={{ display: 'block', marginBottom: '5px' }}>Justificativa do Risco Residual:</label>
                <textarea
                  id="justificativa_residual"
                  name="justificativa_residual"
                  value={formData.justificativa_residual}
                  onChange={handleChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </fieldset>

            {/* Observações Gerais */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="observacoes" style={{ display: 'block', marginBottom: '5px' }}>Observações Gerais:</label>
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
                {loading ? 'Salvando...' : 'Registrar Avaliação'}
              </button>
              <Link to={`/riscos/${riscoId}`} className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AvaliacaoRiscoFormPage;

