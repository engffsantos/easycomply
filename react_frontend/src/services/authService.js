import axios from "axios"; // Ou use fetch

const API_URL = process.env.REACT_APP_API_URL || "/api"; // Configure a URL base da sua API

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    // if (response.data.access_token) {
    //   localStorage.setItem("authToken", response.data.access_token);
    // }
    return response.data;
  } catch (error) {
    // Tratar erro de login
    console.error("Erro no login:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { // Ajuste o endpoint conforme sua API
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Erro no registro:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

const logout = () => {
  // localStorage.removeItem("authToken");
  // Adicionar lógica para invalidar token no backend, se aplicável
  console.log("Usuário deslogado (simulação no frontend)");
};

const getCurrentUser = () => {
  // const token = localStorage.getItem("authToken");
  // Se você armazena dados do usuário no localStorage ou precisa decodificar o token:
  // return JSON.parse(localStorage.getItem("userData"));
  // Ou, idealmente, buscar dados do usuário de um endpoint /me com o token
  return null; // Placeholder
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default authService;

