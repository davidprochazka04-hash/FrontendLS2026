import React, { useState } from "react";
import { colors } from "../styles/theme";
import {
  primaryButton,
  dangerButton,
} from "../styles/buttonStyles";

const AddItemModal = ({ onAdd, onClose }) => {
  const [itemName, setItemName] = useState("");

  const handleSubmit = () => {
    if (!itemName.trim()) return;
    onAdd(itemName.trim());
    setItemName("");
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={styles.title}>Přidat položku</h3>
          <button style={styles.closeIcon} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <input
            placeholder="Název položky"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") onClose();
            }}
            autoFocus
            style={styles.input}
          />
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button style={dangerButton} onClick={onClose}>
            Zavřít
          </button>

          <button
            style={primaryButton}
            onClick={handleSubmit}
            disabled={!itemName.trim()}
          >
            ➕ Přidat položku
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },

  modal: {
    background: colors.bgLight,
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  header: {
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${colors.border}`,
  },

  title: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "900",
  },

  closeIcon: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: colors.muted,
  },

  content: {
    padding: "24px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    background: colors.bgInput,
    color: colors.text,
    fontSize: "1rem",
  },

  footer: {
    padding: "16px 24px",
    borderTop: `1px solid ${colors.border}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
};

export default AddItemModal;