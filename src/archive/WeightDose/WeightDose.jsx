import React, { useEffect, useState } from "react";
import "./WeightDose.css";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import RedoIcon from "@mui/icons-material/Redo";
import CalculateIcon from "@mui/icons-material/Calculate";
import { unitGrammar } from "../../components/grammar";

const WeightDose = () => {
  const dispatch = useDispatch();
  const guide = useSelector((state) => state.weightGuide);
  const options = guide.map((item) => ({
    label: `${item.item}`,
    value: item._id,
  }));

  const patient = useSelector((state) => state.patient);
  const doses =
    Number(patient.breakfastDose) +
    Number(patient.lunchDose) +
    Number(patient.dinnerDose) +
    Number(patient.organizerDose);

  const carpCoefficient = patient.carpCoefficient || (500 / doses).toFixed(2);

  const [selected, setSelected] = useState([]);
  const [insulinDose, setInsulinDose] = useState(0);
  const [title, setTitle] = useState("أطعمة");

  const [guideSelected, setGuideSelected] = useState([]);

  // Function to calculate total carb
  const calculateTotalCarb = () => {
    const guideSelectedCarbs = guideSelected.map((item) => item.carb);

    // Multiply all carb amounts and divide by carpCoefficient
    const calculatedTotalCarb =
      guideSelectedCarbs.reduce((acc, carb) => acc + carb, 1) / carpCoefficient;

    // Update the state with the calculated total carb
    setInsulinDose(calculatedTotalCarb);
  };

  useEffect(() => {
    if (
      guideSelected.some((item) => item.type === "edible") &&
      guideSelected.some((item) => item.type === "drinkable")
    ) {
      setTitle("راجع الأطعمة والمشروبات");
    } else if (guideSelected.some((item) => item.type === "drinkable")) {
      setTitle("راجع المشروبات");
    } else if (guideSelected && !guideSelected.length > 0) {
      setTitle("راجع الأطعمة");
    }

    console.log(guideSelected);
  }, [guideSelected]);

  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? // selected.map((item, index) => {
        //   const guideItem = guide.find(
        //     (guideItem) => guideItem._id === item.value
        //   )

        //   // Check if guideItem is found before rendering the list item
        //   return guideItem ? (
        //       {guideItem.item} | {guideItem.qty} | ({guideItem.carb}ك)
        //   ) : null
        // })

        selected.map(({ label }) => "✔️ " + label)
      : "ليس هناك أصناف محددة";
  };

  const [openItemMod, setOpenItemMod] = useState(false);
  const [modItem, setModItem] = useState({});
  const getGuideItemCarb = (modItemId) =>
    guide.find((guideItem) => modItemId === guideItem._id)?.carb;
  const handleOpen = () => setOpenItemMod(true);
  const handleClose = () => setOpenItemMod(false);

  const modifyWeight = (weight) => {
    setGuideSelected((prev) => {
      const existingItem = guide.find((item) => modItem._id === item._id);

      // If the item exists in guideSelected, update its carb property
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          carb: existingItem.calc * weight,
        };

        // Remove the old item and add the updated one
        return prev
          .filter((item) => item._id !== modItem._id)
          .concat(updatedItem);
      }

      // If the item doesn't exist, add it to guideSelected
      return [...prev, { ...modItem, carb: modItem.calc * weight }];
    });
    setModItem((prev) => ({
      ...prev,
      carb: prev.calc * weight,
    }));
  };

  const [meal, showMeal] = useState(true);
  const [mealItems, showMealItems] = useState(false);
  const [mealDose, showMealDose] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  return (
    <Grid container spacing={3}>
      {meal && (
        <Grid item xl={6}>
          <h2>الجرعة المحسوبة بالوزن</h2>
          {showWarning && (
            <Alert
              severity="warning"
              className="info-callout"
              onClose={() => setShowWarning(false)}
            >
              الكارب في هذه الأصناف غير محسوب، ويجب إدخال وزن لكل صنف مختار
              ليتمكن التطبيق من حساب الجرعة.
            </Alert>
          )}
          <h3>حدد الأطعمة والمشروبات</h3>
          <Grid
            item
            style={{ width: 250, display: "flex", flexDirection: "column" }}
          >
            <MultiSelect
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy="حدد"
              // ItemRenderer={""}
              valueRenderer={customValueRenderer}
              hasSelectAll={false}
              overrideStrings={{
                allItemsAreSelected: "جميع الأصناف محددة.",
                clearSearch: "delete-search",
                clearSelected: "حذف المحدد",
                noOptions: "لا خيارات",
                search: "بحث",
                selectAll: "اختر الجميع",
                selectAllFiltered: "اختر الجميع (مرشح)",
                selectSomeItems: "اختر...",
                create: "أنشأ",
              }}
            />
            <Button
              style={{ marginTop: 20 }}
              variant="contained"
              onClick={() => {
                setGuideSelected(
                  selected.map((item) =>
                    guide.find((guideItem) => item.value === guideItem._id)
                  )
                );
                showMealItems(true);
                showMeal(false);
              }}
              disabled={selected.length < 1}
            >
              تم التحديد
            </Button>
          </Grid>
        </Grid>
      )}

      <Grid container>
        {mealItems && (
          <Grid item xl={12}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 6 }}>
              حدد أوزان الأصناف المختارة{" "}
              <RedoIcon
                onClick={() => {
                  showMeal(true);
                  showMealItems(false);
                }}
                titleAccess="عد إلى تحديد الأصناف"
              />
            </h3>
            <Alert severity="info" className="info-callout">
              يمكنك ضبط أوزان الأصناف بالضغط على أيقونة الحاسبة{" "}
              <CalculateIcon fontSize="20px" /> الموجودة إلى جانب كل صنف.
            </Alert>
            <ul style={{ lineHeight: 2, padding: 0 }}>
              {selected.map((item, index) => {
                const guideItem = guideSelected.find(
                  (guideItem) => guideItem._id === item.value
                );

                // Check if guideItem is found before rendering the list item
                return guideItem ? (
                  <Grid
                    container
                    key={index}
                    gap={1}
                    marginY={1}
                    justifyContent="space-between"
                    className="selected-item-view"
                  >
                    <li style={{ display: "flex", alignItems: "center" }}>
                      <Typography>
                        {index + 1}. {guideItem.item} | ({guideItem.carb}ك)
                      </Typography>
                      <CalculateIcon
                        sx={{ mr: 1 }}
                        onClick={() => {
                          setModItem(guideItem);
                          setOpenItemMod(true);
                        }}
                      />
                    </li>
                  </Grid>
                ) : null;
              })}
            </ul>
            <Button
              variant="contained"
              onClick={() => {
                calculateTotalCarb();
                showMealDose(true);
                showMealItems(false);
              }}
              disabled={guideSelected.some((item) => item.carb === 0)}
            >
              احسب الجرعة
            </Button>
          </Grid>
        )}

        {mealDose && (
          <Grid item xl={6}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 6 }}>
              جرعة الطعام{" "}
              <RedoIcon
                onClick={() => {
                  showMealItems(true);
                  showMealDose(false);
                }}
                titleAccess="عد إلى مراجعة الأصناف"
              />
            </h3>
            <Typography>
              {unitGrammar(
                selected && selected.length > 0 ? Math.round(insulinDose) : 0
              )}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={openItemMod}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="item-mod-modal"
      >
        <DialogTitle>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modItem.item}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography id="modal-modal-description">
            <li>معامل الضرب: {modItem.calc}</li>
            <li>الكربوهيدرات: {modItem.carb} غرام</li>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            spacing={1}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <FormControl sx={{ width: 150 }} variant="outlined">
              <OutlinedInput
                className="qty-num-input-field"
                id="outlined-adornment-weight"
                endAdornment={<InputAdornment position="end">غ</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                type="number"
                onChange={(e) => modifyWeight(e.target.value)}
              />
              <FormHelperText id="outlined-weight-helper-text">
                الوزن
              </FormHelperText>
            </FormControl>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default WeightDose;
