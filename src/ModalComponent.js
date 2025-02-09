import React from "react";
import "./ModalComponent.css";

const ModalComponent = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onRequestClose}>
          &times;
        </button>
        {children} {/* Render passed content */}
      </div>
    </div>
  );
};

export default ModalComponent;

