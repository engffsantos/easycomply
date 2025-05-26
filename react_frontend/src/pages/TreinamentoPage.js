import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Importa o Navbar externo
import Sidebar from "../components/Sidebar"; // Importa o Sidebar externo
import "../App.css";

const TreinamentoPage = () => {
  const [cursos, setCursos] = useState([
    {
      id: 1,
      title: "Introdução à LGPD para Colaboradores",
      description: "Entenda os conceitos fundamentais da Lei Geral de Proteção de Dados e suas implicações no dia a dia da empresa.",
      progress: 75,
      modules: 5,
      completedModules: 3,
      category: "LGPD Básica"
    },
    {
      id: 2,
      title: "Segurança da Informação no Ambiente de Trabalho",
      description: "Práticas essenciais para proteger dados e sistemas contra ameaças cibernéticas.",
      progress: 40,
      modules: 8,
      completedModules: 3,
      category: "Segurança"
    },
    {
      id: 3,
      title: "Gestão de Incidentes de Violação de Dados",
      description: "Como identificar, responder e mitigar incidentes de segurança que envolvam dados pessoais.",
      progress: 0,
      modules: 6,
      completedModules: 0,
      category: "LGPD Avançada"
    },
  ]);

  const CourseCard = ({ curso }) => (
    <div style={{
      border: "1px solid #ddd", 
      borderRadius: "8px", 
      padding: "1.5rem", 
      marginBottom: "1.5rem", 
      backgroundColor: "#f9f9f9",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#007bff" }}>{curso.title}</h3>
      <p style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "1rem" }}>Categoria: {curso.category}</p>
      <p style={{ marginBottom: "1rem" }}>{curso.description}</p>
      <div style={{ marginBottom: "0.5rem" }}>
        <span>Progresso: {curso.progress}% ({curso.completedModules}/{curso.modules} módulos)</span>
        <div style={{ width: "100%", backgroundColor: "#e9ecef", borderRadius: "4px", marginTop: "0.25rem" }}>
          <div style={{
            width: `${curso.progress}%`, 
            height: "12px", 
            backgroundColor: "#28a745", 
            borderRadius: "4px",
            transition: "width 0.3s ease-in-out"
          }}></div>
        </div>
      </div>
      <button 
        onClick={() => alert(`Acessando curso: ${curso.title}`)} 
        style={{
          padding: "0.5rem 1rem", 
          backgroundColor: "#007bff", 
          color: "white", 
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer"
        }}
      >
        Acessar Curso
      </button>
    </div>
  );

  return (
    <div className="page-layout">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}> {/* Ajuste para Navbar fixa */}
        <Sidebar />
        <main style={{
          flexGrow: 1, 
          padding: "2rem", 
          marginLeft: "270px", /* Ajuste para largura da Sidebar + padding */
          backgroundColor: "#fff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1>Plataforma de Treinamentos</h1>
            {/* Botão para filtrar ou adicionar cursos, se aplicável */}
          </div>

          {cursos.length === 0 ? (
            <p>Nenhum treinamento disponível no momento.</p>
          ) : (
            <div className="cursos-list">
              {cursos.map(curso => (
                <CourseCard key={curso.id} curso={curso} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TreinamentoPage;

