import { toast } from "react-toastify";
import { openDatabase } from "../indexedDB/openDatabase";

export const freeUserImport = async () => {
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

    // Create an input element of type file
    const input = document.createElement("input");
    input.type = "file";

    // Promisify the FileReader API to read the selected file as text
    const readFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });

    // Open a file picker dialog
    input.click();

    // Wait for the user to select a file
    const files = await new Promise((resolve) => {
      input.addEventListener("change", () => {
        resolve(input.files);
      });
    });

    if (files.length === 0) {
      console.log("No file selected");
      return;
    }

    // Read the selected file
    const fileContent = await readFile(files[0]);

    // Parse the JSON content
    const importedData = JSON.parse(fileContent);

    // Start a transaction in "readwrite" mode
    const importTx = IndexedDBdb.transaction("carb-guide", "readwrite");

    // Get the object store
    const importStore = importTx.objectStore("carb-guide");

    // Combine saved items and new data
    const combinedData = [...existingData, ...importedData];

    // Clear existing data
    importStore.clear();

    // Add the combined data
    combinedData.forEach((item) => importStore.add(item));

    // Complete the transaction
    await importTx.done;

    toast.success("تم استيراد الأصناف بنجاح");
  } catch (error) {
    console.error("Error in freeUserImport:", error);
  }
};
