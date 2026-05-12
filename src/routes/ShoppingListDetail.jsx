import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
  const { t } = useTranslation();
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
    try {
      const updatedList = await updatedListPromise;
      setList(updatedList);
      onUpdateList(updatedList);
    } catch (error) {
      alert(t('detail.error', 'Chyba při komunikaci se serverem'));
      console.error(error);
    }
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

  if (!list) return <div className="loading-text">{t('detail.loading', 'Načítání…')}</div>;

  // DATA PRO KOLÁČOVÝ GRAF
  const resolvedCount = list.items?.filter(i => i.state === 'resolved').length || 0;
  const unresolvedCount = list.items?.filter(i => i.state === 'unresolved').length || 0;
  
  const pieData = [
    { name: t('detail.resolved'), value: resolvedCount },
    { name: t('detail.unresolved'), value: unresolvedCount }
  ];
  
  const COLORS = ['#10B981', '#EF4444']; // Zelená (Resolved), Červená (Unresolved)

  return (
    <div style={styles.container}>
      <Header
        showArchived={list.isArchived}
        onToggleArchived={onToggleArchive}
      />

      <div style={styles.detailHeaderWrapper}>
        <div style={styles.badgeRow}>
          <span style={styles.badge}>
            {isOwner ? t('route.owner') : t('route.member')}
          </span>
          {list.isArchived && (
            <span style={styles.archiveBadge}>{t('detail.archiveBadge', 'Archivováno')}</span>
          )}
        </div>

        <h2 style={styles.detailTitle}>{list.name}</h2>

        <div style={styles.detailActions}>
          <button style={styles.actionBtn} onClick={() => setIsMembersModalOpen(true)}>
            <MembersIcon />
            <span style={styles.actionBtnText}>
              {t('detail.members')} ({list.members?.length || 0})
            </span>
          </button>

          <button style={styles.actionBtn} onClick={() => setIsAddItemModalOpen(true)}>
            <AddIcon />
            <span style={styles.actionBtnText}>
              {t('detail.addItem')}
            </span>
          </button>

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showResolved}
              onChange={() => setShowResolved((p) => !p)}
            />
            {t('detail.showResolved')}
          </label>
        </div>
      </div>

      {/* STATISTIKA: KOLÁČOVÝ GRAF */}
      {(resolvedCount > 0 || unresolvedCount > 0) && (
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>{t('detail.chartTitle', 'Přehled počtu položek')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* SEZNAM POLOŽEK */}
      <div style={styles.card}>
        {(list.items || [])
          .filter((item) => (showResolved ? true : item.state === "unresolved"))
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

      {isAddItemModalOpen && (
        <AddItemModal
          onAdd={handleAddItem}
          onClose={() => setIsAddItemModalOpen(false)}
        />
      )}

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
    STYLES (DARK MODE READY)
========================= */

const styles = {
  container: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "0 15px 40px 15px",
  },
  detailHeaderWrapper: {
    textAlign: "center",
    padding: "30px 20px",
    background: "var(--bg-secondary)",
    borderRadius: "24px",
    marginBottom: "20px",
    border: "1px solid var(--border-color)",
  },
  detailTitle: {
    fontSize: "clamp(1.5rem, 5vw, 2.2rem)", // Responzivní velikost písma
    fontWeight: "900",
    color: "var(--text-main)",
    margin: "15px 0",
  },
  badgeRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  badge: {
    background: "var(--border-color)",
    color: "var(--text-main)",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  archiveBadge: {
    background: "#ffeded",
    color: "#ff4d4f",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  detailActions: {
    marginTop: "20px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtn: {
    background: "var(--bg-card)",
    border: "2px solid var(--text-main)",
    padding: "10px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "0.9rem",
    color: "var(--text-main)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.2s",
  },
  actionBtnText: {
    whiteSpace: "nowrap",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
    color: "var(--text-main)",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  chartCard: {
    background: "var(--bg-card)",
    padding: "20px",
    borderRadius: "24px",
    border: "1px solid var(--border-color)",
    marginBottom: "20px",
  },
  chartTitle: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "1.1rem",
    color: "var(--text-main)",
  },
  card: {
    background: "var(--bg-card)",
    padding: "24px",
    borderRadius: "24px",
    border: "1px solid var(--border-color)",
  },
  itemRow: (resolved) => ({
    display: "flex",
    alignItems: "center",
    padding: "16px",
    marginBottom: "12px",
    background: resolved ? "var(--bg-secondary)" : "var(--bg-card)",
    borderRadius: "16px",
    border: `2px solid ${resolved ? "transparent" : "var(--border-color)"}`,
    transition: "all 0.2s ease",
  }),
  itemText: (resolved) => ({
    flexGrow: 1,
    fontSize: "1.1rem",
    fontWeight: "800",
    color: resolved ? "var(--text-muted)" : "var(--text-main)",
    textDecoration: resolved ? "line-through" : "none",
  }),
  customCheck: (checked) => ({
    width: "26px",
    height: "26px",
    border: `2px solid ${checked ? "var(--primary)" : "var(--text-main)"}`,
    borderRadius: "8px",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: checked ? "var(--primary)" : "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
  }),
  removeBtn: {
    background: "none",
    border: "none",
    color: "var(--danger)",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1.3rem",
    padding: "5px",
  },
};

export default ShoppingListDetail;