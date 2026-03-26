import React, { useState } from 'react';
import ShoppingListsRoute from './routes/ShoppingListsRoute';
import ShoppingListDetail from './routes/ShoppingListDetail';
import './App.css';

function App() {
  const currentUserId = "user-123";
  const [selectedList, setSelectedList] = useState(null);

  return (
    <div className="App">
      {selectedList ? (
        // DETAIL SEZNAMU Tlačítko Zpět)
        <div>
          <button 
            onClick={() => setSelectedList(null)}
            style={{ marginBottom: '10px', cursor: 'pointer', padding: '5px 10px' }}
          >
            ← Zpět na všechny seznamy
          </button>
          <ShoppingListDetail 
            currentUserId={currentUserId} 
            initialData={selectedList} 
          />
        </div>
      ) : (
        // PŘEHLED VŠECH SEZNAMŮ
        <ShoppingListsRoute 
          currentUserId={currentUserId} 
          onSelectList={(list) => setSelectedList(list)} 
        />
      )}
    </div>
  );
}

export default App;