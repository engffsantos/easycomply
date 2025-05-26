import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChecklistItemCard from "../components/ChecklistItemCard";
import FileUploader from "../components/FileUploader";
import ModalConfirm from "../components/ModalConfirm";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../App.css";

const ChecklistPage = () => {
  // Estados para checklists e itens
  const [checklists, setChecklists] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [checklistItems, setChecklistItems] = useState([]);
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState("");
  const [riscoFilter, setRiscoFilter] = useState("");
  const [prioridadeFilter, setPrioridadeFilter] = useState("");
  
  // Estados para modais
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Estados para formulários
  const [newChecklistData, setNewChecklistData] = useState({
    nome: "",
    categoria: "",
    descricao: ""
  });
  
  const [newItemData, setNewItemData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    risco: "medio",
    prioridade: "media",
    status: "pendente"
  });

  // Carregar checklists ao iniciar
  useEffect(() => {
    fetchChecklists();
  }, []);

  // Carregar itens quando um checklist for selecionado
  useEffect(() => {
    if (selectedChecklist) {
      fetchChecklistItems(selectedChecklist.id);
    }
  }, [selectedChecklist, statusFilter, riscoFilter, prioridadeFilter]);

  // Funções para buscar dados da API
  const fetchChecklists = async () => {
    try {
      // Simulação de chamada API - em produção, usar fetch real
      // const response = await fetch('/api/checklists');
      // const data = await response.json();
      // if (data.success) {
      //   setChecklists(data.data);
      // }
      
      // Dados simulados para desenvolvimento
      const mockChecklists = [
        { 
          id: 1, 
          nome: "Checklist LGPD Inicial", 
          categoria: "Conformidade Legal", 
          descricao: "Avaliação inicial de conformidade com a LGPD",
          percentual_conclusao: 30
        },
        { 
          id: 2, 
          nome: "Segurança de Dados", 
          categoria: "Segurança", 
          descricao: "Verificação de políticas e práticas de segurança de dados",
          percentual_conclusao: 65
        },
        { 
          id: 3, 
          nome: "Revisão de Contratos", 
          categoria: "Jurídico", 
          descricao: "Análise de cláusulas de proteção de dados em contratos",
          percentual_conclusao: 100
        }
      ];
      
      setChecklists(mockChecklists);
      
      // Se não houver checklist selecionado, seleciona o primeiro
      if (mockChecklists.length > 0 && !selectedChecklist) {
        setSelectedChecklist(mockChecklists[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar checklists:", error);
    }
  };

  const fetchChecklistItems = async (checklistId) => {
    try {
      // Simulação de chamada API - em produção, usar fetch real
      // const queryParams = new URLSearchParams();
      // if (statusFilter) queryParams.append('status', statusFilter);
      // if (riscoFilter) queryParams.append('risco', riscoFilter);
      // if (prioridadeFilter) queryParams.append('prioridade', prioridadeFilter);
      
      // const response = await fetch(`/api/checklists/${checklistId}/items?${queryParams}`);
      // const data = await response.json();
      // if (data.success) {
      //   setChecklistItems(data.data);
      // }
      
      // Dados simulados para desenvolvimento
      let mockItems = [
        {
          id: 1,
          checklist_id: 1,
          nome: "Mapeamento de dados pessoais",
          descricao: "Identificar todos os dados pessoais coletados e processados pela empresa",
          categoria: "Inventário",
          risco: "alto",
          prioridade: "alta",
          status: "em_andamento",
          evidencias: []
        },
        {
          id: 2,
          checklist_id: 1,
          nome: "Política de Privacidade",
          descricao: "Criar e publicar política de privacidade no site da empresa",
          categoria: "Documentação",
          risco: "medio",
          prioridade: "alta",
          status: "concluido",
          evidencias: [
            { id: 1, nome_original: "politica_privacidade_v1.pdf" }
          ]
        },
        {
          id: 3,
          checklist_id: 1,
          nome: "Consentimento para coleta de dados",
          descricao: "Implementar mecanismo de consentimento para coleta de dados pessoais",
          categoria: "Consentimento",
          risco: "alto",
          prioridade: "alta",
          status: "pendente",
          evidencias: []
        },
        {
          id: 4,
          checklist_id: 1,
          nome: "Treinamento da equipe",
          descricao: "Realizar treinamento sobre LGPD para todos os funcionários",
          categoria: "Treinamento",
          risco: "medio",
          prioridade: "media",
          status: "pendente",
          evidencias: []
        },
        {
          id: 5,
          checklist_id: 1,
          nome: "Revisão de contratos com fornecedores",
          descricao: "Revisar e atualizar contratos com fornecedores para incluir cláusulas de proteção de dados",
          categoria: "Jurídico",
          risco: "medio",
          prioridade: "media",
          status: "pendente",
          evidencias: []
        }
      ];
      
      // Aplicar filtros
      if (statusFilter) {
        mockItems = mockItems.filter(item => item.status === statusFilter);
      }
      if (riscoFilter) {
        mockItems = mockItems.filter(item => item.risco === riscoFilter);
      }
      if (prioridadeFilter) {
        mockItems = mockItems.filter(item => item.prioridade === prioridadeFilter);
      }
      
      setChecklistItems(mockItems);
    } catch (error) {
      console.error("Erro ao buscar itens do checklist:", error);
    }
  };

  // Funções para manipulação de checklists
  const handleAddChecklist = async (e) => {
    e.preventDefault();
    try {
      // Simulação de chamada API - em produção, usar fetch real
      // const response = await fetch('/api/checklists', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newChecklistData),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchChecklists();
      //   setShowAddChecklistModal(false);
      //   setNewChecklistData({ nome: "", categoria: "", descricao: "" });
      // }
      
      // Simulação para desenvolvimento
      const newChecklist = {
        id: checklists.length + 1,
        ...newChecklistData,
        percentual_conclusao: 0
      };
      
      setChecklists([...checklists, newChecklist]);
      setSelectedChecklist(newChecklist);
      setShowAddChecklistModal(false);
      setNewChecklistData({ nome: "", categoria: "", descricao: "" });
    } catch (error) {
      console.error("Erro ao adicionar checklist:", error);
    }
  };

  // Funções para manipulação de itens
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedChecklist) return;
    
    try {
      // Simulação de chamada API - em produção, usar fetch real
      // const response = await fetch(`/api/checklists/${selectedChecklist.id}/items`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newItemData),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchChecklistItems(selectedChecklist.id);
      //   setShowAddItemModal(false);
      //   setNewItemData({
      //     nome: "",
      //     descricao: "",
      //     categoria: "",
      //     risco: "medio",
      //     prioridade: "media",
      //     status: "pendente"
      //   });
      // }
      
      // Simulação para desenvolvimento
      const newItem = {
        id: checklistItems.length > 0 ? Math.max(...checklistItems.map(item => item.id)) + 1 : 1,
        checklist_id: selectedChecklist.id,
        ...newItemData,
        evidencias: []
      };
      
      setChecklistItems([...checklistItems, newItem]);
      setShowAddItemModal(false);
      setNewItemData({
        nome: "",
        descricao: "",
        categoria: "",
        risco: "medio",
        prioridade: "media",
        status: "pendente"
      });
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!itemToEdit) return;
    
    try {
      // Simulação de chamada API - em produção, usar fetch real
      // const response = await fetch(`/api/checklists/${selectedChecklist.id}/items/${itemToEdit.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newItemData),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchChecklistItems(selectedChecklist.id);
      //   setShowEditItemModal(false);
      //   setItemToEdit(null);
      // }
      
      // Simulação para desenvolvimento
      const updatedItems = checklistItems.map(item => 
        item.id === itemToEdit.id ? { ...item, ...newItemData } : item
      );
      
      setChecklistItems(updatedItems);
      setShowEditItemModal(false);
      setItemToEdit(null);
    } catch (error) {
      console.error("Erro ao editar item:", error);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete || !selectedChecklist) return;
    
    try {
      // Simulação de chamada API - em produção, usar fetch real
      // const response = await fetch(`/api/checklists/${selectedChecklist.id}/items/${itemToDelete.id}`, {
      //   method: 'DELETE'
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchChecklistItems(selectedChecklist.id);
      //   setShowDeleteModal(false);
      //   setItemToDelete(null);
      // }
      
      // Simulação para desenvolvimento
      const filteredItems = checklistItems.filter(item => item.id !== itemToDelete.id);
      setChecklistItems(filteredItems);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    }
  };

  const handleUploadEvidencia = async (itemId, formData) => {
    try {
      // Simulação de chamada API - em produção, usar fetch real
      // const response = await fetch(`/api/checklists/${selectedChecklist.id}/items/${itemId}/evidencias`, {
      //   method: 'POST',
      //   body: formData, // FormData já contém o arquivo e observações
      // });
      // const data = await response.json();
      // if (data.success) {
      //   fetchChecklistItems(selectedChecklist.id);
      // }
      
      // Simulação para desenvolvimento
      const mockEvidencia = {
        id: Math.floor(Math.random() * 1000),
        nome_original: formData.get('arquivo').name,
        data_upload: new Date().toISOString()
      };
      
      const updatedItems = checklistItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            evidencias: [...(item.evidencias || []), mockEvidencia]
          };
        }
        return item;
      });
      
      setChecklistItems(updatedItems);
      alert("Evidência enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload de evidência:", error);
    }
  };

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setNewItemData({
      nome: item.nome,
      descricao: item.descricao || "",
      categoria: item.categoria || "",
      risco: item.risco,
      prioridade: item.prioridade,
      status: item.status
    });
    setShowEditItemModal(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setRiscoFilter("");
    setPrioridadeFilter("");
  };

  return (
    <div className="checklist-page">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}>
        <Sidebar />
        <main style={{
          flexGrow: 1, 
          padding: "2rem", 
          marginLeft: "270px",
          backgroundColor: "#fff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1>Gerenciamento de Checklists LGPD</h1>
            <button 
              onClick={() => setShowAddChecklistModal(true)} 
              className="btn-primary"
              style={{
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Novo Checklist
            </button>
          </div>

          {/* Seleção de Checklist */}
          <div style={{ marginBottom: "2rem" }}>
            <h2>Selecione um Checklist</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {checklists.map(checklist => (
                <div 
                  key={checklist.id}
                  onClick={() => setSelectedChecklist(checklist)}
                  style={{
                    padding: "1rem",
                    border: `2px solid ${selectedChecklist?.id === checklist.id ? '#007bff' : '#ddd'}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "calc(33% - 1rem)",
                    minWidth: "250px",
                    backgroundColor: selectedChecklist?.id === checklist.id ? '#f0f7ff' : '#fff'
                  }}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{checklist.nome}</h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>{checklist.categoria}</p>
                  <div style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: "4px" }}>
                    <div style={{
                      width: `${checklist.percentual_conclusao}%`,
                      height: "10px",
                      backgroundColor: checklist.percentual_conclusao === 100 ? "#28a745" : "#007bff",
                      borderRadius: "4px"
                    }}></div>
                  </div>
                  <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
                    Progresso: {checklist.percentual_conclusao}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedChecklist && (
            <>
              {/* Cabeçalho do Checklist Selecionado */}
              <div style={{ marginBottom: "2rem" }}>
                <h2>{selectedChecklist.nome}</h2>
                <p>{selectedChecklist.descricao}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                  <button 
                    onClick={() => setShowAddItemModal(true)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Adicionar Item
                  </button>
                  
                  {/* Filtros */}
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                      <option value="">Status: Todos</option>
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                    
                    <select 
                      value={riscoFilter} 
                      onChange={(e) => setRiscoFilter(e.target.value)}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                      <option value="">Risco: Todos</option>
                      <option value="baixo">Baixo</option>
                      <option value="medio">Médio</option>
                      <option value="alto">Alto</option>
                    </select>
                    
                    <select 
                      value={prioridadeFilter} 
                      onChange={(e) => setPrioridadeFilter(e.target.value)}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                      <option value="">Prioridade: Todas</option>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                    
                    <button 
                      onClick={resetFilters}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Lista de Itens */}
              <div className="checklist-items">
                {checklistItems.length === 0 ? (
                  <p>Nenhum item encontrado. {statusFilter || riscoFilter || prioridadeFilter ? "Tente remover os filtros." : "Adicione um novo item para começar."}</p>
                ) : (
                  checklistItems.map(item => (
                    <ChecklistItemCard
                      key={item.id}
                      item={item}
                      onEditClick={() => handleEditClick(item)}
                      onDeleteClick={() => handleDeleteClick(item)}
                      onUploadEvidencia={(formData) => handleUploadEvidencia(item.id, formData)}
                    />
                  ))
                )}
              </div>
            </>
          )}
          
          {/* Modal para Adicionar Checklist */}
          {showAddChecklistModal && (
            <ModalConfirm
              isOpen={showAddChecklistModal}
              onClose={() => setShowAddChecklistModal(false)}
              onConfirm={handleAddChecklist}
              title="Adicionar Novo Checklist"
              confirmText="Adicionar"
              cancelText="Cancelar"
              message={
                <form id="addChecklistForm" onSubmit={handleAddChecklist}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="nome" style={{display: "block", marginBottom: "0.5rem"}}>Nome:</label>
                    <input 
                      type="text" 
                      id="nome" 
                      value={newChecklistData.nome} 
                      onChange={(e) => setNewChecklistData({...newChecklistData, nome: e.target.value})} 
                      required 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="categoria" style={{display: "block", marginBottom: "0.5rem"}}>Categoria:</label>
                    <input 
                      type="text" 
                      id="categoria" 
                      value={newChecklistData.categoria} 
                      onChange={(e) => setNewChecklistData({...newChecklistData, categoria: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="descricao" style={{display: "block", marginBottom: "0.5rem"}}>Descrição:</label>
                    <textarea 
                      id="descricao" 
                      value={newChecklistData.descricao} 
                      onChange={(e) => setNewChecklistData({...newChecklistData, descricao: e.target.value})} 
                      rows="3" 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                </form>
              }
            />
          )}
          
          {/* Modal para Adicionar Item */}
          {showAddItemModal && (
            <ModalConfirm
              isOpen={showAddItemModal}
              onClose={() => setShowAddItemModal(false)}
              onConfirm={handleAddItem}
              title="Adicionar Novo Item"
              confirmText="Adicionar"
              cancelText="Cancelar"
              message={
                <form id="addItemForm" onSubmit={handleAddItem}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="nome" style={{display: "block", marginBottom: "0.5rem"}}>Nome:</label>
                    <input 
                      type="text" 
                      id="nome" 
                      value={newItemData.nome} 
                      onChange={(e) => setNewItemData({...newItemData, nome: e.target.value})} 
                      required 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="descricao" style={{display: "block", marginBottom: "0.5rem"}}>Descrição:</label>
                    <textarea 
                      id="descricao" 
                      value={newItemData.descricao} 
                      onChange={(e) => setNewItemData({...newItemData, descricao: e.target.value})} 
                      rows="3" 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="categoria" style={{display: "block", marginBottom: "0.5rem"}}>Categoria:</label>
                    <input 
                      type="text" 
                      id="categoria" 
                      value={newItemData.categoria} 
                      onChange={(e) => setNewItemData({...newItemData, categoria: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="risco" style={{display: "block", marginBottom: "0.5rem"}}>Nível de Risco:</label>
                    <select 
                      id="risco" 
                      value={newItemData.risco} 
                      onChange={(e) => setNewItemData({...newItemData, risco: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      <option value="baixo">Baixo</option>
                      <option value="medio">Médio</option>
                      <option value="alto">Alto</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="prioridade" style={{display: "block", marginBottom: "0.5rem"}}>Prioridade:</label>
                    <select 
                      id="prioridade" 
                      value={newItemData.prioridade} 
                      onChange={(e) => setNewItemData({...newItemData, prioridade: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="status" style={{display: "block", marginBottom: "0.5rem"}}>Status:</label>
                    <select 
                      id="status" 
                      value={newItemData.status} 
                      onChange={(e) => setNewItemData({...newItemData, status: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                </form>
              }
            />
          )}
          
          {/* Modal para Editar Item */}
          {showEditItemModal && itemToEdit && (
            <ModalConfirm
              isOpen={showEditItemModal}
              onClose={() => {
                setShowEditItemModal(false);
                setItemToEdit(null);
              }}
              onConfirm={handleEditItem}
              title="Editar Item"
              confirmText="Salvar"
              cancelText="Cancelar"
              message={
                <form id="editItemForm" onSubmit={handleEditItem}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="edit-nome" style={{display: "block", marginBottom: "0.5rem"}}>Nome:</label>
                    <input 
                      type="text" 
                      id="edit-nome" 
                      value={newItemData.nome} 
                      onChange={(e) => setNewItemData({...newItemData, nome: e.target.value})} 
                      required 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="edit-descricao" style={{display: "block", marginBottom: "0.5rem"}}>Descrição:</label>
                    <textarea 
                      id="edit-descricao" 
                      value={newItemData.descricao} 
                      onChange={(e) => setNewItemData({...newItemData, descricao: e.target.value})} 
                      rows="3" 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="edit-categoria" style={{display: "block", marginBottom: "0.5rem"}}>Categoria:</label>
                    <input 
                      type="text" 
                      id="edit-categoria" 
                      value={newItemData.categoria} 
                      onChange={(e) => setNewItemData({...newItemData, categoria: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    />
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="edit-risco" style={{display: "block", marginBottom: "0.5rem"}}>Nível de Risco:</label>
                    <select 
                      id="edit-risco" 
                      value={newItemData.risco} 
                      onChange={(e) => setNewItemData({...newItemData, risco: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      <option value="baixo">Baixo</option>
                      <option value="medio">Médio</option>
                      <option value="alto">Alto</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="edit-prioridade" style={{display: "block", marginBottom: "0.5rem"}}>Prioridade:</label>
                    <select 
                      id="edit-prioridade" 
                      value={newItemData.prioridade} 
                      onChange={(e) => setNewItemData({...newItemData, prioridade: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="edit-status" style={{display: "block", marginBottom: "0.5rem"}}>Status:</label>
                    <select 
                      id="edit-status" 
                      value={newItemData.status} 
                      onChange={(e) => setNewItemData({...newItemData, status: e.target.value})} 
                      style={{width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc"}}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                </form>
              }
            />
          )}
          
          {/* Modal para Confirmar Exclusão */}
          {showDeleteModal && itemToDelete && (
            <ModalConfirm
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
              }}
              onConfirm={handleDeleteItem}
              title="Confirmar Exclusão"
              confirmText="Excluir"
              cancelText="Cancelar"
              message={`Tem certeza que deseja excluir o item "${itemToDelete.nome}"? Esta ação não pode ser desfeita.`}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ChecklistPage;
