import React, { useState } from "react";
import { colors } from "../styles/theme";
import {
  primaryButton,
  dangerButton,
  AddIcon,
  DeleteIcon,
} from "../styles/buttonStyles";

const MembersModal = ({ members, isOwner, onAdd, onRemove, onClose }) => {
  const [newMember, setNewMember] = useState("");

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={styles.title}>Členové seznamu</h3>
          <button style={styles.closeIcon} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          {members.length === 0 && (
            <div style={styles.empty}>Zatím žádní členové</div>
          )}

          {members.map((m) => (
            <div key={m.id} style={styles.memberRow}>
              <span>{m.name}</span>

              {isOwner && (
                <button
                  style={{ ...dangerButton, padding: "6px 10px" }}
                  onClick={() => onRemove(m.id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        
{/* ADD MEMBER */}
{isOwner && (
  <div style={styles.addSection}>
    <input
      placeholder="Jméno nového člena"
      value={newMember}
      onChange={(e) => setNewMember(e.target.value)}
      style={styles.input}
      onKeyDown={(e) => {
        if (e.key === "Enter" && newMember.trim()) {
          onAdd(newMember.trim());
          setNewMember("");
        }
      }}
    />

    <button
      style={primaryButton}
      onClick={() => {
        if (newMember.trim()) {
          onAdd(newMember.trim());
          setNewMember("");
        }
      }}
      disabled={!newMember.trim()}
    >
      Přidat člena
    </button>
  </div>
)}


        {/* FOOTER */}
        <div style={styles.footer}>
          <button style={dangerButton} onClick={onClose}>
            Zavřít
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
    maxWidth: "420px",
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
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  empty: {
    color: colors.muted,
    fontStyle: "italic",
    textAlign: "center",
  },

  memberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: "12px",
    background: colors.bgInput,
    fontWeight: "600",
  },

  addSection: {
    padding: "16px 24px",
    borderTop: `1px solid ${colors.border}`,
    display: "grid",
    gridTemplateColumns:"1fr auto",
    gap: "10px",
    alignItems: "center",
  },

  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    border: `1px solid ${colors.border}`,
    background: colors.bgInput, 
    fontSize: "0.95rem",
    color: colors.text,
  },

  footer: {
    padding: "16px 24px",
    borderTop: `1px solid ${colors.border}`,
    display: "flex",
    justifyContent: "flex-end",
  },
};

export default MembersModal;