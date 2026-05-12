import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // 1. Import hooku
import { colors } from "../styles/theme";
import {
  primaryButton,
  dangerButton,
} from "../styles/buttonStyles";

const AddItemModal = ({ onAdd, onClose }) => {
  const [itemName, setItemName] = useState("");
  const { t } = useTranslation(); // 2. Inicializace překladu

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
          {/* TEXT: Přidat položku */}
          <h3 style={styles.title}>{t('detail.addItem')}</h3>
          <button style={styles.closeIcon} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <input
            /* TEXT: Název položky */
            placeholder={t('modal.placeholder_item', 'Název položky')}
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
            {/* TEXT: Zavřít */}
            {t('modal.cancel', 'Zavřít')}
          </button>

          <button
            style={primaryButton}
            onClick={handleSubmit}
            disabled={!itemName.trim()}
          >
            
            ➕ {t('detail.addItem')}
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- STYLY (ZŮSTÁVAJÍ IDENTICKÉ) --- */
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
    color: colors.text, 
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
    outline: "none",
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