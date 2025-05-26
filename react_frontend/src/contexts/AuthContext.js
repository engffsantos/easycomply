import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Pode ser o objeto do usuário ou null
  const [token, setToken] = useState(localStorage.getItem("authToken")); // Exemplo inicializando do localStorage

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
    // localStorage.setItem("userData", JSON.stringify(userData)); // Opcional
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    // localStorage.removeItem("userData");
  };

  const isAuthenticated = () => {
    return !!token; // Ou uma lógica mais robusta de validação do token
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

