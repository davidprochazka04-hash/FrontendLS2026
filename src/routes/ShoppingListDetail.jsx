import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MembersModal from "../components/MembersModal";
import AddItemModal from "../components/AddItemModal";
import { AddIcon, MembersIcon } from "../styles/buttonStyles";
import { calls } from "../api/calls";

const ShoppingListDetail = ({
  listData,
  currentUserId = "user-123",
  onUpdateList,
  onToggleArchive,
}) => {
  const [list, setList] = useState(listData);
  const [showResolved, setShowResolved] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const isOwner = list?.ownerId === currentUserId;

  useEffect(() => {
    setList(listData);
  }, [listData]);

  /* =========================
     SERVER‑BASED OPERATIONS
  ========================= */

  const updateFromServer = async (updatedListPromise) => {
    const updatedList = await updatedListPromise;
    setList(updatedList);
    onUpdateList(updatedList);
  };

  const handleToggleItem = async (itemId) => {
    updateFromServer(calls.toggleItem(list.id, itemId));
  };

  const handleAddItem = async (name) => {
    updateFromServer(calls.addItem(list.id, name));
  };

  const handleRemoveItem = async (itemId) => {
    updateFromServer(calls.removeItem(list.id, itemId));
  };

  const handleAddMember = async (name) => {
    updateFromServer(calls.addMember(list.id, name));
  };

  const handleRemoveMember = async (memberId) => {
    updateFromServer(calls.removeMember(list.id, memberId));
  };

  if (!list) return <div>Načítání…</div>;

  return (
    <div style={styles.container}>
      <Header
        showArchived={list.isArchived}
        onToggleArchived={onToggleArchive}
      />

      <div style={styles.detailHeaderWrapper}>
        <div style={styles.badgeRow}>
          <span style={styles.badge}>
            {isOwner ? "👑 Vlastník" : "👥 Člen"}
          </span>
          {list.isArchived && (
            <span style={styles.archiveBadge}>Archivováno</span>
          )}
        </div>

        <h2 style={styles.detailTitle}>{list.name}</h2>

        {/* TLAČÍTKA */}
        <div style={styles.detailActions}>
          
          <button
            style={styles.actionBtn}
            onClick={() => setIsMembersModalOpen(true)}
          >
            <MembersIcon />
            <span style={styles.actionBtnText}>
              Členové ({list.members?.length || 0})
            </span>
          </button>

          <button
            style={styles.actionBtn}
            onClick={() => setIsAddItemModalOpen(true)}
          >
            <AddIcon />
            <span style={styles.actionBtnText}>
              Přidat položku
            </span>
          </button>


          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showResolved}
              onChange={() => setShowResolved((p) => !p)}
            />
            Zobrazit vyřešené
          </label>
        </div>
      </div>

      {/* SEZNAM POLOŽEK */}
      <div style={styles.card}>
        {(list.items || [])
          .filter((item) =>
            showResolved ? true : item.state === "unresolved"
          )
          .map((item) => {
            const resolved = item.state === "resolved";

            return (
              <div key={item.id} style={styles.itemRow(resolved)}>
                <div
                  style={styles.customCheck(resolved)}
                  onClick={() => handleToggleItem(item.id)}
                >
                  {resolved && "✓"}
                </div>

                <div style={styles.itemText(resolved)}>
                  {item.name}
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
            );
          })}
      </div>

      {/* MODAL: PŘIDAT POLOŽKU */}
      {isAddItemModalOpen && (
        <AddItemModal
          onAdd={handleAddItem}
          onClose={() => setIsAddItemModalOpen(false)}
        />
      )}

      {/* MODAL: ČLENOVÉ */}
      {isMembersModalOpen && (
        <MembersModal
          members={list.members || []}
          isOwner={isOwner}
          onAdd={handleAddMember}
          onRemove={handleRemoveMember}
          onClose={() => setIsMembersModalOpen(false)}
        />
      )}
    </div>
  );
};

/* =========================
   STYLES
========================= */

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  detailHeaderWrapper: {
    textAlign: "center",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  detailTitle: {
    fontSize: "2rem",
    fontWeight: "900",
    color: "#000",
    margin: "10px 0",
  },
  badgeRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  badge: {
    background: "#eee",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "0.8rem",
  },
  archiveBadge: {
    background: "#ffeded",
    color: "#ff4d4f",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "0.8rem",
  },
  detailActions: {
    marginTop: "15px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  actionBtn: {
    background: "#ffffff",
    border: "2px solid #000000",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "0.9rem",
    color:"#000",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "160px",
    justifyContent: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "700",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    border: "1px solid #eee",
  },
  itemRow: (resolved) => ({
    display: "flex",
    alignItems: "center",
    padding: "15px",
    marginBottom: "10px",
    background: resolved ? "#f9f9f9" : "#ffffff",
    borderRadius: "12px",
    border: "2px solid #eeeeee",
  }),
  itemText: (resolved) => ({
    flexGrow: 1,
    fontSize: "1.1rem",
    fontWeight: "800",
    color: resolved ? "#999999" : "#000000",
    textDecoration: resolved ? "line-through" : "none",
  }),
  customCheck: (checked) => ({
    width: "25px",
    height: "25px",
    border: "2px solid #000",
    borderRadius: "6px",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: checked ? "#000" : "transparent",
    color: "#fff",
    cursor: "pointer",
  }),
  removeBtn: {
    background: "none",
    border: "none",
    color: "#ff4d4f",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
};

export default ShoppingListDetail;