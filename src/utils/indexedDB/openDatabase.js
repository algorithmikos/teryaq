import { openDB } from "idb";

export const openDatabase = async () => {
  return openDB("nutritional-guide", 1, {
    upgrade(db) {
      db.createObjectStore("carb-guide", { keyPath: "id" });
    },
  });
};
