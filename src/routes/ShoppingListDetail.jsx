import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MembersModal from "../components/MembersModal";
import AddItemModal from "../components/AddItemModal";
import { AddIcon, MembersIcon } from "../styles/buttonStyles";

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

  // editace názvu
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(listData?.name ?? "");

  const isOwner = list?.ownerId === currentUserId;

  useEffect(() => {
    setList(listData);
    setTitleDraft(listData?.name ?? "");
  }, [listData]);

  
  const update = (updater) => {
    setList((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      onUpdateList?.(next);
      return next;
    });
  };

  const handleToggleItem = (itemId) => {
    update((prev) => ({
      ...prev,
      items: (prev.items || []).map((item) =>
        item.id === itemId
          ? {
              ...item,
              state: item.state === "resolved" ? "unresolved" : "resolved",
            }
          : item
      ),
    }));
  };

  // přidání položky z modalu
  const handleAddItem = (name) => {
    update((prev) => ({
      ...prev,
      items: [
        {
          id: Date.now().toString(),
          name,
          state: "unresolved",
        },
        ...(prev.items || []),
      ],
    }));
  };

  const handleRemoveItem = (itemId) => {
    update((prev) => ({
      ...prev,
      items: (prev.items || []).filter((i) => i.id !== itemId),
    }));
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

        {/* EDITACE NÁZVU */}
        {isOwner && isEditingTitle ? (
          <input
            value={titleDraft}
            autoFocus
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={() => {
              if (titleDraft.trim() && titleDraft !== list.name) {
                update((prev) => ({ ...prev, name: titleDraft.trim() }));
              }
              setIsEditingTitle(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.target.blur();
              if (e.key === "Escape") {
                setTitleDraft(list.name);
                setIsEditingTitle(false);
              }
            }}
            style={styles.titleInput}
          />
        ) : (
          <h2
            style={styles.detailTitle}
            onClick={() => isOwner && setIsEditingTitle(true)}
          >
            {list.name}
            {isOwner && <span style={styles.editIcon}> ✏️</span>}
          </h2>
        )}

        {/* TLAČÍTKA */}
        <div style={styles.detailActions}>
          <button
            style={styles.actionBtn}
            onClick={() => setIsMembersModalOpen(true)}
          >
            <MembersIcon/> Členové ({list.members?.length || 0})
          </button>

          <button
            style={styles.actionBtn}
            onClick={() => setIsAddItemModalOpen(true)}
          >
            <AddIcon /> Přidat položku
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

                <div style={styles.itemText(resolved)}>{item.name}</div>

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
          onAdd={(name) =>
            update((prev) => ({
              ...prev,
              members: [
                ...(prev.members || []),
                { id: Date.now().toString(), name },
              ],
            }))
          }
          onRemove={(id) =>
            update((prev) => ({
              ...prev,
              members: prev.members.filter((m) => m.id !== id),
            }))
          }
          onClose={() => setIsMembersModalOpen(false)}
        />
      )}

      </div>
  );
};

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
    cursor: "pointer",
  },
  titleInput: {
    fontSize: "2rem",
    fontWeight: "900",
    textAlign: "center",
    border: "2px solid #000",
    borderRadius: "12px",
    padding: "6px 12px",
  },
  editIcon: {
    fontSize: "1rem",
    opacity: 0.6,
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
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "160px",
    justifyContent: "center",
    color: "#000000",
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
