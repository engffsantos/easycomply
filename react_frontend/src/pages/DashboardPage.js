import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ComplianceChart from "../components/ComplianceChart";
import CategoryStatus from "../components/CategoryStatus";
import "../App.css";

const DashboardPage = () => {
  // Estados para armazenar dados do dashboard
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar dados de métricas ao carregar a página
  useEffect(() => {
    fetchMetricas();
  }, []);

  // Função para buscar métricas da API
  const fetchMetricas = async () => {
    try {
      setLoading(true);
      // Em produção, usar fetch real para a API
      // const response = await fetch('/api/checklists/metricas');
      // const data = await response.json();
      // if (data.success) {
      //   setMetricas(data.data);
      // }

      // Dados simulados para desenvolvimento
      const mockMetricas = {
        total_checklists: 3,
        total_itens: 25,
        itens_por_status: {
          pendentes: 12,
          em_andamento: 8,
          concluidos: 5
        },
        itens_por_risco: {
          alto: 7,
          medio: 10,
          baixo: 8
        },
        percentual_conformidade: 45,
        metricas_por_categoria: [
          {
            categoria: "Conformidade Legal",
            total_itens: 10,
            itens_concluidos: 3,
            percentual_conformidade: 30
          },
          {
            categoria: "Segurança",
            total_itens: 8,
            itens_concluidos: 5,
            percentual_conformidade: 62
          },
          {
            categoria: "Processos Internos",
            total_itens: 7,
            itens_concluidos: 2,
            percentual_conformidade: 28
          }
        ]
      };

      // Simular um pequeno delay para mostrar o loading
      setTimeout(() => {
        setMetricas(mockMetricas);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
      setError("Não foi possível carregar as métricas. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  // Preparar dados para os gráficos
  const prepareChartData = () => {
    if (!metricas) return null;

    // Dados para gráfico de conformidade por categoria
    const categoriaChartData = {
      labels: metricas.metricas_por_categoria.map(m => m.categoria),
      datasets: [
        {
          label: 'Conformidade (%)',
          data: metricas.metricas_por_categoria.map(m => m.percentual_conformidade),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };

    // Dados para gráfico de status dos itens
    const statusChartData = {
      labels: ['Pendentes', 'Em Andamento', 'Concluídos'],
      datasets: [
        {
          data: [
            metricas.itens_por_status.pendentes,
            metricas.itens_por_status.em_andamento,
            metricas.itens_por_status.concluidos
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };

    // Dados para gráfico de itens por risco
    const riscoChartData = {
      labels: ['Alto', 'Médio', 'Baixo'],
      datasets: [
        {
          data: [
            metricas.itens_por_risco.alto,
            metricas.itens_por_risco.medio,
            metricas.itens_por_risco.baixo
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };

    return {
      categoriaChartData,
      statusChartData,
      riscoChartData
    };
  };

  // Preparar dados para os gráficos
  const chartData = prepareChartData();

  return (
    <div className="dashboard-page">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}>
        <Sidebar />
        <main style={{
          flexGrow: 1,
          padding: "2rem",
          marginLeft: "270px",
          backgroundColor: "#fff"
        }}>
          <h1>Dashboard de Conformidade LGPD</h1>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Carregando métricas...</p>
              {/* Aqui poderia ser adicionado um spinner de loading */}
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
                onClick={fetchMetricas}
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
          ) : (
            <>
              {/* Resumo Geral */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                  gap: "1rem" 
                }}>
                  {/* Card de Conformidade Geral */}
                  <div style={{ 
                    padding: "1.5rem", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px", 
                    textAlign: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    border: "1px solid #e0e0e0"
                  }}>
                    <h3>Conformidade Geral</h3>
                    <div style={{ 
                      fontSize: "3rem", 
                      fontWeight: "bold", 
                      color: metricas.percentual_conformidade >= 80 ? "#28a745" : 
                             metricas.percentual_conformidade >= 50 ? "#ffc107" : "#dc3545" 
                    }}>
                      {metricas.percentual_conformidade}%
                    </div>
                    <div style={{ width: "100%", backgroundColor: "#e9ecef", borderRadius: "4px", height: "10px", marginTop: "1rem" }}>
                      <div style={{
                        width: `${metricas.percentual_conformidade}%`,
                        height: "100%",
                        backgroundColor: metricas.percentual_conformidade >= 80 ? "#28a745" : 
                                        metricas.percentual_conformidade >= 50 ? "#ffc107" : "#dc3545",
                        borderRadius: "4px"
                      }}></div>
                    </div>
                  </div>

                  {/* Card de Total de Checklists */}
                  <div style={{ 
                    padding: "1.5rem", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px", 
                    textAlign: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    border: "1px solid #e0e0e0"
                  }}>
                    <h3>Total de Checklists</h3>
                    <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#007bff" }}>
                      {metricas.total_checklists}
                    </div>
                    <Link to="/checklists" style={{ 
                      display: "inline-block", 
                      marginTop: "1rem",
                      padding: "8px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px"
                    }}>
                      Ver Checklists
                    </Link>
                  </div>

                  {/* Card de Itens de Alto Risco */}
                  <div style={{ 
                    padding: "1.5rem", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px", 
                    textAlign: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    border: "1px solid #e0e0e0"
                  }}>
                    <h3>Itens de Alto Risco</h3>
                    <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#dc3545" }}>
                      {metricas.itens_por_risco.alto}
                    </div>
                    <p>de {metricas.total_itens} itens totais</p>
                  </div>

                  {/* Card de Itens Pendentes */}
                  <div style={{ 
                    padding: "1.5rem", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px", 
                    textAlign: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    border: "1px solid #e0e0e0"
                  }}>
                    <h3>Itens Pendentes</h3>
                    <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#ffc107" }}>
                      {metricas.itens_por_status.pendentes}
                    </div>
                    <p>de {metricas.total_itens} itens totais</p>
                  </div>
                </div>
              </div>

              {/* Gráficos */}
              <div style={{ marginBottom: "2rem" }}>
                <h2>Análise de Conformidade</h2>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", 
                  gap: "1.5rem",
                  marginTop: "1rem"
                }}>
                  {/* Gráfico de Conformidade por Categoria */}
                  <div>
                    <ComplianceChart 
                      data={chartData.categoriaChartData} 
                      type="bar" 
                      title="Conformidade por Categoria (%)" 
                    />
                  </div>

                  {/* Gráfico de Status dos Itens */}
                  <div>
                    <ComplianceChart 
                      data={chartData.statusChartData} 
                      type="pie" 
                      title="Status dos Itens" 
                    />
                  </div>

                  {/* Gráfico de Itens por Risco */}
                  <div>
                    <ComplianceChart 
                      data={chartData.riscoChartData} 
                      type="pie" 
                      title="Itens por Nível de Risco" 
                    />
                  </div>
                </div>
              </div>

              {/* Status por Categoria */}
              <div>
                <h2>Status por Categoria</h2>
                <div style={{ marginTop: "1rem" }}>
                  {metricas.metricas_por_categoria.map((categoria, index) => (
                    <CategoryStatus 
                      key={index}
                      category={categoria.categoria}
                      totalItems={categoria.total_itens}
                      completedItems={categoria.itens_concluidos}
                      percentageComplete={categoria.percentual_conformidade}
                    />
                  ))}
                </div>
              </div>

              {/* Ações Recomendadas */}
              <div style={{ marginTop: "2rem" }}>
                <h2>Ações Recomendadas</h2>
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "#f8f9fa", 
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  border: "1px solid #e0e0e0"
                }}>
                  <ul style={{ paddingLeft: "1.5rem" }}>
                    {metricas.itens_por_risco.alto > 0 && (
                      <li style={{ marginBottom: "0.5rem" }}>
                        <strong>Priorize os {metricas.itens_por_risco.alto} itens de alto risco</strong> - Estes representam os maiores riscos de não conformidade.
                      </li>
                    )}
                    {metricas.percentual_conformidade < 50 && (
                      <li style={{ marginBottom: "0.5rem" }}>
                        <strong>Aumente seu nível de conformidade</strong> - Sua conformidade geral está abaixo de 50%, o que pode representar riscos significativos.
                      </li>
                    )}
                    {metricas.metricas_por_categoria.some(cat => cat.percentual_conformidade < 30) && (
                      <li style={{ marginBottom: "0.5rem" }}>
                        <strong>Foque nas categorias com menor conformidade</strong> - Algumas categorias estão com conformidade abaixo de 30%.
                      </li>
                    )}
                    {metricas.itens_por_status.pendentes > 10 && (
                      <li style={{ marginBottom: "0.5rem" }}>
                        <strong>Reduza o número de itens pendentes</strong> - Você tem mais de 10 itens pendentes que precisam de atenção.
                      </li>
                    )}
                    <li style={{ marginBottom: "0.5rem" }}>
                      <strong>Gere documentos legais</strong> - Mantenha sua documentação atualizada para demonstrar conformidade.
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
