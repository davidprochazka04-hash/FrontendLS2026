import React from "react";
import { colors } from "./theme";

/* =========================
   BUTTON STYLES
========================= */

export const buttonBase = {
  borderRadius: "10px",
  padding: "10px 16px",
  fontWeight: "700",
  cursor: "pointer",
  border: "none",
  fontSize: "0.9rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  whiteSpace: "nowrap",
};

export const primaryButton = {
  ...buttonBase,
  background: colors.primary,
  color: "#fff",
};

export const dangerButton = {
  ...buttonBase,
  background: colors.danger,
  color: "#fff",
};

export const secondaryButton = {
  ...buttonBase,
  background: "#f1f3f5",
  color: colors.text,
};

/* =========================
   ICON BASE
========================= */

const Icon = ({ children, color, size = 18 }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color,
      fontSize: size,
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

/* =========================
   ICONS
========================= */

export const AddIcon = ({ size }) => (
  <Icon color={colors.primary} size={size}>
    ＋
  </Icon>
);

export const DeleteIcon = ({ size }) => (
  <Icon color={colors.danger} size={size}>
    ✕
  </Icon>
);


export const EditIcon = ({ size }) => (
  <Icon color={colors.muted} size={size}>
    ✎
  </Icon>
);

export const ArchiveIcon = ({ size }) => (
  <Icon color={colors.muted} size={size}>
    📦
  </Icon>
);

export const RestoreIcon = ({ size }) => (
  <Icon color={colors.primary} size={size}>
    ♻
  </Icon>
);

export const MembersIcon = ({ size }) => (
  <Icon color={colors.muted} size={size}>
    👥
  </Icon>
);

