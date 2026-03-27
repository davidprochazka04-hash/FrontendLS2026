import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreateListModal from "../components/CreateListModal";
import {
  DeleteIcon,
  ArchiveIcon,
  RestoreIcon,
} from "../styles/buttonStyles";

const ShoppingListsRoute = ({
  lists,
  currentUserId = "user-123",
  onCreateList,
  onDeleteList,
  onToggleArchive,
}) => {
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // přístup: owner nebo člen
  const accessibleLists = useMemo(() => {
    return lists.filter((l) => {
      const isOwner = l.ownerId === currentUserId;
      const isMember = (l.members || []).some(
        (m) => m.id === currentUserId
      );
      return isOwner || isMember;
    });
  }, [lists, currentUserId]);

  const filteredLists = useMemo(() => {
    return accessibleLists.filter((l) =>
      showArchived ? true : !l.isArchived
    );
  }, [accessibleLists, showArchived]);

  const handleCreate = (name) => {
    onCreateList(name);
    setIsModalOpen(false);
  };

  const handleDelete = (e, list) => {
    e.stopPropagation();
    if (window.confirm(`Opravdu chcete smazat seznam "${list.name}"?`)) {
      onDeleteList(list.id);
    }
  };

  const handleArchive = (e, list) => {
    e.stopPropagation();
    onToggleArchive(list.id);
  };

  return (
    <div style={styles.container}>
      <Header
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived((p) => !p)}
        onNewListClick={() => setIsModalOpen(true)}
      />

      <div style={styles.grid}>
        {filteredLists.map((list) => {
          const isOwner = list.ownerId === currentUserId;

          return (
            <div
              key={list.id}
              style={styles.card}
              onClick={() => navigate(`/lists/${list.id}`)}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{list.name}</h3>

                <div style={styles.actions}>
                  {isOwner && (
                    <button
                      title={
                        list.isArchived
                          ? "Obnovit z archivu"
                          : "Archivovat"
                      }
                      onClick={(e) => handleArchive(e, list)}
                      style={styles.iconBtn}
                    >
                      {list.isArchived ? (
                        <RestoreIcon />
                      ) : (
                        <ArchiveIcon />
                      )}
                    </button>
                  )}

                  {isOwner && (
                    <button
                      title="Smazat seznam"
                      onClick={(e) => handleDelete(e, list)}
                      style={styles.deleteIconBtn}
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.meta}>
                <div>Položek: {(list.items || []).length}</div>
                <div>
                  Role: {isOwner ? "👑 Majitel" : "👥 Člen"}
                </div>

                {list.isArchived && (
                  <div style={styles.archivedBadge}>
                    Archivováno
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Inter', sans-serif",
  },

  grid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    marginTop: "30px",
  },

  card: {
    border: "1px solid #f1f3f5",
    padding: "24px",
    cursor: "pointer",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    transition: "transform 0.1s ease",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: 12,
  },

  cardTitle: {
    margin: 0,
    color: "#000",
    fontWeight: "800",
  },

  actions: {
    display: "flex",
    gap: "6px",
  },

  iconBtn: {
    background: "transparent",
    border: "1px solid #eee",
    borderRadius: "10px",
    cursor: "pointer",
    padding: "6px 10px",
    opacity: 0.85,
  },

  deleteIconBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.4rem",
    fontWeight: "900",
    color: "#ff4d4f",
    lineHeight: "1",
    padding: "4px 6px",
    borderRadius: "8px",
  },

  meta: {
    display: "grid",
    gap: 6,
    color: "#333",
    fontWeight: 600,
  },

  archivedBadge: {
    display: "inline-block",
    marginTop: 8,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#fff0f0",
    color: "#ff4d4f",
    width: "fit-content",
    fontSize: 12,
    fontWeight: 800,
  },
};

export default ShoppingListsRoute;