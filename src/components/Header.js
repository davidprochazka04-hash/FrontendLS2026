import React from 'react';


const Header = ({ onNewListClick, onToggleArchived, showArchived }) => {
  return (
    <header style={headerStyle}>
      <div style={logoSection}>
        <div style={logoIcon}>🛒</div>
        <h1 style={logoText}>Moje nákupní seznamy</h1>
      </div>

      <div style={buttonGroup}>
        {onToggleArchived && (
          <button
            style={showArchived ? activeToggleStyle : toggleStyle}
            onClick={onToggleArchived}
          >
            {showArchived ? "📜 Skrýt archiv" : "📜 Archiv"}
          </button>
        )}

        {/* TLAČÍTKO SE ZOBRAZÍ JEN KDYŽ EXISTUJE HANDLER */}
        {onNewListClick && (
          <button
            style={primaryBtnStyle}
            onClick={onNewListClick}
          >
            <span>＋</span> Nový seznam
          </button>
        )}
      </div>
    </header>
  );
};


const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  gap: '40px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#f1f3f5',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  marginBottom: '30px',
  position: 'sticky',
  top: '20px',
  zIndex: 100
};

const logoSection = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
};

const logoIcon = {
  fontSize: '1.5rem',
  background: '#f8f9fa',
  padding: '8px',
  borderRadius: '12px'
};

const logoText = {
  margin: 0,
  fontSize: '1.4rem', 
  fontWeight: '900',  
  color: '#000000',   
  letterSpacing: '-0.7px' 
};

const buttonGroup = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
};

const toggleStyle = {
  background: 'transparent',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#dee2e6',
  padding: '8px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#495057',
  transition: 'all 0.2s'
};

const activeToggleStyle = {
  ...toggleStyle,
  background: '#f1f3f5',
  borderColor: '#adb5bd', 
  color: '#212529'
};

const primaryBtnStyle = {
  background: '#000',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

export default Header;