import * as mock from "./mockCalls";

// PŘEPÍNAČ REŽIMU
const USE_MOCK = true;

const impl = USE_MOCK ? mock : mock;

export const calls = {
  /* =========================
     LISTS
  ========================= */

  listLists: () => impl.listLists(),

  createList: (name, userId) =>
    impl.createList(name, userId),

  deleteList: (id) =>
    impl.deleteList(id),

  updateList: (list) =>
    impl.updateList(list),

  toggleArchive: (id) =>
    impl.toggleArchive(id),

  /* =========================
     ITEMS
  ========================= */

  addItem: (listId, name) =>
    impl.addItem(listId, name),

  removeItem: (listId, itemId) =>
    impl.removeItem(listId, itemId),

  toggleItem: (listId, itemId) =>
    impl.toggleItem(listId, itemId),

  /* =========================
     MEMBERS
  ========================= */

  addMember: (listId, name) =>
    impl.addMember(listId, name),

  removeMember: (listId, memberId) =>
    impl.removeMember(listId, memberId),
};