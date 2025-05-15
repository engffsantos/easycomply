import React from "react";

const ChecklistCard = ({ title, description, status }) => {
  // status poderia ser algo como 'completo', 'pendente', 'em andamento'
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", margin: "8px", borderRadius: "8px" }}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Status: {status}</p>
      {/* Outros elementos como botões de ação, progresso, etc. */}
    </div>
  );
};

export default ChecklistCard;

