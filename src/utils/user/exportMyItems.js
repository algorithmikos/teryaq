import { openDatabase } from "../indexedDB/openDatabase";

export const freeUserExport = async () => {
  try {
    const IndexedDBdb = await openDatabase();

    // Check if there are any existing items in the object store
    const checkTx = IndexedDBdb.transaction("carb-guide", "readonly");
    const checkStore = checkTx.objectStore("carb-guide");

    const count = await checkStore.count();
    const hasExistingData = count > 0;

    let existingData = [];

    if (hasExistingData) {
      // Fetch existing data from IndexedDB
      const existingTx = IndexedDBdb.transaction("carb-guide", "readonly");
      const existingStore = existingTx.objectStore("carb-guide");
      existingData = await existingStore.getAll();
      await existingTx.done;
    }

    // Identify items with freeUserDefined set to true and save them
    const savedItems = existingData.filter(
      (item) => item.freeUserDefined === true
    );

    // Save data to a JSON file
    const jsonData = JSON.stringify(savedItems, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString();

    // Create a link and trigger a download
    const link = document.createElement("a");
    link.href = url;
    link.download = `myGuideItems_${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error in freeUserImport:", error);
  }
};

export const premiumUserExport = async () => {
  try {
    const IndexedDBdb = await openDatabase();

    // Check if there are any existing items in the object store
    const checkTx = IndexedDBdb.transaction("carb-guide", "readonly");
    const checkStore = checkTx.objectStore("carb-guide");

    const count = await checkStore.count();
    const hasExistingData = count > 0;

    let existingData = [];

    if (hasExistingData) {
      // Fetch existing data from IndexedDB
      const existingTx = IndexedDBdb.transaction("carb-guide", "readonly");
      const existingStore = existingTx.objectStore("carb-guide");
      existingData = await existingStore.getAll();
      await existingTx.done;
    }

    // Identify items with premiumUserDefined set to true and save them
    const savedItems = existingData.filter(
      (item) => item.premiumUserDefined === true
    );

    // Save data to a JSON file
    const jsonData = JSON.stringify(savedItems, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString();

    // Create a link and trigger a download
    const link = document.createElement("a");
    link.href = url;
    link.download = `myGuideItems_${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error in freeUserImport:", error);
  }
};

