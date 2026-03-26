export const mockShoppingLists = [
  {
    id: "list-001",
    name: "Nákup v Albertu",
    ownerId: "user-123",
    isArchived: false,
    members: [{ id: "user-456", name: "Jan Novák" }],
    items: [
      { id: "i1", name: "Máslo", state: "unresolved" },
      { id: "i2", name: "Rohlíky", state: "resolved" }
    ]
  },
  {
    id: "list-002",
    name: "Stavebniny",
    ownerId: "user-123",
    isArchived: false,
    members: [],
    items: [{ id: "i3", name: "Cement", state: "unresolved" }]
  }
];