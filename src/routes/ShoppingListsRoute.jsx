import React, { useState } from 'react';
import { mockShoppingLists } from '../mockData';
import Header from '../components/Header';

const ShoppingListsRoute = ({ currentUserId, onSelectList }) => {
  const [showArchived, setShowArchived] = useState(false);

  const filteredLists = mockShoppingLists.filter(list => 
    showArchived ? true : !list.isArchived
  );

  return (
    <div className="detail-container">
      <Header 
        showArchived={showArchived} 
        onToggleArchived={() => setShowArchived(!showArchived)} 
      />
           <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filteredLists.map(list => (
          <div 
            key={list.id} 
            onClick={() => onSelectList(list)}
            style={{ 
              border: '2px solid #333', 
              padding: '20px', 
              cursor: 'pointer', 
              background: '#fff',
              borderRadius: '8px'
            }}
          >
            <h3>{list.name} {list.isArchived && "📁"}</h3>
            <p>Položek: {list.items.length}</p>
            <p>Role: {list.ownerId === currentUserId ? "👑 Majitel" : "👥 Člen"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingListsRoute;