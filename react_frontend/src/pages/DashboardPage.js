import React from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // Se precisar de dados do usuário
import ChecklistCard from "../components/ChecklistCard";
import GraphWidget from "../components/GraphWidget";
import Navbar from "../components/Navbar"; // Importa o Navbar
import Sidebar from "../components/Sidebar"; // Importa o Sidebar
import "../App.css";

const DashboardPage = () => {
  // const { user } = useAuth(); // Para personalizar a saudação, por exemplo

  const mockChecklists = [
    { id: 1, title: "Conformidade LGPD Inicial", description: "Avaliação inicial de conformidade.", status: "Pendente", progressPercentage: 30, itemsCompleted: 3, totalItems: 10 },
    { id: 2, title: "Segurança de Dados", description: "Verificação de políticas de segurança.", status: "Em Andamento", progressPercentage: 66, itemsCompleted: 10, totalItems: 15 },
  ];

  const mockChartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Nível de Conformidade (%)",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "#007bff",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}> {/* paddingTop para compensar a navbar fixa */}
        <Sidebar />
        <main style={{
          flexGrow: 1, 
          padding: "2rem", 
          marginLeft: "260px", // Largura da sidebar ajustada
          backgroundColor: "#fff"
        }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1>Dashboard de Conformidade</h1>
            {/* <p>Bem-vindo, {user?.name || "Usuário"}!</p> */}
            <p>Bem-vindo ao painel EasyComply!</p>
          </div>

          <div className="widgets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="widget" style={{ padding: "1.5rem", backgroundColor: "#e9ecef", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <h3>Checklists Pendentes</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "10px 0" }}>{mockChecklists.filter(c => c.status === "Pendente").length}</p>
              <Link to="/checklists" className="btn btn-sm btn-outline-primary">Ver todos os checklists</Link>
            </div>
            <div className="widget" style={{ padding: "1.5rem", backgroundColor: "#e9ecef", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <h3>Progresso em Treinamentos</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "10px 0" }}>75%</p>
              <Link to="/treinamentos" className="btn btn-sm btn-outline-primary">Acessar treinamentos</Link>
            </div>
            <div className="widget" style={{ padding: "1.5rem", backgroundColor: "#e9ecef", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <h3>Nível de Risco Atual</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "orange", margin: "10px 0" }}>Médio</p>
              <a href="#" onClick={(e) => e.preventDefault()} className="btn btn-sm btn-outline-secondary">Ver detalhes do risco</a>
            </div>
          </div>

          <div className="section" style={{ marginBottom: "2rem" }}>
            <h2>Checklists Recentes</h2>
            {mockChecklists.map(checklist => (
              <ChecklistCard 
                key={checklist.id} 
                title={checklist.title} 
                description={checklist.description} 
                status={checklist.status} 
                progressPercentage={checklist.progressPercentage}
                itemsCompleted={checklist.itemsCompleted}
                totalItems={checklist.totalItems}
                onDetailsClick={() => alert(`Detalhes: ${checklist.title}`)}
                onEditClick={() => alert(`Editar: ${checklist.title}`)}
                onDeleteClick={() => alert(`Excluir: ${checklist.title}`)}
              />
            ))}
          </div>

          <div className="section" style={{ marginBottom: "2rem" }}>
            <h2>Relatório de Conformidade</h2>
            <GraphWidget title="Evolução da Conformidade (Simulado)" type="line" data={mockChartData} />
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

