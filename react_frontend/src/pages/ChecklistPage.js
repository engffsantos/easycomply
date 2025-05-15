import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChecklistCard from "../components/ChecklistCard";
import ModalConfirm from "../components/ModalConfirm"; // Para exclusão, por exemplo
import Navbar from "../components/Navbar"; // Importa o Navbar externo
import Sidebar from "../components/Sidebar"; // Importa o Sidebar externo
import "../App.css";

const ChecklistPage = () => {
  const [checklists, setChecklists] = useState([
    { id: 1, title: "Conformidade LGPD Inicial", description: "Checklist para avaliação inicial de conformidade com a LGPD.", status: "Pendente", items: 10, completedItems: 3 },
    { id: 2, title: "Segurança de Dados", description: "Verificação de políticas e práticas de segurança de dados.", status: "Em Andamento", items: 15, completedItems: 10 },
    { id: 3, title: "Revisão de Contratos com Fornecedores", description: "Análise de cláusulas de proteção de dados em contratos.", status: "Concluído", items: 5, completedItems: 5 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newChecklistDesc, setNewChecklistDesc] = useState("");

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newChecklistTitle) return;
    const newChecklist = {
      id: checklists.length + 1,
      title: newChecklistTitle,
      description: newChecklistDesc,
      status: "Pendente",
      items: 0, // Default
      completedItems: 0
    };
    setChecklists([...checklists, newChecklist]);
    setShowAddModal(false);
    setNewChecklistTitle("");
    setNewChecklistDesc("");
  };

  const handleDeleteClick = (checklist) => {
    setChecklistToDelete(checklist);
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = () => {
    setChecklists(checklists.filter(c => c.id !== checklistToDelete.id));
    setShowConfirmDeleteModal(false);
    setChecklistToDelete(null);
  };

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
            <h1>Gerenciamento de Checklists</h1>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}>
              Novo Checklist
            </button>
          </div>

          {checklists.length === 0 ? (
            <p>Nenhum checklist encontrado. Crie um novo para começar!</p>
          ) : (
            <div className="checklists-list">
              {checklists.map(checklist => (
                <div key={checklist.id} style={{border: "1px solid #eee", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", backgroundColor: "#f9f9f9"}}>
                  <ChecklistCard 
                    title={checklist.title} 
                    description={checklist.description} 
                    status={checklist.status} 
                  />
                  <div style={{marginTop: "0.5rem"}}>
                    <p>Progresso: {checklist.completedItems} / {checklist.items} itens</p>
                    <div style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "1rem" }}>
                      <div style={{
                        width: `${checklist.items > 0 ? (checklist.completedItems / checklist.items) * 100 : 0}%`, 
                        height: "10px", 
                        backgroundColor: checklist.status === "Concluído" ? "#28a745" : "#007bff", 
                        borderRadius: "4px"
                      }}></div>
                    </div>
                    <button onClick={() => alert(`Visualizar checklist: ${checklist.title}`)} style={{marginRight: "10px", padding: "5px 10px", cursor: "pointer"}}>Ver Detalhes</button>
                    <button onClick={() => alert(`Editar checklist: ${checklist.title}`)} style={{marginRight: "10px", padding: "5px 10px", cursor: "pointer"}}>Editar</button>
                    <button onClick={() => handleDeleteClick(checklist)} style={{padding: "5px 10px", color: "red", cursor: "pointer"}}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal para Adicionar Checklist */}
      {showAddModal && (
        <ModalConfirm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAddChecklist} // A confirmação aqui é o submit do form
          title="Adicionar Novo Checklist"
          confirmText="Adicionar"
          cancelText="Cancelar"
          message={
            <form id="addChecklistForm" onSubmit={handleAddChecklist}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="newChecklistTitle" style={{display: "block", marginBottom: "0.5rem"}}>Título:</label>
                <input 
                  type="text" 
                  id="newChecklistTitle" 
                  value={newChecklistTitle} 
                  onChange={(e) => setNewChecklistTitle(e.target.value)} 
                  required 
                  style={{width: "calc(100% - 20px)", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="newChecklistDesc" style={{display: "block", marginBottom: "0.5rem"}}>Descrição:</label>
                <textarea 
                  id="newChecklistDesc" 
                  value={newChecklistDesc} 
                  onChange={(e) => setNewChecklistDesc(e.target.value)} 
                  rows="3" 
                  style={{width: "calc(100% - 20px)", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                />
              </div>
            </form>
          }
        />
      )}

      {/* Modal para Confirmar Exclusão */}
      {showConfirmDeleteModal && checklistToDelete && (
        <ModalConfirm
          isOpen={showConfirmDeleteModal}
          onClose={() => setShowConfirmDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          confirmText="Excluir"
          cancelText="Cancelar"
          message={`Você tem certeza que deseja excluir o checklist "${checklistToDelete.title}"? Esta ação não pode ser desfeita.`}
        />
      )}

    </div>
  );
};

export default ChecklistPage;

