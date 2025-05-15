import React from 'react';
import PropTypes from 'prop-types';

const ModalConfirm = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
  if (!isOpen) {
    return null;
  }

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050, // Garante que fique sobre outros elementos
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  };

  const modalTitleStyle = {
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "1.75rem",
    color: "#333",
  };

  const modalMessageStyle = {
    marginBottom: "30px",
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6",
  };

  const modalActionsStyle = {
    display: "flex",
    justifyContent: "flex-end", // Alinha botões à direita por padrão
    gap: "10px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "opacity 0.2s ease",
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545", // Vermelho para confirmação de exclusão, por exemplo
    color: "white",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d", // Cinza para cancelar
    color: "white",
  };
  
  // Se o formulário for passado como mensagem, o botão de confirmação do modal aciona o submit do form
  // O botão de confirmação do modal só será renderizado se onConfirm for uma função (não um form)
  const isMessageAForm = React.isValidElement(message) && message.type === 'form';

  return (
    <div style={modalOverlayStyle} onClick={onClose}> {/* Fecha ao clicar fora */}
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> {/* Impede que o clique dentro feche */}
        <h3 style={modalTitleStyle}>{title}</h3>
        <div style={modalMessageStyle}>{message}</div>
        <div style={modalActionsStyle}>
          <button style={cancelButtonStyle} onClick={onClose}>
            {cancelText}
          </button>
          {/* Se a mensagem é um formulário, o botão de confirmação é o submit do form, senão é o botão onConfirm */}
          {isMessageAForm ? (
            <button type="submit" form={message.props.id} style={{...confirmButtonStyle, backgroundColor: "#007bff"}}>
              {confirmText} 
            </button>
          ) : (
            <button style={confirmButtonStyle} onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ModalConfirm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func, // Não é obrigatório se a mensagem for um formulário
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired, // Pode ser string ou um elemento React (ex: form)
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

ModalConfirm.defaultProps = {
  confirmText: "Confirmar",
  cancelText: "Cancelar",
};

export default ModalConfirm;

