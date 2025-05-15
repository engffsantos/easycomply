import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar" style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '20px', height: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}><Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/checklist" style={{ textDecoration: 'none', color: '#333' }}>Checklists</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/documentos" style={{ textDecoration: 'none', color: '#333' }}>Documentos</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/treinamento" style={{ textDecoration: 'none', color: '#333' }}>Treinamentos</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/incidentes" style={{ textDecoration: 'none', color: '#333' }}>Incidentes</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/configuracoes" style={{ textDecoration: 'none', color: '#333' }}>Configurações</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
