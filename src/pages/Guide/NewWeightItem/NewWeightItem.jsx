import React, { useState } from "react";
import "./NewWeightItem.css";
import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { toast } from "react-toastify";
import { openDB } from "idb";
import { setGuide } from "../../../rtk/slices/guide-slice";
import { useDispatch } from "react-redux";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "خضر",
  "فواكه",
  "لحوم",
  "أسماك",
  "بيض",
  "منتجات الألبان",
  "منتجات الحبوب والنشويات",
  "مأكولات بحرية",
  "مشتقات السكر",
  "مأكولات عالمية",
  "مشروبات",
  "مأكولات نباتية",
  "حساء وشوربة",
  "مكملات غذائية",
];

const NewItem = () => {
  const dispatch = useDispatch();
  const [isWaiting, setIsWaiting] = useState(false);

  const [formData, setFormData] = useState({
    item: "",
    calc: "",
    carb: 0,
    type: "edible",
    tags: [],
  });

  const { item, calc, type, tags } = formData;

  const handleTagsChange = (event) => {
    const {
      target: { value },
    } = event;

    setFormData({
      ...formData,
      tags: typeof value === "string" ? value.split(",") : value,
    });
  };

  const addToIndexedDB = async (id) => {
    try {
      const openDatabase = async () => {
        return openDB("nutritional-guide", 1, {
          upgrade(db) {
            db.createObjectStore("carb-guide", { keyPath: "id" });
          },
        });
      };
      const IndexedDBdb = await openDatabase();

      // Start a new transaction in "readwrite" mode to add the new item
      const addTx = IndexedDBdb.transaction("carb-guide", "readwrite");
      const addStore = addTx.objectStore("carb-guide");

      // Add the new item with the incremented id
      await addStore.add({
        ...formData,
        item: item.trimEnd(),
        qty: qty.trimEnd(),
        id: id,
      });

      // Complete the transaction
      await addTx.done;

      toast.success("تمت إضافة الصنف إلى دليلك بنجاح");
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
    }
  };

  const handleSaveItem = async () => {
    try {
      setIsWaiting(true);

      // Reference to the "carb_guide" collection
      const carbGuideCollection = collection(db, "carb_guide");

      const docRef = await addDoc(carbGuideCollection, formData);

      // Add a new document in collection "carb_guide" with an automatically generated ID
      if (docRef && docRef.id) {
        toast.success("مرحى! لدينا صنف جديد");
      }

      addToIndexedDB(docRef.id);
      dispatch(setGuide());
      setFormData({ item: "", calc: "", type: "edible", tags: [] });
      setIsWaiting(false);
    } catch (error) {
      setIsWaiting(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Saving Error:", errorCode, errorMessage);
    }
  };

  const capitalise = (inputString) => {
    let words = inputString.split(" ");
    let capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    let resultString = capitalizedWords.join(" ");
    return resultString;
  };

  return (
    <>
      {/* Form Section */}
      <Grid
        container
        spacing={2}
        className="login-container"
        alignItems="center"
        maxWidth={500}
      >
        {/* Item Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <TextField
            label="اسم الصنف"
            variant="outlined"
            fullWidth
            value={item}
            onChange={(e) =>
              setFormData({
                ...formData,
                item: capitalise(e.target.value),
              })
            }
            type="text"
          />
        </Grid>
        {/* End of Item Field */}

        {/* Multiplication coefficient Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <TextField
            label="معامل الضرب"
            variant="outlined"
            fullWidth
            type="number"
            value={calc}
            onChange={(e) =>
              setFormData({
                ...formData,
                calc: Number(e.target.value),
              })
            }
          />
        </Grid>
        {/* End of Multiplication coefficient Field */}

        {/* Type Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <FormControl fullWidth>
            <InputLabel>النوع</InputLabel>
            <Select
              label="النوع"
              value={type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value,
                })
              }
            >
              <MenuItem value="اختر" selected disabled>
                اختر النوع
              </MenuItem>
              <MenuItem value="edible">طعام</MenuItem>
              <MenuItem value="drinkable">شراب</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* End of Type Field */}

        {/* Tags Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <FormControl fullWidth>
            <InputLabel>الوسوم</InputLabel>
            <Select
              label="الوسوم"
              multiple
              value={tags}
              onChange={handleTagsChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(" و")}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={tags.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* End of Tags Field */}

        {/* Submit Button */}
        <Grid item xl={12} xs={12} style={{ textAlign: "center" }}>
          <LoadingButton
            loading={isWaiting}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={() => {
              handleSaveItem();
              // addToIndexedDB();
            }}
            disabled={!item || !calc || !type || tags.length < 1}
          >
            حفظ الصنف
          </LoadingButton>
        </Grid>
        {/* End of Submit Button */}
      </Grid>
      {/* End of Form Section */}
    </>
  );
};

export default NewItem;
