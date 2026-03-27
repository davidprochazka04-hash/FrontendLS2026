import React, { useEffect, useMemo, useState } from "react";
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
import { calls } from "./api/calls";
import "./App.css";

/* =========================
   APP
========================= */

function App() {
  const currentUserId = "user-123";

  //data ze serveru (mock / backend)
  const [lists, setLists] = useState([]);
  const [status, setStatus] = useState("pending"); // pending | ready | error

  // inicializační načtení dat
  useEffect(() => {
    setStatus("pending");

    calls
      .listLists()
      .then((data) => {
        setLists(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  // veškeré operace nad daty jdou přes serverovou vrstvu
  const actions = useMemo(() => {
    return {
      createList: async (name) => {
        const newList = await calls.createList(name, currentUserId);
        setLists((prev) => [...prev, newList]);
        return newList.id;
      },

      deleteList: async (id) => {
        await calls.deleteList(id);
        setLists((prev) => prev.filter((l) => l.id !== id));
      },

      toggleArchive: async (id) => {
        const updated = await calls.toggleArchive(id);
        setLists((prev) =>
          prev.map((l) => (l.id === id ? updated : l))
        );
      },

      updateList: async (updatedList) => {
        const saved = await calls.updateList(updatedList);
        setLists((prev) =>
          prev.map((l) => (l.id === saved.id ? saved : l))
        );
      },
    };
  }, [currentUserId]);

  // ošetření stavů načítání / chyby
  if (status === "pending") {
    return <div style={{ padding: 40 }}>Načítání dat…</div>;
  }

  if (status === "error") {
    return (
      <div style={{ padding: 40, color: "red" }}>
        Chyba při načítání dat ze serveru
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lists" replace />} />

        {/* ROUTE: PŘEHLED SEZNAMŮ */}
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

        {/* ROUTE: DETAIL SEZNAMU */}
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

/* =========================
   DETAIL ROUTE
========================= */

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
        <button onClick={() => navigate("/lists")}>
          ← Zpět na seznamy
        </button>
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