import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./locales/i18n"; 
import ShoppingListsRoute from "./routes/ShoppingListsRoute";
import ShoppingListDetail from "./routes/ShoppingListDetail";
import { calls } from "./api/calls";
import "./App.css";

/* =========================
   APP
========================= */

function App() {
  const { t, i18n } = useTranslation();
  const currentUserId = "user-123";

  // Data a stavy
  const [lists, setLists] = useState([]);
  const [status, setStatus] = useState("pending");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Přepínání Dark Mode 
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Inicializační načtení dat
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

  // API akce
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

  // Ošetření stavů načítání
  if (status === "pending") {
    return <div className="loading-screen">{t('detail.loading', 'Načítání dat…')}</div>;
  }

  if (status === "error") {
    return (
      <div className="error-screen">
        {t('detail.error', 'Chyba při načítání dat ze serveru')}
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* PANEL PRO PŘEPÍNAČE */}
    <div className="top-settings-bar">
      {/* INDIKÁTOR JAZYKA */}
      <div className="language-selector">
        <button 
          onClick={() => i18n.changeLanguage('cs')} 
          className={`lang-btn ${i18n.language === 'cs' ? 'active' : ''}`}
        >
          CZ
        </button>
        <span className="separator">|</span>
        <button 
          onClick={() => i18n.changeLanguage('en')} 
          className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        >
          EN
        </button>
      </div>

        {/* PŘEPÍNAČ DARK MODE */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="settings-btn"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
</div>

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
   DETAIL ROUTE (Sub-komponenta)
========================= */

function DetailRoute({
  lists,
  currentUserId,
  onUpdateList,
  onToggleArchive,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const list = lists.find((l) => l.id === id);

  if (!list) {
    return (
      <div className="not-found-container">
        <h2>{t('detail.notFound')}</h2>
        <button className="back-btn-primary" onClick={() => navigate("/lists")}>
          {t('app.backBtn')}
        </button>
      </div>
    );
  }

  return (
    <div className="detail-route-wrapper">
      <button
        onClick={() => navigate("/lists")}
        className="back-btn-ui"
      >
        {t('app.backBtn')}
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