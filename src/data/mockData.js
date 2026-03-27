export const mockLists = [
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
      { id: "i-1", name: "Máslo", state: "unresolved" },
      { id: "i-2", name: "Celozrnný chléb", state: "resolved" },
      { id: "i-3", name: "Mléko", state: "unresolved" },
    ],
  },

  {
    id: "list-002",
    name: "Grilovačka sobota",
    ownerId: "user-123",
    isArchived: false,
    members: [{ id: "m-3", name: "Petr Svoboda" }],
    items: [
      { id: "i-4", name: "Krkovice", state: "unresolved" },
      { id: "i-5", name: "Klobásy", state: "unresolved" },
      { id: "i-6", name: "Hořčice", state: "resolved" },
    ],
  },

  {
    id: "list-003",
    name: "Stavebniny",
    ownerId: "user-123",
    isArchived: false,
    members: [],
    items: [
      { id: "i-7", name: "Cement", state: "unresolved" },
      { id: "i-8", name: "Sádrokarton", state: "unresolved" },
      { id: "i-9", name: "Hřebíky", state: "resolved" },
    ],
  },

  {
    id: "list-004",
    name: "Dárky Vánoce",
    ownerId: "user-456",
    isArchived: true,
    members: [{ id: "m-4", name: "Eva Malá" }],
    items: [
      { id: "i-10", name: "Ponožky", state: "resolved" },
      { id: "i-11", name: "Kniha", state: "resolved" },
    ],
  },

  {
    id: "list-005",
    name: "Lékárna",
    ownerId: "user-123",
    isArchived: false,
    members: [],
    items: [
      { id: "i-12", name: "Paralen", state: "unresolved" },
      { id: "i-13", name: "Vitamín C", state: "unresolved" },
    ],
  },

  {
    id: "list-006",
    name: "Dovolená Itálie",
    ownerId: "user-789",
    isArchived: false,
    members: [
      { id: "m-5", name: "Lucie Horáková" },
      { id: "m-6", name: "Tomáš Dvořák" },
    ],
    items: [
      { id: "i-14", name: "Opalovací krém", state: "resolved" },
      { id: "i-15", name: "Plavky", state: "unresolved" },
      { id: "i-16", name: "Cestovní adaptér", state: "unresolved" },
    ],
  },

  {
    id: "list-007",
    name: "Office nákup",
    ownerId: "user-123",
    isArchived: false,
    members: [{ id: "m-7", name: "Karel Beneš" }],
    items: [
      { id: "i-17", name: "Papír A4", state: "resolved" },
      { id: "i-18", name: "Fixy", state: "unresolved" },
    ],
  },

  {
    id: "list-008",
    name: "Škola – pomůcky",
    ownerId: "user-456",
    isArchived: false,
    members: [],
    items: [
      { id: "i-19", name: "Sešity", state: "unresolved" },
      { id: "i-20", name: "Penál", state: "resolved" },
    ],
  },

  {
    id: "list-009",
    name: "Zahrada",
    ownerId: "user-123",
    isArchived: true,
    members: [],
    items: [
      { id: "i-21", name: "Substrát", state: "resolved" },
      { id: "i-22", name: "Hnojivo", state: "resolved" },
    ],
  },

  {
    id: "list-010",
    name: "Rychlý nákup",
    ownerId: "user-123",
    isArchived: false,
    members: [],
    items: [
      { id: "i-23", name: "Banány", state: "unresolved" },
      { id: "i-24", name: "Jogurt", state: "unresolved" },
    ],
  },
];
