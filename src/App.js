import React, { useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";

import ShoppingListsRoute from "./routes/ShoppingListsRoute";
import ShoppingListDetail from "./routes/ShoppingListDetail";
import "./App.css";

const INITIAL_DATA_SOURCE = [
  {
    id: "list-001",
    name: "Nákup v Albertu",
    ownerId: "user-123",
    isArchived: false,
    members: [
      { id: "m-1", name: "Jan Novák" },
      { id: "m-2", name: "Marie Stará" },
    ],
    items: [
      { id: "i-1", name: "Čerstvé máslo", state: "unresolved" },
      { id: "i-2", name: "Celozrnné rohlíky", state: "resolved" },
      { id: "i-3", name: "Plzeň 12° (6-pack)", state: "unresolved" },
    ],
  },
  {
    id: "list-002",
    name: "Grilovačka sobota",
    ownerId: "user-123",
    isArchived: false,
    members: [],
    items: [
      { id: "i-g1", name: "Krkovice 1kg", state: "unresolved" },
      { id: "i-g2", name: "Brikety", state: "unresolved" },
      { id: "i-g3", name: "Hořčice plnotučná", state: "unresolved" },
    ],
  },
  {
    id: "list-003",
    name: "Dárky Vánoce",
    ownerId: "user-456",
    isArchived: true,
    members: [{ id: "m-3", name: "Petr Svoboda" }],
    items: [{ id: "i-v1", name: "Ponožky", state: "resolved" }],
  },
];

function App() {
  const currentUserId = "user-123";
  const [lists, setLists] = useState(INITIAL_DATA_SOURCE);

  const actions = useMemo(() => {
    return {
      createList: (name) => {
        const newList = {
          id: `list-${Date.now()}`,
          name,
          ownerId: currentUserId,
          isArchived: false,
          members: [],
          items: [],
        };

        setLists((prev) => [...prev, newList]);
        return newList.id; 
      },

      deleteList: (id) => {
        setLists((prev) => prev.filter((l) => l.id !== id));
      },

      toggleArchive: (id) => {
        setLists((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, isArchived: !l.isArchived } : l
          )
        );
      },

      updateList: (updatedList) => {
        setLists((prev) =>
          prev.map((l) => (l.id === updatedList.id ? updatedList : l))
        );
      },
    };
  }, [currentUserId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lists" replace />} />

        <Route
          path="/lists"
          element={
            <ShoppingListsRoute
              lists={lists}
              currentUserId={currentUserId}
              onCreateList={actions.createList}
              onDeleteList={actions.deleteList}
              onToggleArchive={actions.toggleArchive}
            />
          }
        />

        <Route
          path="/lists/:id"
          element={
            <DetailRoute
              lists={lists}
              currentUserId={currentUserId}
              onUpdateList={actions.updateList}
              onToggleArchive={actions.toggleArchive}
            />
          }
        />

        <Route path="*" element={<Navigate to="/lists" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function DetailRoute({
  lists,
  currentUserId,
  onUpdateList,
  onToggleArchive,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const list = lists.find((l) => l.id === id);

  if (!list) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Seznam nenalezen</h2>
        <button onClick={() => navigate("/lists")}>← Zpět</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
      <button
        onClick={() => navigate("/lists")}
        style={{
          marginBottom: "20px",
          cursor: "pointer",
          padding: "10px 18px",
          background: "#fff",
          border: "1px solid #dee2e6",
          borderRadius: "12px",
          fontWeight: "700",
          color: "#000",
          whiteSpace: "nowrap",
        }}
      >
        ← Zpět na všechny seznamy
      </button>

      <ShoppingListDetail
        listData={list}
        currentUserId={currentUserId}
        onUpdateList={onUpdateList}
        onToggleArchive={() => onToggleArchive(list.id)}
      />
    </div>
  );
}

export default App;