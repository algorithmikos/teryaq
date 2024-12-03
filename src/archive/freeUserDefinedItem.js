const addToIndexedDB = async () => {
  try {
    setIsWaiting(true);
    const openDatabase = async () => {
      return openDB("nutritional-guide", 1, {
        upgrade(db) {
          db.createObjectStore("carb-guide", { autoIncrement: true });
        },
      });
    };
    const IndexedDBdb = await openDatabase();

    // Start a transaction in "readonly" mode to get all items
    const getAllTx = IndexedDBdb.transaction("carb-guide", "readonly");
    const getAllStore = getAllTx.objectStore("carb-guide");

    // Get all objects where freeUserDefined exists and is true
    const allItems = await getAllStore.getAll();
    const filteredItems = allItems.filter(
      (item) => item.freeUserDefined === true
    );

    // Sort the filtered array by id
    const sortedItems = filteredItems.sort((a, b) => a.id - b.id);

    // Determine the last id (or set it to 0 if the array is empty)
    const lastId =
      sortedItems.length > 0 ? sortedItems[sortedItems.length - 1].id : 0;

    // Start a new transaction in "readwrite" mode to add the new item
    const addTx = IndexedDBdb.transaction("carb-guide", "readwrite");
    const addStore = addTx.objectStore("carb-guide");

    // Add the new item with the incremented id
    const addedItem = await addStore.add({
      ...formData,
      item: item.trimEnd(),
      qty: qty.trimEnd(),
      freeUserDefined: true,
      id: lastId + 1,
    });

    // Complete the transaction
    await addTx.done;

    toast.success("تمت إضافة الصنف إلى دليلك بنجاح");
    setFormData({ item: "", qty: "", carb: "", type: "edible", tags: [] });
    setIsWaiting(false);
  } catch (error) {
    setIsWaiting(false);
    console.error("Error adding data to IndexedDB:", error);
  }
};