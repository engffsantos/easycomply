import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";
const CHECKLIST_ENDPOINT = `${API_URL}/checklists`; // Ajuste conforme sua API

// Função para obter o token de autenticação (exemplo)
const getAuthToken = () => localStorage.getItem("authToken");

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

const getAllChecklists = async () => {
  try {
    const response = await axios.get(CHECKLIST_ENDPOINT, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar checklists:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const getChecklistById = async (id) => {
  try {
    const response = await axios.get(`${CHECKLIST_ENDPOINT}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar checklist ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const createChecklist = async (checklistData) => {
  try {
    const response = await axios.post(CHECKLIST_ENDPOINT, checklistData, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Erro ao criar checklist:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const updateChecklist = async (id, checklistData) => {
  try {
    const response = await axios.put(`${CHECKLIST_ENDPOINT}/${id}`, checklistData, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar checklist ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const deleteChecklist = async (id) => {
  try {
    const response = await axios.delete(`${CHECKLIST_ENDPOINT}/${id}`, getAuthConfig());
    return response.data; // Ou apenas status de sucesso
  } catch (error) {
    console.error(`Erro ao deletar checklist ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const checklistService = {
  getAllChecklists,
  getChecklistById,
  createChecklist,
  updateChecklist,
  deleteChecklist,
};

export default checklistService;

