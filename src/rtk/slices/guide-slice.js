import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { openDB } from "idb";
import { hardcodedGuide } from "../../utils/hardcodedGuide";
import { useDispatch } from "react-redux";

// Your existing code for the slice
const GuideSlice = createSlice({
  name: "GuideSlice",
  initialState: {
    carbGuide: [],
    status: "idle",
    hardcoded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setGuide.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setGuide.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.carbGuide = action.payload.carbGuide;
        state.hardcoded = action.payload.hardcoded;
      })
      .addCase(setGuide.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Define an async function to open the IndexedDB database
const openDatabase = async () => {
  return openDB("nutritional-guide", 1, {
    upgrade(db) {
      db.createObjectStore("carb-guide", { keyPath: "id" });
    },
  });
};

// Async thunk to fetch users
// export const fetchGuide = createAsyncThunk(
//   "GuideSlice/fetchGuide",
//   async (_, { getState }) => {
//     const IndexedDBdb = await openDatabase();
//     const dbGuideItems = await getDocs(collection(db, "carb_guide"));

//     const guide = dbGuideItems.docs.map((doc) => {
//       const id = doc.id;
//       return { id, ...doc.data() };
//     });

//     // Save data to IndexedDB
//     const tx = IndexedDBdb.transaction("carb-guide", "readwrite");
//     const store = tx.objectStore("carb-guide");
//     guide.forEach((item) => store.put(item));
//     await tx.done;

//     return { guide };
//   }
// );

export const fetchGuide = createAsyncThunk(
  "GuideSlice/fetchGuide",
  async (_, { getState }) => {
    const IndexedDBdb = await openDatabase();

    // Check if there are any existing items in the object store
    const hasExistingData = await new Promise((resolve) => {
      const checkTx = IndexedDBdb.transaction("carb-guide", "readonly");
      const checkStore = checkTx.objectStore("carb-guide");

      checkStore.count().onsuccess = function (event) {
        const count = event.target.result;
        resolve(count > 0);
      };

      checkTx.oncomplete = checkTx.onerror = function () {
        resolve(false);
      };
    });

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

    // Fetch new data from Firestore
    const dbGuideItems = await getDocs(collection(db, "carb_guide"));
    const newData = dbGuideItems.docs.map((doc) => {
      const id = doc.id;
      return { id, ...doc.data() };
    });

    // Combine saved items and new data
    const combinedData = [...savedItems, ...newData];

    // Overwrite the entire data in IndexedDB with the combined data
    const writeTx = IndexedDBdb.transaction("carb-guide", "readwrite");
    const writeStore = writeTx.objectStore("carb-guide");

    // Clear existing data
    writeStore.clear();

    // Add the combined data
    combinedData.forEach((item) => writeStore.add(item));

    await writeTx.done;

    return { guide: combinedData };
  }
);

export const superFetchGuide = createAsyncThunk(
  "GuideSlice/fetchGuide",
  async (_, { getState }) => {
    const IndexedDBdb = await openDatabase();
    const dbGuideItems = await getDocs(collection(db, "carb_guide"));

    const guide = dbGuideItems.docs.map((doc) => {
      const id = doc.id;
      return { id, ...doc.data() };
    });

    // Save data to IndexedDB
    const tx = IndexedDBdb.transaction("carb-guide", "readwrite");
    const store = tx.objectStore("carb-guide");
    guide.forEach((item) => store.put(item));
    await tx.done;

    // Save data to a JSON file
    const jsonData = JSON.stringify(guide, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger a download
    const link = document.createElement("a");
    link.href = url;
    link.download = "guideData.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { guide };
  }
);

export const setGuide = createAsyncThunk(
  "GuideSlice/setGuide",
  async (_, { getState }) => {
    const IndexedDB = await openDatabase();

    const tx = IndexedDB.transaction("carb-guide", "readonly");
    const store = tx.objectStore("carb-guide");

    let carbGuide = await store.getAll();
    let hardcoded = false;

    if (carbGuide.length === 0) {
      carbGuide = hardcodedGuide;
      hardcoded = true;
    }

    return { carbGuide, hardcoded };
  }
);

export const updateGuideItem = createAsyncThunk(
  "GuideSlice/updateGuideItem",
  async ({ itemId, updatedData }, { getState }) => {
    const IndexedDB = await openDatabase();

    // Get the item from IndexedDB
    const tx = IndexedDB.transaction("carb-guide", "readwrite");
    const store = tx.objectStore("carb-guide");
    const existingItem = await store.get(itemId);

    if (existingItem) {
      // Update the existing item with the new data
      const updatedItem = { ...existingItem, ...updatedData };
      console.log(existingItem, updatedData, updatedItem);
      await store.put(updatedItem);
      await tx.done;
    } else {
      // Handle the case when the item is not found
      console.error(`Item with ID ${itemId} not found`);
    }
  }
);

// Async thunk to delete a guide item
export const deleteGuideItem = createAsyncThunk(
  "GuideSlice/deleteGuideItem",
  async (itemId, { getState }) => {
    const IndexedDB = await openDatabase();

    // Delete the item from IndexedDB
    const tx = IndexedDB.transaction("carb-guide", "readwrite");
    const store = tx.objectStore("carb-guide");
    await store.delete(itemId);
    await tx.done;
  }
);

export default GuideSlice.reducer;
