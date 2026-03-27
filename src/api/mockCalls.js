import { mockLists } from "../data/mockData";

let lists = [...mockLists];

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* =========================
   LISTS
========================= */

export async function listLists() {
  await delay();
  return [...lists];
}

export async function createList(name, currentUserId) {
  await delay();

  const newList = {
    id: `list-${Date.now()}`,
    name,
    ownerId: currentUserId,
    isArchived: false,
    members: [],
    items: [],
  };

  lists.push(newList);
  return newList;
}

export async function deleteList(id) {
  await delay();
  lists = lists.filter((l) => l.id !== id);
}

export async function updateList(updatedList) {
  await delay();

  lists = lists.map((l) =>
    l.id === updatedList.id ? updatedList : l
  );

  return updatedList;
}

export async function toggleArchive(id) {
  await delay();

  lists = lists.map((l) =>
    l.id === id ? { ...l, isArchived: !l.isArchived } : l
  );

  return lists.find((l) => l.id === id);
}

/* =========================
   ITEMS
========================= */

export async function addItem(listId, name) {
  await delay();

  lists = lists.map((l) =>
    l.id === listId
      ? {
          ...l,
          items: [
            ...(l.items || []),
            {
              id: `item-${Date.now()}`,
              name,
              state: "unresolved",
            },
          ],
        }
      : l
  );

  return lists.find((l) => l.id === listId);
}

export async function removeItem(listId, itemId) {
  await delay();

  lists = lists.map((l) =>
    l.id === listId
      ? {
          ...l,
          items: l.items.filter((i) => i.id !== itemId),
        }
      : l
  );

  return lists.find((l) => l.id === listId);
}

export async function toggleItem(listId, itemId) {
  await delay();

  lists = lists.map((l) =>
    l.id === listId
      ? {
          ...l,
          items: l.items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  state:
                    i.state === "resolved"
                      ? "unresolved"
                      : "resolved",
                }
              : i
          ),
        }
      : l
  );

  return lists.find((l) => l.id === listId);
}

/* =========================
   MEMBERS
========================= */

export async function addMember(listId, memberName) {
  await delay();

  lists = lists.map((l) =>
    l.id === listId
      ? {
          ...l,
          members: [
            ...(l.members || []),
            {
              id: `member-${Date.now()}`,
              name: memberName,
            },
          ],
        }
      : l
  );

  return lists.find((l) => l.id === listId);
}

export async function removeMember(listId, memberId) {
  await delay();

  lists = lists.map((l) =>
    l.id === listId
      ? {
          ...l,
          members: l.members.filter(
            (m) => m.id !== memberId
          ),
        }
      : l
  );

  return lists.find((l) => l.id === listId);
}