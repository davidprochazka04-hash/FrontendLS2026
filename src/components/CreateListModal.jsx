import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CreateListModal = ({ isOpen, onClose, onCreate }) => {
  const [newListName, setNewListName] = useState("");
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreate(newListName.trim());
    setNewListName("");
    onClose();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Titulek: Nový nákupní seznam / Create new */}
        <h2 style={styles.title}>{t('detail.createNew')}</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            autoFocus
            style={styles.input}
            /* Placeholder: Zadejte název... / Enter name... */
            placeholder={t('modal.placeholder', 'Zadejte název...')} 
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          
          <div style={styles.btnRow}>
            {/* Tlačítko: Vytvořit / Create */}
            <button type="submit" style={styles.primaryBtn}>
               {t('modal.create', 'Vytvořit')}
            </button>
            {/* Tlačítko: Zrušit / Cancel */}
            <button type="button" onClick={onClose} style={styles.secondaryBtn}>
              {t('modal.cancel', 'Zrušit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --- STYLY --- */
const styles = {
  modalOverlay: { 
    position: 'fixed', 
    top: 0, left: 0, right: 0, bottom: 0, 
    background: 'rgba(0,0,0,0.6)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 2000, 
    backdropFilter: 'blur(4px)' 
  },
  modalContent: { 
    background: 'var(--bg-card)', 
    padding: '32px', 
    borderRadius: '24px', 
    width: '90%', 
    maxWidth: '400px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
  },
  title: { 
    marginTop: 0, 
    color: 'var(--text-main)', 
    fontWeight: '800',
    fontSize: '1.5rem',
    marginBottom: '20px'
  },
  input: { 
    width: '100%', 
    padding: '14px', 
    borderRadius: '12px', 
    border: '2px solid var(--border-color)', 
    boxSizing: 'border-box', 
    fontSize: '1rem',
    background: 'var(--bg-secondary)',
    color: 'var(--text-main)',
    outline: 'none'
  },
  btnRow: { 
    display: 'flex', 
    gap: '12px', 
    marginTop: '24px' 
  },
  primaryBtn: { 
    background: 'var(--primary)', 
    color: '#fff', 
    border: 'none', 
    padding: '12px 20px', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontWeight: '700', 
    flex: 1,
    fontSize: '1rem'
  },
  secondaryBtn: { 
    background: 'transparent', 
    color: 'var(--danger)',
    border: '2px solid var(--danger)', 
    padding: '12px 20px', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontWeight: '700', 
    flex: 1,
    fontSize: '1rem'
  }
};

export default CreateListModal;