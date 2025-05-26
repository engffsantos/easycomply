import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";
const DOCUMENT_ENDPOINT = `${API_URL}/documentos`; // Ajuste conforme sua API

// Função para obter o token de autenticação (exemplo)
const getAuthToken = () => localStorage.getItem("authToken");

const getAuthConfig = (isFormData = false) => {
  const headers = {
    Authorization: `Bearer ${getAuthToken()}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return { headers };
};

const generateDocument = async (documentData) => {
  try {
    // Se a geração do documento envolver envio de arquivos ou dados complexos,
    // pode ser necessário usar FormData.
    // Por enquanto, assumindo JSON.
    const response = await axios.post(`${DOCUMENT_ENDPOINT}/generate`, documentData, getAuthConfig());
    // Se o backend retornar o arquivo diretamente:
    // return response; // O response pode conter o blob do arquivo
    return response.data; // Ou metadados do documento gerado
  } catch (error) {
    console.error("Erro ao gerar documento:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const getAllDocuments = async () => {
  try {
    const response = await axios.get(DOCUMENT_ENDPOINT, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar documentos:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const getDocumentById = async (id) => {
  try {
    const response = await axios.get(`${DOCUMENT_ENDPOINT}/${id}`, getAuthConfig());
    // Se precisar baixar o arquivo:
    // const fileResponse = await axios.get(`${DOCUMENT_ENDPOINT}/${id}/download`, { ...getAuthConfig(), responseType: 'blob' });
    // return fileResponse.data;
    return response.data; // Retornando metadados por padrão
  } catch (error) {
    console.error(`Erro ao buscar documento ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const deleteDocument = async (id) => {
  try {
    const response = await axios.delete(`${DOCUMENT_ENDPOINT}/${id}`, getAuthConfig());
    return response.data; // Ou apenas status de sucesso
  } catch (error) {
    console.error(`Erro ao deletar documento ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const documentService = {
  generateDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
};

export default documentService;

