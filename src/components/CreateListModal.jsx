import React, { useState } from 'react';
import { colors } from "../styles/theme";

const CreateListModal = ({ isOpen, onClose, onCreate }) => {
  const [newListName, setNewListName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreate(newListName.trim());
    setNewListName("");
    onClose();
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={titleStyle}>Nový nákupní seznam</h2>
        <form onSubmit={handleSubmit}>
          <input 
            autoFocus
            style={inputStyle}
            placeholder="Zadejte název..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={primaryBtn}>Vytvořit</button>
            <button type="button" onClick={onClose} style={secondaryBtn}>Zrušit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --- STYLY (zkopírované z tvého kódu) --- */
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContentStyle = { background: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px' };
const titleStyle = { marginTop: 0, color: '#1a1a1a', fontWeight: '800' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '1rem',background: colors.bgInput,color: colors.text};
const primaryBtn = { background: '#076dd2', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', flex: 1 };
const secondaryBtn = { background: '#f00c0c', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', flex: 1 };

export default CreateListModal;