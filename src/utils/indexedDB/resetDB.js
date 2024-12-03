import { toast } from "react-toastify";
import { openDatabase } from "../indexedDB/openDatabase";

export const resetIndexedDB = async () => {
  try {
    const IndexedDBdb = await openDatabase();

    // Start a transaction in "readwrite" mode
    const clearTx = IndexedDBdb.transaction("carb-guide", "readwrite");

    // Get the object store
    const clearStore = clearTx.objectStore("carb-guide");

    // Clear all records from the object store
    clearStore.clear();

    // Complete the transaction
    await clearTx.done;

    toast.success("تمت إعادة ضبط قاعدة البيانات المحلية بنجاح");
  } catch (error) {
    console.error("Error in clearCarbGuide:", error);
  }
};
