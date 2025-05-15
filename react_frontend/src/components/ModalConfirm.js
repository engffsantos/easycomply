import React from "react";

const ModalConfirm = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", 
      alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        backgroundColor: "white", padding: "20px", 
        borderRadius: "8px", textAlign: "center"
      }}>
        <h2>{title || "Confirmar Ação"}</h2>
        <p>{message || "Você tem certeza que deseja prosseguir?"}</p>
        <button onClick={onConfirm} style={{ marginRight: "10px" }}>Confirmar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalConfirm;

