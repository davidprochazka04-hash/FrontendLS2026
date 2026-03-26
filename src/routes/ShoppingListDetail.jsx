import React, { useState } from 'react';
import Header from '../components/Header';

const INITIAL_DATA = {
  id: "list-001",
  name: "Nákup v Albertu",
  ownerId: "user-123",
  isArchived: false,
  members: [
    { id: "m-1", name: "Jan Novák" },
    { id: "m-2", name: "Marie Stará" }
  ],
  items: [
    { id: "i-1", name: "Čerstvé máslo", state: "unresolved" },
    { id: "i-2", name: "Celozrnné rohlíky", state: "resolved" },
    { id: "i-3", name: "Plzeň 12° (6-pack)", state: "unresolved" },
    { id: "i-4", name: "Prací prášek", state: "unresolved" }
  ]
};

const ShoppingListDetail = ({ currentUserId = "user-123" }) => {
  const [list, setList] = useState(INITIAL_DATA);
  const [showResolved, setShowResolved] = useState(true);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const isOwner = list?.ownerId === currentUserId;

  // --- LOGIKA PRO CELÝ SEZNAM ---
  const handleCreateNewList = () => {
    const newName = prompt("Zadejte název nového seznamu:");
    if (newName?.trim()) {
      setList({
        id: `list-${Date.now()}`,
        name: newName.trim(),
        ownerId: currentUserId,
        isArchived: false,
        members: [],
        items: []
      });
    }
  };

  const handleDeleteList = () => {
    if (window.confirm(`Opravdu chcete smazat celý seznam "${list.name}"? Tato akce je nevratná.`)) {
      setList(null); // Stav na null, což simuluje smazání
    }
  };

  // --- LOGIKA PRO POLOŽKY ---
  const handleToggleItem = (itemId) => {
    setList(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, state: item.state === 'resolved' ? 'unresolved' : 'resolved' } : item
      )
    }));
  };

  const handleAddItem = () => {
    const name = prompt("Co potřebujete koupit?");
    if (name?.trim()) {
      const newItem = { id: Date.now().toString(), name: name.trim(), state: 'unresolved' };
      setList(prev => ({ ...prev, items: [newItem, ...prev.items] }));
    }
  };

  // --- LOGIKA PRO ČLENY ---
  const handleAddMember = () => {
    const name = prompt("Jméno nového člena:");
    if (name?.trim()) {
      const newMember = { id: `m-${Date.now()}`, name: name.trim() };
      setList(prev => ({ ...prev, members: [...prev.members, newMember] }));
    }
  };

  const handleRemoveMember = (memberId) => {
    const isSelf = memberId === currentUserId;
    if (isOwner || isSelf) {
      if (window.confirm(isSelf ? "Opravdu chcete opustit seznam?" : "Odebrat člena?")) {
        setList(prev => ({
          ...prev,
          members: prev.members.filter(m => m.id !== memberId)
        }));
        if (isSelf) setIsMembersModalOpen(false);
      }
    }
  };

  // --- STAV: SEZNAM SMAZÁN ---
  if (!list) {
    return (
      <div style={containerStyle}>
        <Header onNewListClick={handleCreateNewList} />
        <main style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2 style={{ color: '#adb5bd' }}>Žádný aktivní nákupní seznam</h2>
          <button onClick={handleCreateNewList} style={primaryBtn}>Vytvořit nový seznam</button>
        </main>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Header 
        onNewListClick={handleCreateNewList}
        onToggleArchived={() => setList(p => ({ ...p, isArchived: !p.isArchived }))}
        showArchived={list.isArchived}
      />

      <main style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
             <span style={badgeStyle}>{isOwner ? "Vlastník" : "Člen"}</span>
             {list.isArchived && <span style={{...badgeStyle, background: '#ffeded', color: '#ff4d4f'}}>Archivováno</span>}
          </div>
          <h2 style={{ fontSize: '2.8rem', margin: 0, color: '#1a1a1a', letterSpacing: '-1px' }}>
            {list.name}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {isOwner && (
            <button style={secondaryBtn} onClick={() => setList({...list, name: prompt("Nový název:", list.name) || list.name})}>
              ✎ Upravit název
            </button>
          )}
          <button style={secondaryBtn} onClick={() => setIsMembersModalOpen(true)}>
            👥 Členové ({list.members.length})
          </button>
          {isOwner && (
            <button 
              style={{...secondaryBtn, color: '#ff4d4f', borderWidth: '1px', borderStyle: 'solid', borderColor: '#ff4d4f'}}
              onClick={handleDeleteList}
            >
              🗑 Smazat seznam
            </button>
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={handleAddItem} style={primaryBtn}>+ Přidat položku</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem' }}>
              <span>Zobrazit vyřešené</span>
              <input type="checkbox" checked={showResolved} onChange={() => setShowResolved(!showResolved)} style={checkboxToggleStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {list.items
              .filter(item => showResolved || item.state === 'unresolved')
              .map(item => (
                <div key={item.id} style={itemRowStyle(item.state === 'resolved')}>
                  <div onClick={() => handleToggleItem(item.id)} style={customCheckStyle(item.state === 'resolved')}>
                    {item.state === 'resolved' && "✓"}
                  </div>
                  <span style={{ flexGrow: 1, fontSize: '1.1rem', color: item.state === 'resolved' ? '#adb5bd' : '#2d3436', textDecoration: item.state === 'resolved' ? 'line-through' : 'none' }}>
                    {item.name}
                  </span>
                  <button onClick={() => setList(p => ({...p, items: p.items.filter(i => i.id !== item.id)}))} style={deleteBtnStyle}>✕</button>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* --- MODÁLNÍ OKNO ČLENŮ --- */}
      {isMembersModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsMembersModalOpen(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Členové seznamu</h3>
              <button onClick={() => setIsMembersModalOpen(false)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                <strong>👑 Vlastník (ID: {list.ownerId})</strong>
              </div>
              {list.members.map(m => (
                <div key={m.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{m.name} {m.id === currentUserId && "(Vy)"}</span>
                  {(isOwner || m.id === currentUserId) && (
                    <button 
                      onClick={() => handleRemoveMember(m.id)} 
                      style={{ color: '#ff4d4f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600' }}
                    >
                      {m.id === currentUserId ? "Opustit" : "Odebrat"}
                    </button>
                  )}
                </div>
              ))}
              {isOwner && (
                <button onClick={handleAddMember} style={{ ...secondaryBtn, marginTop: '10px', width: '100%' }}>
                  + Přidat člena
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- STYLY --- */
const containerStyle = { maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif" };
const badgeStyle = { background: '#e9ecef', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#495057' };
const cardStyle = { background: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', borderWidth: '1px', borderStyle: 'solid', borderColor: '#f1f3f5' };
const primaryBtn = { background: '#007AFF', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', boxShadow: '0 4px 12px rgba(0,122,255,0.3)' };
const secondaryBtn = { background: '#fff', borderWidth: '1px', borderStyle: 'solid', borderColor: '#dee2e6', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', color: '#495057', transition: 'all 0.2s' };
const itemRowStyle = (isResolved) => ({ display: 'flex', alignItems: 'center', padding: '16px 20px', background: isResolved ? '#f8f9fa' : '#fff', borderRadius: '16px', borderWidth: '1px', borderStyle: 'solid', borderColor: isResolved ? '#e9ecef' : '#f1f3f5' });
const customCheckStyle = (checked) => ({ width: '26px', height: '26px', borderRadius: '8px', borderWidth: checked ? '0' : '2px', borderStyle: 'solid', borderColor: '#dee2e6', background: checked ? '#34C759' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginRight: '15px', cursor: 'pointer' });
const deleteBtnStyle = { background: 'none', border: 'none', color: '#ced4da', fontSize: '1.2rem', cursor: 'pointer' };
const checkboxToggleStyle = { width: '18px', height: '18px', cursor: 'pointer' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#fff', padding: '30px', borderRadius: '24px', width: '90%', maxWidth: '400px' };
const closeBtnStyle = { border: 'none', background: '#f1f3f5', cursor: 'pointer', fontSize: '1rem', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default ShoppingListDetail;