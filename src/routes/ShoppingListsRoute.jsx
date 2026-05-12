import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
  const { t } = useTranslation();
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Přístup: owner nebo člen
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

  // Data pro sloupcový graf (vizualizace počtu položek v seznamech)
  const chartData = useMemo(() => {
    return filteredLists.map(list => ({
      name: list.name,
      count: (list.items || []).length
    }));
  }, [filteredLists]);

  const handleCreate = (name) => {
    onCreateList(name);
    setIsModalOpen(false);
  };

  const handleDelete = (e, list) => {
    e.stopPropagation();
    if (window.confirm(t('modal.confirmDelete', `Opravdu chcete smazat seznam "${list.name}"?`))) {
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

      {/* STATISTIKA: Sloupcový graf počtu položek */}
      {chartData.length > 0 && (
        <div style={styles.chartSection}>
          <h2 style={styles.chartTitle}>{t('header.mainTitle', 'Moje nákupní seznamy')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
              <Bar 
                dataKey="count" 
                name={t('route.itemCountLabel', 'Počet')} 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="var(--primary)" opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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
                          ? t('detail.activeList')
                          : t('detail.archivedList')
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
                      title={t('detail.delete')}
                      onClick={(e) => handleDelete(e, list)}
                      style={styles.deleteIconBtn}
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.meta}>
                <div>{t('route.itemsCount')}: {(list.items || []).length}</div>
                <div>
                  {t('route.roleLabel', 'Role')}: {isOwner ? t('route.owner') : t('route.member')}
                </div>

                {list.isArchived && (
                  <div style={styles.archivedBadge}>
                    {t('detail.archiveBadge', 'Archivováno')}
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
  chartSection: {
    background: "var(--bg-card)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    marginBottom: "30px",
  },
  chartTitle: {
    fontSize: "1.2rem",
    fontWeight: "800",
    color: "var(--text-main)",
    marginBottom: "15px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    marginTop: "30px",
  },
  card: {
    border: "1px solid var(--border-color)",
    padding: "24px",
    cursor: "pointer",
    background: "var(--bg-card)",
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
    color: "var(--text-main)",
    fontWeight: "800",
  },
  actions: {
    display: "flex",
    gap: "6px",
  },
  iconBtn: {
    background: "transparent",
    border: "1px solid var(--border-color)",
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
    color: "var(--danger)",
    lineHeight: "1",
    padding: "4px 6px",
    borderRadius: "8px",
  },
  meta: {
    display: "grid",
    gap: 6,
    color: "var(--text-main)",
    fontWeight: 600,
  },
  archivedBadge: {
    display: "inline-block",
    marginTop: 8,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(255, 77, 79, 0.1)",
    color: "var(--danger)",
    width: "fit-content",
    fontSize: 12,
    fontWeight: 800,
  },
};

export default ShoppingListsRoute;