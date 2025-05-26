import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import authService from "../services/authService";
import "../App.css"; // Supondo que estilos globais ou específicos de login estejam aqui ou em um CSS dedicado

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Simulação de chamada de API
      // No projeto real, a chamada ao authService.login(email, password) seria feita aqui
      // const userData = await authService.login(email, password);
      // login(userData, userData.token); // Supondo que o serviço retorne o usuário e o token
      
      // Simulação de sucesso para demonstração
      if (email === "teste@easycomply.com" && password === "senha123") {
        const mockUserData = { id: 1, name: "Usuário Teste", email: email };
        const mockToken = "fake-jwt-token";
        login(mockUserData, mockToken); // Atualiza o contexto de autenticação
        navigate("/dashboard");
      } else {
        setError("Credenciais inválidas. Use teste@easycomply.com e senha123 para simulação.");
      }
    } catch (err) {
      setError(err.message || "Falha ao fazer login. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="login-page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <div className="login-form-container" style={{ padding: "40px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {/* Adicionar o logo aqui se disponível em static/img ou react_frontend/public */}
          {/* <img src="/logo_easycomply.png" alt="EasyComply Logo" style={{ maxWidth: "150px", marginBottom: "20px" }} /> */}
          <h2>Bem-vindo ao EasyComply</h2>
          <p>Entre com suas credenciais para acessar o sistema.</p>
        </div>
        {error && <div style={{ color: "red", marginBottom: "16px", textAlign: "center", padding: "10px", border: "1px solid red", borderRadius: "4px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Sua senha"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%", 
              padding: "12px", 
              backgroundColor: loading ? "#ccc" : "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Não tem uma conta? <a href="#" onClick={(e) => {e.preventDefault(); alert("Funcionalidade de registro ainda não implementada.");}}>Registre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

